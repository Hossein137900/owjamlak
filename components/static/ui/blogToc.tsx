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

    // اضافه کردن id به هدینگ ها (فقط H1 تا H4)
    doc.querySelectorAll("h1,h2,h3,h4").forEach((el, index) => {
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

    // فقط هدینگ های H1 تا H4 را در نظر بگیر
    const headingElements = Array.from(doc.querySelectorAll("h1,h2,h3,h4"));
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

      // اطمینان از وجود ID در DOM واقعی و اعمال استایل های سفارشی
      setTimeout(() => {
        // Add IDs to headings (H1-H4 only)
        contentDiv.querySelectorAll("h1,h2,h3,h4").forEach((el, index) => {
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

        // Style images for responsive behavior
        contentDiv.querySelectorAll("img").forEach((img) => {
          img.classList.add(
            "w-full",
            "h-auto",
            "rounded-xl",
            "shadow-lg",
            "my-6",
            "md:my-8",
            "max-w-full",
            "object-cover"
          );
          img.style.maxHeight = "400px";
          img.style.width = "100%";
        });
      }, 100);
    }
  }, [htmlContent]);

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const headerOffset = 100; // فاصله از بالای صفحه
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
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
                    aria-label="table of content"
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
                          : h.level === 3
                          ? "text-gray-600 mr-6"
                          : "text-gray-500 mr-8"
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
                            : h.level === 3
                            ? "bg-[#66308d]"
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
        className="lg:col-span-3 order-2 lg:order-1 max-w-none blog-content"
      />

      <style jsx global>{`
        .blog-content {
          line-height: 1.7;
          color: #374151;
        }

        .blog-content h1 {
          font-size: 2.25rem;
          font-weight: 800;
          color: #1f2937;
          margin: 2rem 0 1rem 0;
          line-height: 1.2;
        }

        .blog-content h2 {
          font-size: 1.875rem;
          font-weight: 700;
          color: #1f2937;
          margin: 1.75rem 0 0.875rem 0;
          line-height: 1.3;
        }

        .blog-content h3 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #374151;
          margin: 1.5rem 0 0.75rem 0;
          line-height: 1.4;
        }

        .blog-content h4 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #374151;
          margin: 1.25rem 0 0.625rem 0;
          line-height: 1.4;
        }

        .blog-content h5 {
          font-size: 1.125rem;
          font-weight: 500;
          color: #4b5563;
          margin: 1rem 0 0.5rem 0;
          line-height: 1.5;
        }

        .blog-content h6 {
          font-size: 1rem;
          font-weight: 500;
          color: #4b5563;
          margin: 0.875rem 0 0.4375rem 0;
          line-height: 1.5;
        }

        .blog-content p {
          font-size: 1rem;
          line-height: 1.7;
          margin: 1rem 0;
          color: #4b5563;
        }

        .blog-content img {
          width: 100%;
          height: auto;
          border-radius: 0.75rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          margin: 1.5rem 0;
          max-height: 400px;
          object-fit: cover;
        }

        .blog-content a {
          color: #01ae9b;
          text-decoration: none;
          font-weight: 500;
        }

        .blog-content a:hover {
          color: #66308d;
          text-decoration: underline;
        }

        .blog-content ul,
        .blog-content ol {
          margin: 1rem 0;
          padding-right: 1.5rem;
        }

        .blog-content li {
          margin: 0.5rem 0;
          line-height: 1.6;
        }

        .blog-content blockquote {
          border-right: 4px solid #01ae9b;
          padding: 1rem 1.5rem;
          margin: 1.5rem 0;
          background: #f8fafc;
          border-radius: 0.5rem;
          font-style: italic;
        }

        .blog-content code {
          background: #f1f5f9;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.875rem;
          color: #e11d48;
        }

        .blog-content pre {
          background: #1e293b;
          color: #f1f5f9;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 1rem 0;
        }

        @media (max-width: 768px) {
          .blog-content h1 {
            font-size: 1.875rem;
            margin: 1.5rem 0 0.75rem 0;
          }

          .blog-content h2 {
            font-size: 1.5rem;
            margin: 1.25rem 0 0.625rem 0;
          }

          .blog-content h3 {
            font-size: 1.25rem;
            margin: 1rem 0 0.5rem 0;
          }

          .blog-content h4 {
            font-size: 1.125rem;
            margin: 0.875rem 0 0.4375rem 0;
          }

          .blog-content h5 {
            font-size: 1rem;
            margin: 0.75rem 0 0.375rem 0;
          }

          .blog-content h6 {
            font-size: 0.875rem;
            margin: 0.625rem 0 0.3125rem 0;
          }

          .blog-content p {
            font-size: 0.875rem;
          }

          .blog-content img {
            margin: 1rem 0;
            max-height: 250px;
          }
        }
      `}</style>
    </div>
  );
}
