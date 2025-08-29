import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import Image from "next/image";
import BlogTOC from "@/components/static/ui/blogToc";

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

    return blogs.find((blog: any) => blog.id === id) || null;
  } catch (error) {
    return null;
  }
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
    <div className="max-w-4xl mx-auto flex flex-col px-4 py-8 mt-20" dir="rtl">
      <BlogTOC htmlContent={blog.contentHtml} />
    </div>
  );
}
