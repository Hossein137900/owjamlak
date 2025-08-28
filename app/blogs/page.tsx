 import { Metadata } from "next";
import BlogContainer from "@/components/static/blogs/blogContainer";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: "وبلاگ اوج | مقالات و راهنمای خرید و فروش ملک",
  description:
    "آخرین مقالات و راهنماهای تخصصی در زمینه خرید، فروش، اجاره و سرمایه‌گذاری در بازار املاک ایران",
};

const BlogsPage = () => {
  return (
    <main className="">
      <BlogContainer />
    </main>
  );
};

export default BlogsPage;
