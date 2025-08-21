import { NextRequest, NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode';

// Simple in-memory rate limiting (use Redis in production)
const rateLimitMap = new Map();

type TokenPayload = {
  id?: string;
  _id?: string;
  exp?: number;
};

function getRateLimitKey(request: NextRequest): { key: string; maxRequests: number; isAuthenticated: boolean } {
  // Check for JWT token
  const token = request.headers.get('token') || request.headers.get('authorization')?.replace('Bearer ', '');
  
  if (token) {
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      const userId = decoded.id || decoded._id;
      
      // Check if token is expired
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        throw new Error('Token expired');
      }
      
      if (userId) {
        return {
          key: `user_${userId}`,
          maxRequests: 700, // Higher limit for authenticated users
          isAuthenticated: true
        };
      }
    } catch (error) {
      // Invalid token, treat as anonymous
    }
  }
  
  // Fallback to IP-based rate limiting for anonymous users
  const userAgent = request.headers.get('user-agent') || 'unknown';
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const clientId = `${forwardedFor || realIp || 'unknown'}_${userAgent.slice(0, 50)}`;
  
  return {
    key: `anon_${clientId}`,
    maxRequests: 300, // Lower limit for anonymous users
    isAuthenticated: false
  };
}

export function middleware(request: NextRequest) {
  // Rate limiting for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const { key, maxRequests, isAuthenticated } = getRateLimitKey(request);
    
    const now = Date.now();
    const windowMs = 15 * 60 * 1000; // 15 minutes

    if (!rateLimitMap.has(key)) {
      rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    } else {
      const userData = rateLimitMap.get(key);
      
      if (now > userData.resetTime) {
        // Reset window
        rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
      } else {
        userData.count++;
        
        if (userData.count > maxRequests) {
          return NextResponse.json(
            { 
              error: 'Too many requests',
              message: isAuthenticated 
                ? `Rate limit: ${maxRequests} requests per 15 minutes for authenticated users`
                : `Rate limit: ${maxRequests} requests per 15 minutes. Login for higher limits.`
            },
            { status: 429 }
          );
        }
      }
    }
  }

  // Security headers
  const response = NextResponse.next();
  
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Prevent access to sensitive files
  if (request.nextUrl.pathname.includes('/.env') || 
      request.nextUrl.pathname.includes('/config/') ||
      request.nextUrl.pathname.includes('/.git/')) {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 });
  }

  return response;
}

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};