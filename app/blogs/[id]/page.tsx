import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getBlog(id: string) {
  try {
    const dataPath = path.join(process.cwd(), 'data', 'blogs.json');
    
    if (!fs.existsSync(dataPath)) {
      return null;
    }
    
    const fileContent = fs.readFileSync(dataPath, 'utf8');
    const blogs = JSON.parse(fileContent);
    
    return blogs.find((blog: any) => blog.id === id) || null;
  } catch (error) {
    return null;
  }
}

export default async function BlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const blog = await getBlog(id);
  
  if (!blog) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 mt-20" dir="rtl">
      <article>
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
          <div className="flex items-center gap-4 text-gray-600 mb-4">
            <span>{blog.author}</span>
            <span>{blog.date}</span>
            <span>{blog.readTime}</span>
          </div>
          {blog.coverImage && (
            <img 
              src={blog.coverImage} 
              alt={blog.title}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
          )}
        </header>
        
        <div 
          className="prose prose-lg max-w-none prose-img:w-full prose-img:h-64 prose-img:object-cover prose-img:rounded-lg prose-img:my-4"
          dangerouslySetInnerHTML={{ __html: blog.contentHtml }}
        />
        

        
        {blog.tags && blog.tags.length > 0 && (
          <div className="mt-8">
            <h3 className="font-bold mb-2">برچسبها:</h3>
            <div className="flex gap-2">
              {blog.tags.map((tag: string, index: number) => (
                <span 
                  key={index}
                  className="bg-gray-200 px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}