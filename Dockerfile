# Use the official Node.js 18 Alpine image
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the public folder
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copy the build output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Create entrypoint script
RUN echo '#!/bin/sh' > /entrypoint.sh && \
    echo 'mkdir -p /app/public/uploads/posters /app/public/uploads/blog /app/public/uploads/consultants /app/public/uploads/videos' >> /entrypoint.sh && \
    echo 'chown -R nextjs:nodejs /app/public/uploads' >> /entrypoint.sh && \
    echo 'chmod -R 777 /app/public/uploads' >> /entrypoint.sh && \
    echo 'exec su-exec nextjs "$@"' >> /entrypoint.sh && \
    chmod +x /entrypoint.sh

RUN apk add --no-cache su-exec

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

ENTRYPOINT ["/entrypoint.sh"]
CMD ["node", "server.js"]