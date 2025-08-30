import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import Image from "next/image";
import BlogTOC from "@/components/static/ui/blogToc";
import { Metadata } from "next";
import { Blog } from "@/types/type";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getBlog(id: string) {
  try {
    const dataPath = path.join(process.cwd(), "data", "blogs.json");

    if (!fs.existsSync(dataPath)) {
      return null;
    }

    const fileContent = fs.readFileSync(dataPath, "utf8");
    const blogs = JSON.parse(fileContent);

    return blogs.find((blog: Blog) => blog.id === id) || null;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const blog = await getBlog(id);
  console.log(blog);

  if (!blog) {
    return {
      title: "بلاگ یافت نشد",
      description: "بلاگ مورد نظر یافت نشد",
    };
  }

  return {
    title: blog.seoTitle || blog.title,
    description: blog.excerpt,
    keywords: blog.tags.join(", "),
    authors: [{ name: blog.author }],
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      images: [
        {
          url: blog.coverImage,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
      type: "article",
      publishedTime: blog.date,
      authors: [blog.author],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.excerpt,
      images: [blog.coverImage],
    },
    alternates: {
      canonical: `/blogs/${id}`,
    },
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const blog = await getBlog(id);

  if (!blog) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Hero Section */}
      <div className="relative   h-screen mb-8">
        <Image
          src={blog.coverImage}
          alt={blog.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-white">
          <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
          <p className="text-lg text-gray-200 mb-4">{blog.excerpt}</p>
          <div className="flex items-center gap-4 text-sm">
            <span>{blog.author}</span>
            <span>•</span>
            <span>{blog.date}</span>
            <span>•</span>
            <span>{blog.readTime}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-8">
        <BlogTOC htmlContent={blog.contentHtml} />
      </div>

      {/* Tags Section */}
      <div className="bg-white border-t px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-lg text-black font-semibold mb-4">برچسب‌ها</h3>
          <div className="flex flex-wrap gap-2">
            {blog.tags.map((tag: string, index: number) => (
              <span
                key={index}
                className="px-3 py-1 bg-gradient-to-r from-[#01ae9b] to-[#02c2ad] text-white text-sm rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
