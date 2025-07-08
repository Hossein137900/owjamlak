import Image from "next/image";
import Link from "next/link";
import { blogs } from "@/data/data";
import { notFound } from "next/navigation";
import { FaCalendarAlt, FaClock, FaTag, FaUser } from "react-icons/fa";
import BlogCommentSection from "@/components/static/blogs/blogCommentSection";

// Update the types for the page props to handle Promise params
type BlogPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

// Generate static params for all blogs
export async function generateStaticParams() {
  return blogs.map((blog) => ({
    slug: blog.id,
  }));
}

export default async function BlogPage({ params }: BlogPageProps) {
  // Await the params since it's now a Promise in Next.js 15
  const { slug } = await params;

  // Find the blog by slug (id)
  const blog = blogs.find((blog) => blog.id === slug);

  // If blog not found, return 404
  if (!blog) {
    notFound();
  }

  // Get related blogs (same category, excluding current blog)
  const relatedBlogs = blogs
    .filter((b) => b.category === blog.category && b.id !== blog.id)
    .slice(0, 3);

  return (
    <main className="container mx-auto px-6 md:px-3  mt-28  max-w-5xl">
      {/* Back button */}

      {/* Blog header */}
      <div className="mb-8">
        <h1 className="text-xl text-black/80 md:text-4xl font-bold mb-4 text-right">
          {blog.title}
        </h1>
        <div className="flex flex-wrap justify-end gap-4 text-gray-600 mb-6">
          <div className="flex items-center">
            <FaUser className="ml-1" />
            <span>{blog.author}</span>
          </div>
          <div className="flex items-center">
            <FaCalendarAlt className="ml-1" />
            <span>{blog.date}</span>
          </div>
          <div className="flex items-center">
            <FaClock className="ml-1" />
            <span>{blog.readTime}</span>
          </div>
          <div className="flex items-center">
            <FaTag className="ml-1" />
            <span>{blog.category}</span>
          </div>
        </div>
      </div>

      {/* Featured image */}
      <div className="relative w-full h-[300px] md:h-[400px] mb-8 rounded-lg overflow-hidden">
        <Image
          src={blog.coverImage}
          alt={blog.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Table of contents */}
      {blog.tableOfContents && (
        <div className="bg-gray-50 p-4 rounded-lg mb-8 border border-gray-200">
          <h2 className="text-xl text-black font-bold mb-4 text-right">
            فهرست مطالب
          </h2>
          <ul className="space-y-2 text-right">
            {blog.tableOfContents.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Blog content using dangerouslySetInnerHTML */}
      <div className="prose prose-lg text-black max-w-none text-right">
        {blog.contentHtml ? (
          <div dangerouslySetInnerHTML={{ __html: blog.contentHtml }} />
        ) : (
          <p className="text-center text-gray-500 py-10">
            محتوای این مقاله در دسترس نیست.
          </p>
        )}
      </div>

      {/* Author info */}
      <div className="bg-gray-50 p-6 rounded-lg my-8 border border-gray-200">
        <h3 className="text-xl font-bold mb-4 text-black text-right">
          درباره نویسنده
        </h3>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-300 flex-shrink-0">
            <Image
              src="/assets/images/avatar-placeholder.jpg"
              alt={blog.author}
              width={80}
              height={80}
              className="object-cover"
            />
          </div>
          <div className="text-center md:text-right">
            <h4 className="font-bold text-lg">{blog.author}</h4>
            <p className="text-gray-600 mt-2">
              کارشناس ارشد حوزه املاک و مستغلات با بیش از ۱۰ سال تجربه در بازار
              مسکن ایران. متخصص در زمینه مشاوره خرید و فروش املاک مسکونی و
              تجاری.
            </p>
          </div>
        </div>
      </div>

      {/* Related blogs */}
      {relatedBlogs.length > 0 && (
        <div className="mt-12">
          <h3 className="text-2xl font-bold mb-6 text-right">مقالات مرتبط</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedBlogs.map((relatedBlog) => (
              <Link
                href={`/blogs/${relatedBlog.id}`}
                key={relatedBlog.id}
                className="block group"
              >
                <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative h-48 w-full">
                    <Image
                      src={relatedBlog.coverImage}
                      alt={relatedBlog.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-lg mb-2 text-right group-hover:text-blue-600 transition-colors">
                      {relatedBlog.title}
                    </h4>
                    <p className="text-gray-600 text-sm text-right line-clamp-2">
                      {relatedBlog.excerpt}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Comment section - new implementation */}
      <div className="mt-12 border-t pt-8">
        <h3 className="text-2xl font-bold mb-6 text-right">نظرات</h3>
        <BlogCommentSection blogId={blog.id} />
      </div>
    </main>
  );
}
