"use client";

import { useEffect, useState } from "react";

interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

export default function BlogTOC({ htmlContent }: { htmlContent: string }) {
  const [headings, setHeadings] = useState<HeadingItem[]>([]);

  useEffect(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");

    // اضافه کردن id به هدینگ ها
    doc.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach((el) => {
      if (!el.id) {
        el.id =
          el.textContent
            ?.toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]+/g, "") || "";
      }
    });

    const headingElements = Array.from(
      doc.querySelectorAll("h1,h2,h3,h4,h5,h6")
    );
    const items: HeadingItem[] = headingElements.map((el) => ({
      id: el.id,
      text: el.textContent || "",
      level: parseInt(el.tagName.replace("H", "")),
    }));

    setHeadings(items);

    // جایگذاری HTML در DOM واقعی
    const contentDiv = document.getElementById("blog-content");
    if (contentDiv) contentDiv.innerHTML = doc.body.innerHTML;
  }, [htmlContent]);

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="flex flex-col  gap-8">
      <nav className="w-full md:w-1/4 sticky top-24 h-max bg-gray-50 p-4 rounded-lg">
        <h3 className="font-bold mb-2 text-lg">فهرست مطالب</h3>
        <ul className="space-y-1">
          {headings.map((h) => (
            <li
              key={h.id}
              className={`cursor-pointer hover:text-blue-600 ml-${
                (h.level - 1) * 4
              }`}
              onClick={() => handleClick(h.id)}
            >
              {h.text}
            </li>
          ))}
        </ul>
      </nav>

      <article
        id="blog-content"
        className="prose prose-lg max-w-none 
        prose-a:no-underline 
        prose-a:text-blue-600 
        prose-a:hover:text-blue-800
        prose-img:object-fill
        prose-img:rounded-2xl 
        prose-img:my-40 flex-1"
      />
    </div>
  );
}
