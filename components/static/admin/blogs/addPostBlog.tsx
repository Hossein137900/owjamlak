"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { Color } from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import { motion } from "framer-motion";
import { CustomEditor } from "@/types/editor";
import Image from "@tiptap/extension-image";
import { TextSelection } from "prosemirror-state";
import toast from "react-hot-toast";
import imageCompression from "browser-image-compression";
import ResizableImage from "@/extensions/ResizableImage";
import { Blog } from "@/types/type";

const MenuButton = ({
  onClick,
  active,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
}) => (
  <button
    aria-label="addblog"
    type="button"
    onClick={onClick}
    className={`p-2 rounded-md transition-colors ${
      active ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100 text-gray-600"
    }`}
  >
    {children}
  </button>
);

const ColorPickerDropdown = ({
  isOpen,
  onClose,
  onColorSelect,
}: {
  isOpen: boolean;
  onClose: () => void;
  onColorSelect: (color: string) => void;
}) => {
  const colors = [
    "#000000",
    "#434343",
    "#666666",
    "#999999",
    "#b7b7b7",
    "#cccccc",
    "#d9d9d9",
    "#efefef",
    "#f3f3f3",
    "#ffffff",
    "#980000",
    "#ff0000",
    "#ff9900",
    "#ffff00",
    "#00ff00",
    "#00ffff",
    "#4a86e8",
    "#0000ff",
    "#9900ff",
    "#ff00ff",
  ];

  if (!isOpen) return null;

  return (
    <div className="absolute mt-2 p-2 bg-white rounded-lg shadow-xl border z-50 w-48">
      <div className="grid grid-cols-10 gap-1">
        {colors.map((color) => (
          <button
            key={color}
            aria-label="color"
            className="w-6 h-6 rounded-sm border border-gray-200 hover:scale-110 transition-transform"
            style={{ backgroundColor: color }}
            onClick={() => {
              onColorSelect(color);
              onClose();
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default function AddPostBlog() {
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const isEditMode = !!editId;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const handleAddTag = () => {
    if (tags.length >= 3) {
      toast.error("شما فقط میتوانید ۳ برچسب اضافه کنید");
      return;
    }

    if (tagInput.trim()) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };
  // آیا selection داخل یک بلاک (پاراگراف) واحده؟
  const isWithinSingleBlock = (editor: CustomEditor) => {
    const { $from, $to } = editor.state.selection;
    return $from.sameParent($to);
  };

  // بخش انتخاب‌شده را به یک بلاک مستقل تبدیل می‌کند
  const isolateSelectionToOwnBlock = (editor: CustomEditor) => {
    const { state, view } = editor;
    const { from, to, empty, $from } = state.selection;

    // اگر انتخاب خالی است یا چند بلاک را شامل می‌شود یا کل بلاک انتخاب شده، نیازی به split نیست
    if (empty) return false;
    if (!isWithinSingleBlock(editor)) return false;
    if (from === $from.start() && to === $from.end()) return false;

    // یک ترنزاکشن می‌سازیم: ابتدا در انتهای انتخاب split، سپس در ابتدای انتخاب split
    let tr = state.tr;

    // split در انتهای selection
    tr = tr.split(to);

    // نگاشت موقعیت آغاز selection بعد از split اول
    const mappedFrom = tr.mapping.map(from);

    // split در ابتدای selection (بعد از نگاشت)
    tr = tr.split(mappedFrom);

    // اعمال ترنزاکشن splitها
    view.dispatch(tr);

    // حالا selection را روی بلاک میانی (بخش جداشده) قرار می‌دهیم
    const middlePos = tr.mapping.map(from) + 1; // یک پوزیشن داخل بلاک میانی
    const $pos = view.state.doc.resolve(
      Math.min(middlePos, view.state.doc.content.size)
    );
    view.dispatch(view.state.tr.setSelection(TextSelection.near($pos)));

    return true;
  };

  // هدینگ را طوری اعمال می‌کند که اگر انتخاب «داخل یک پاراگراف» باشد، اول جدا و بعد هدینگ شود
  const toggleHeadingOnSelection = (
    editor: CustomEditor,
    level: 1 | 2 | 3 | 4 | 5 | 6
  ) => {
    // اگر انتخاب غیرخالی و داخل یک بلاک است، اول جداش کن
    if (!editor.state.selection.empty && isWithinSingleBlock(editor)) {
      isolateSelectionToOwnBlock(editor);
    }
    // حالا هدینگ فقط روی بلاک میانی (بخش انتخاب‌شده) اعمال می‌شود
    editor.chain().focus().toggleHeading({ level }).run();
  };

  const handleFileUpload = async (file: File) => {
    if (images.length >= 5) {
      toast.error("حداکثر 5 تصویر میتوانید آپلود کنید");
      return;
    }
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/HEIC",
      "image/heic",
      "image/HEIF",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("فرمت فایل مجاز نیست");
      return;
    }

    if (file.size > 30 * 1024 * 1024) {
      toast.error("حجم فایل نباید بیشتر از 30 مگابایت باشد");
      return;
    }

    setUploading(true);

    try {
      let finalFile = file;

      // Compress if over 100KB
      if (file.size > 100 * 1024) {
        const options = {
          maxSizeMB: 0.1, // ~100KB
          maxWidthOrHeight: 1280,
          fileType: "image/webp",
          useWebWorker: true,
        };
        finalFile = await imageCompression(file, options);
      }

      const formData = new FormData();
      formData.append("image", finalFile);
      formData.append("type", images.length === 0 ? "main" : "additional");

      const response = await fetch("/api/blog/images", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        setImages((prev) => [...prev, result.url]);
        toast.success(
          `تصویر ${images.length === 0 ? "اصلی" : "فرعی"} آپلود شد`
        );
      } else {
        toast.error(result.error || "خطا در آپلود");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("خطا در آپلود تصویر");
    } finally {
      setUploading(false);
    }
  };

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        paragraph: { HTMLAttributes: { dir: "auto" } },
        bulletList: false,
        orderedList: false,
      }),
      ResizableImage.configure({
        HTMLAttributes: {
          class: "rounded-lg my-4", // استایل پیش‌فرض عکس
        },
      }),
      BulletList.configure({
        keepMarks: true,
        HTMLAttributes: { class: "list-disc ml-4" },
      }),
      OrderedList.configure({
        keepMarks: true,
        HTMLAttributes: { class: "list-decimal ml-4" },
      }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-500 underline hover:text-blue-700",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right"],
        defaultAlignment: "left",
      }),
      Image.configure({
        HTMLAttributes: {
          class: "w-full h-64 object-cover rounded-lg my-4",
        },
      }),
    ],
    editorProps: {
      attributes: {
        class: "prose prose-lg max-w-none focus:outline-none min-h-[200px] rtl",
      },
    },
    onUpdate: ({ editor }: { editor: CustomEditor }) => {
      const text = editor.getText();
      const words: string[] = text
        .trim()
        .split(/\s+/)
        .filter((word: string) => word !== "");
      setWordCount(words.length);
    },
  }) as CustomEditor;

  useEffect(() => {
    if (isEditMode && editId && editor) {
      fetchBlogData();
    }
  }, [isEditMode, editId, editor]);

  const fetchBlogData = async () => {
    try {
      const response = await fetch("/api/blog");
      const blogs = await response.json();
      const blog = blogs.find((b: Blog) => b.id === editId);

      if (blog) {
        setTitle(blog.title);
        setDescription(blog.excerpt);
        setSeoTitle(blog.seoTitle);
        setImages(blog.images || []);
        setTags(blog.tags || []);

        // Set editor content after a small delay to ensure editor is ready
        setTimeout(() => {
          if (editor && blog.contentHtml) {
            editor.commands.setContent(blog.contentHtml);
          }
        }, 100);
      }
    } catch (error) {
      console.log(error);
      toast.error("خطا در بارگذاری بلاگ");
    } finally {
    }
  };

  const setLink = () => {
    const previousUrl = editor?.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) return;
    if (url === "") {
      editor?.chain().focus().unsetLink().run();
      return;
    }
    editor?.chain().focus().setLink({ href: url }).run();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate required fields
      if (!title || !description || !seoTitle || !editor?.getHTML()) {
        toast.error("لطفا تمام فیلدهای اجباری را پر کنید");
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("لطفا مجددا وارد شوید");
        return;
      }

      const blogData = {
        title,
        excerpt: description,
        seoTitle,
        contentHtml: editor?.getHTML() || "",
        images: images,
        coverImage: images.length > 0 ? images[0] : undefined,
        tags,
      };

      const url = isEditMode ? `/api/blog/${editId}` : "/api/blog";
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        body: JSON.stringify(blogData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(
          isEditMode ? "بلاگ با موفقیت بروزرسانی شد" : "بلاگ با موفقیت ایجاد شد"
        );
        if (!isEditMode) {
          setTitle("");
          setDescription("");
          setSeoTitle("");
          setImages([]);
          setTags([]);
          editor?.commands.clearContent();
          setWordCount(0);
        }
      } else {
        toast.error(
          result.message ||
            (isEditMode ? "خطا در بروزرسانی بلاگ" : "خطا در ایجاد بلاگ")
        );
      }
    } catch (error) {
      console.log("Error creating blog:", error);
      toast.error("خطا در ایجاد بلاگ");
    }
  };

  return (
    <div className="max-w-4xl mx-6 mt-28 md:mt-36 my-16 lg:mx-auto">
      <motion.h2
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-2xl md:text-4xl font-black my-4 text-center text-black"
      >
        {isEditMode ? "ویرایش بلاگ" : "افزودن بلاگ جدید"}
      </motion.h2>
      <motion.p
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-base md:text-xl font-medium mb-8 text-center text-[#000]/50"
      >
        {isEditMode
          ? "در این قسمت میتوانید بلاگ خود را ویرایش کنید"
          : "در این قسمت میتوانید بلاگ جدید خود را ایجاد کنید"}
      </motion.p>

      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
      />

      <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
        {/* SEO Section */}
        <div className="backdrop-blur-sm p-8 border border-[#e5d8d0]/20 shadow-lg rounded-xl">
          <label className="block mb-4 text-xl text-center text-gray-100">
            <span className="text-[#000] font-bold">قسمت سئو</span>
          </label>
          <input
            type="text"
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            className="w-full px-6 py-4 mb-4 text-[#000] rounded-xl border border-[#e4e4e4] bg-white/80 focus:outline-none focus:border-[#000] transition-all duration-300"
            placeholder="عنوان سئو *"
            required
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-6 py-4 text-[#000] rounded-xl border border-[#e4e4e4] bg-white/80 focus:outline-none focus:border-[#000] transition-all duration-300 min-h-[100px]"
            placeholder="توضیحات کوتاه *"
            required
          />

          {/* Tags Section */}
          <div className="space-y-4 mt-5">
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), handleAddTag())
                }
                className="w-full px-6 py-4 text-[#000] rounded-xl border border-[#e4e4e4] bg-white/80 outline-none focus:border-[#000]"
                placeholder="برچسبها را وارد کنید..."
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="bg-gray-500 text-white px-6 rounded-xl hover:bg-gray-600 transition-all duration-300"
              >
                <i className="fas fa-plus mt-1.5"></i>
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  key={index}
                  className="bg-[#d0e5d9] text-[#000] px-4 py-2 rounded-full flex items-center gap-2 font-medium"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => setTags(tags.filter((_, i) => i !== index))}
                    className="hover:text-red-500 transition-colors"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </motion.span>
              ))}
            </div>
          </div>
        </div>

        {/* Image Upload Section */}
        <div className="backdrop-blur-sm p-8 border border-[#e5d8d0]/20 shadow-lg rounded-xl">
          <label className="block mb-4 text-xl text-center">
            <span className="text-[#000] font-bold">
              تصاویر بلاگ (حداکثر 5 تصویر)
            </span>
          </label>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-4">
            <input
              type="file"
              accept=".png,.jpg,.jpeg,.gif,.webp"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
              }}
              disabled={uploading || images.length >= 5}
              className="hidden"
              id="imageUpload"
            />
            <label
              htmlFor="imageUpload"
              className="cursor-pointer block p-4 text-gray-600 hover:text-gray-800"
            >
              <i className="fas fa-cloud-upload-alt text-3xl mb-2"></i>
              <p className="text-lg">کلیک کنید یا فایل را بکشید</p>
              <p className="text-sm text-gray-500 mt-2">
                {images.length}/5 تصویر آپلود شده
              </p>
            </label>
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`تصویر ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <div className="absolute top-1 right-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                    {index === 0 ? "اصلی" : index + 1}
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setImages((prev) => prev.filter((_, i) => i !== index))
                    }
                    className="absolute top-1 left-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {uploading && (
            <div className="mt-4 text-center text-blue-600">
              <i className="fas fa-spinner fa-spin mr-2"></i>
              در حال آپلود...
            </div>
          )}

          <div className="mt-4 text-sm text-gray-600 space-y-1">
            <p>• اولین تصویر به عنوان تصویر اصلی بلاگ استفاده میشود</p>
            <p>
              • برای درج تصاویر در محتوا، از منوی درج تصویر در نوار ابزار
              استفاده کنید
            </p>
            <p>• فرمتهای مجاز: PNG, JPG, JPEG, GIF, WebP</p>
            <p>• حداکثر حجم: 30 مگابایت</p>
          </div>
        </div>

        {/* Content Section */}
        <div className="backdrop-blur-sm p-8 border border-[#e5d8d0]/20 shadow-lg rounded-xl">
          <label className="block text-2xl font-bold text-[#000] text-center mb-6">
            عنوان بلاگ
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-6 py-4 mb-6 text-[#000] rounded-xl border border-[#e4e4e4] bg-white/80 focus:outline-none focus:border-[#000] transition-all duration-300"
            placeholder="عنوان بلاگ *"
            required
          />

          <div>
            <label className="block text-2xl font-bold text-[#000] text-center my-6">
              محتوای بلاگ
            </label>
            <div className="border border-[#e5d8d0] rounded-2xl overflow-hidden shadow-lg">
              <div className="bg-[#fff]/70 p-4 border-b border-[#e5d8d0] flex flex-wrap gap-3">
                <MenuButton
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                  active={editor?.isActive("bold")}
                >
                  <i className="fas fa-bold"></i>
                </MenuButton>

                <MenuButton
                  onClick={() => editor?.chain().focus().toggleItalic().run()}
                  active={editor?.isActive("italic")}
                >
                  <i className="fas fa-italic"></i>
                </MenuButton>

                <MenuButton onClick={setLink} active={editor?.isActive("link")}>
                  <i className="fas fa-link"></i>
                </MenuButton>

                <MenuButton
                  onClick={() => editor?.chain().focus().unsetLink().run()}
                  active={false}
                >
                  <i className="fas fa-unlink"></i>
                </MenuButton>

                {/* Heading Buttons */}
                <MenuButton
                  onClick={() => editor && toggleHeadingOnSelection(editor, 1)}
                  active={editor?.isActive("heading", { level: 1 })}
                >
                  H1
                </MenuButton>

                <MenuButton
                  onClick={() => editor && toggleHeadingOnSelection(editor, 2)}
                  active={editor?.isActive("heading", { level: 2 })}
                >
                  H2
                </MenuButton>

                <MenuButton
                  onClick={() => editor && toggleHeadingOnSelection(editor, 3)}
                  active={editor?.isActive("heading", { level: 3 })}
                >
                  H3
                </MenuButton>

                <MenuButton
                  onClick={() => editor && toggleHeadingOnSelection(editor, 4)}
                  active={editor?.isActive("heading", { level: 4 })}
                >
                  H4
                </MenuButton>

                <MenuButton
                  onClick={() => editor && toggleHeadingOnSelection(editor, 5)}
                  active={editor?.isActive("heading", { level: 5 })}
                >
                  H5
                </MenuButton>

                <MenuButton
                  onClick={() => editor && toggleHeadingOnSelection(editor, 6)}
                  active={editor?.isActive("heading", { level: 6 })}
                >
                  H6
                </MenuButton>

                <div className="relative">
                  <MenuButton
                    onClick={() => setShowTextColorPicker(!showTextColorPicker)}
                    active={showTextColorPicker}
                  >
                    <i className="fas fa-font"></i>
                  </MenuButton>
                  <ColorPickerDropdown
                    isOpen={showTextColorPicker}
                    onClose={() => setShowTextColorPicker(false)}
                    onColorSelect={(color) =>
                      editor?.chain().focus().setColor(color).run()
                    }
                  />
                </div>

                <div className="relative">
                  <MenuButton
                    onClick={() => setShowBgColorPicker(!showBgColorPicker)}
                    active={showBgColorPicker}
                  >
                    <i className="fas fa-fill-drip"></i>
                  </MenuButton>
                  <ColorPickerDropdown
                    isOpen={showBgColorPicker}
                    onClose={() => setShowBgColorPicker(false)}
                    onColorSelect={(color) =>
                      editor?.chain().focus().setHighlight({ color }).run()
                    }
                  />
                </div>

                <MenuButton
                  onClick={() =>
                    editor?.chain().focus().setTextAlign("left").run()
                  }
                  active={editor?.isActive({ textAlign: "left" })}
                >
                  <i className="fas fa-align-left"></i>
                </MenuButton>

                <MenuButton
                  onClick={() =>
                    editor?.chain().focus().setTextAlign("center").run()
                  }
                  active={editor?.isActive({ textAlign: "center" })}
                >
                  <i className="fas fa-align-center"></i>
                </MenuButton>

                <MenuButton
                  onClick={() =>
                    editor?.chain().focus().setTextAlign("right").run()
                  }
                  active={editor?.isActive({ textAlign: "right" })}
                >
                  <i className="fas fa-align-right"></i>
                </MenuButton>

                <MenuButton
                  onClick={() =>
                    editor?.chain().focus().toggleBulletList().run()
                  }
                  active={editor?.isActive("bulletList")}
                >
                  <i className="fas fa-list-ul"></i>
                </MenuButton>

                <MenuButton
                  onClick={() =>
                    editor?.chain().focus().toggleOrderedList().run()
                  }
                  active={editor?.isActive("orderedList")}
                >
                  <i className="fas fa-list-ol"></i>
                </MenuButton>

                {/* Image Insertion Dropdown */}
                {images.length > 0 && (
                  <div className="relative">
                    <select
                      onChange={async (e) => {
                        if (!e.target.value) return;
                        const imageUrl = e.target.value;
                        const imageIndex = images.indexOf(imageUrl);

                        editor
                          .chain()
                          .focus()
                          .setImage({
                            src: imageUrl,
                            alt: `تصویر ${imageIndex + 1}`,
                          })
                          .run();

                        e.target.value = "";
                      }}
                      className="px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-700"
                    >
                      <option value="">درج تصویر</option>
                      {images.map((image, index) => (
                        <option key={index} value={image}>
                          تصویر {index + 1} {index === 0 ? "(اصلی)" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="p-6 text-black bg-white/90">
                <style>{`
                  .ProseMirror img {
                    max-width: 150px;
                    height: auto;
                    border-radius: 8px;
                    margin: 8px 0;
                    cursor: pointer;
                    display: block;
                  }
                  .ProseMirror img + * {
                    margin-top: 16px;
                  }

                `}</style>
                <EditorContent editor={editor} />
              </div>

              <div className="mt-2 text-sm text-[#000]/50 text-right border-t border-[#e5d8d0] p-4">
                تعداد کلمات: {wordCount}
              </div>
            </div>
          </div>
        </div>

        <div className="text-right pt-6">
          <button
            type="submit"
            className="bg-transparent text-black px-8 py-2.5 border hover:bg-gray-50 w-full rounded-lg hover:shadow-lg transition-all duration-300 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isEditMode ? "بروزرسانی" : "ثبت"}
          </button>
        </div>
      </form>
    </div>
  );
}
