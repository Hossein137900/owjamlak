// utils/slugify.ts
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\u0600-\u06FF]/g, "") // حذف حروف فارسی برای slug انگلیسی
    .replace(/[^a-z0-9 -]/g, "") // حذف علامت‌ها
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
