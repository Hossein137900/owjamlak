"use client";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import BlogAuthGuard from "@/components/static/admin/blogs/BlogAuthGuard";
import AddPostBlog from "@/components/static/admin/blogs/addPostBlog";

export default function AddBlogPageWrapper() {
  return (
    <AdminAuthProvider>
      <BlogAuthGuard>
        <AddPostBlog />
      </BlogAuthGuard>
    </AdminAuthProvider>
  );
}
