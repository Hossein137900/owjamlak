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
    doc.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach((el, index) => {
      if (!el.id) {
        const cleanText =
          el.textContent
            ?.trim()
            .replace(/\s+/g, "-")
            .replace(/[^\u0600-\u06FF\w-]+/g, "")
            .toLowerCase() || `heading-${index}`;
        el.id = cleanText || `heading-${index}`;
      }
    });

    const headingElements = Array.from(
      doc.querySelectorAll("h1,h2,h3,h4,h5,h6")
    );
    const items: HeadingItem[] = headingElements.map((el, index) => ({
      id: el.id || `heading-${index}`,
      text: el.textContent?.trim() || "",
      level: parseInt(el.tagName.replace("H", "")),
    }));

    setHeadings(items);

    // جایگذاری HTML در DOM واقعی
    const contentDiv = document.getElementById("blog-content");
    if (contentDiv) {
      contentDiv.innerHTML = doc.body.innerHTML;

      // اطمینان از وجود ID در DOM واقعی
      setTimeout(() => {
        contentDiv
          .querySelectorAll("h1,h2,h3,h4,h5,h6")
          .forEach((el, index) => {
            if (!el.id) {
              const cleanText =
                el.textContent
                  ?.trim()
                  .replace(/\s+/g, "-")
                  .replace(/[^\u0600-\u06FF\w-]+/g, "")
                  .toLowerCase() || `heading-${index}`;
              el.id = cleanText || `heading-${index}`;
            }
          });
      }, 100);
    }
  }, [htmlContent]);

  const handleClick = (id: string) => {
    console.log("Clicking on:", id);
    const el = document.getElementById(id);
    console.log("Found element:", el);
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    } else {
      console.warn(`Element with id '${id}' not found`);
    }
  };

  return (
    <div
      className="grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-7xl mx-auto"
      dir="rtl"
    >
      <nav className="lg:col-span-1 order-1 lg:order-2">
        <div className="sticky top-24 bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-[#01ae9b] to-[#02c2ad] p-4">
            <h3 className="font-bold text-white text-lg flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 16a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
              </svg>
              فهرست مطالب
            </h3>
          </div>
          <div className="p-4 max-h-96  ">
            <ul className="space-y-2">
              {headings.map((h, index) => (
                <li key={`${h.id}-${index}`}>
                  <button
                    onClick={() => handleClick(h.id)}
                    className={`
                      w-full text-right p-2 rounded-lg transition-all duration-200
                      hover:bg-gradient-to-r hover:from-[#01ae9b]/10 hover:to-[#02c2ad]/10
                      hover:border-r-4 hover:border-[#01ae9b]
                      text-sm leading-relaxed
                      ${
                        h.level === 1
                          ? "font-semibold text-gray-800"
                          : h.level === 2
                          ? "font-medium text-gray-700 mr-4"
                          : "text-gray-600 mr-8"
                      }
                    `}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          h.level === 1
                            ? "bg-[#01ae9b]"
                            : h.level === 2
                            ? "bg-[#02c2ad]"
                            : "bg-gray-400"
                        }`}
                      />
                      {h.text}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      <article
        id="blog-content"
        className="lg:col-span-3 order-2 lg:order-1 prose prose-lg max-w-none 
        prose-a:no-underline 
        prose-a:text-blue-600 
        prose-a:hover:text-blue-800
        prose-img:object-fill
        prose-img:rounded-2xl 
        prose-img:my-8
        prose-headings:text-gray-800
        prose-p:text-gray-700
        prose-p:leading-relaxed"
      />
    </div>
  );
}
