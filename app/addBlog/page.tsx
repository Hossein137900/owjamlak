"use client";
import React, { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { Color } from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import Image from "@tiptap/extension-image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import { CustomEditor } from "@/types/editor";
import BlogImageUpload from "../components/(admin)/BlogImageUpload";
import { MultiImageDropzone, type FileState } from "../components/MultiImageDropzone";
import { useEdgeStore } from "@/lib/edgestore";

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

const ImageUploadModal = ({
  isOpen,
  onClose,
  onImageSelect,
}: {
  isOpen: boolean;
  onClose: () => void;
  onImageSelect: (url: string, alt?: string) => void;
}) => {
  const [imageUrl, setImageUrl] = useState("");
  const [altText, setAltText] = useState("");
  const [fileStates, setFileStates] = useState<FileState[]>([]);
  const { edgestore } = useEdgeStore();

  function updateFileProgress(key: string, progress: FileState["progress"]) {
    setFileStates((fileStates) => {
      const newFileStates = structuredClone(fileStates);
      const fileState = newFileStates.find(
        (fileState) => fileState.key === key
      );
      if (fileState) {
        fileState.progress = progress;
      }
      return newFileStates;
    });
  }

  const handleUrlSubmit = () => {
    if (imageUrl.trim()) {
      onImageSelect(imageUrl.trim(), altText.trim() || "تصویر بلاگ");
      setImageUrl("");
      setAltText("");
      setFileStates([]);
      onClose();
    }
  };

  const handleFilesAdded = async (addedFiles: FileState[]) => {
    setFileStates([...fileStates, ...addedFiles]);
    
    await Promise.all(
      addedFiles.map(async (addedFileState) => {
        try {
          const res = await edgestore.publicFiles.upload({
            file: addedFileState.file as File,
            onProgressChange: async (progress) => {
              updateFileProgress(addedFileState.key, progress);
              if (progress === 100) {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                updateFileProgress(addedFileState.key, "COMPLETE");
              }
            },
          });

          // Insert image into editor
          onImageSelect(res.url, altText.trim() || (addedFileState.file as File).name);
          
          // Reset and close after successful upload
          setTimeout(() => {
            setFileStates([]);
            setAltText("");
            onClose();
          }, 1500);
          
          toast.success('تصویر با موفقیت آپلود شد');
        } catch (err) {
          console.log("Upload error:", err);
          updateFileProgress(addedFileState.key, "ERROR");
          toast.error('خطا در آپلود تصویر');
        }
      })
    );
  };

  const handleFileStatesChange = (newFileStates: FileState[]) => {
    setFileStates(newFileStates);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white/10 backdrop-blur-sm rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-[#e5d8d0]/20"
        dir="rtl"
      >
        <h3 className="text-xl font-bold mb-6 text-white text-center">
          افزودن تصویر به محتوا
        </h3>
        
        <div className="space-y-6">
          {/* Multi Image Dropzone */}
          <div>
            <label className="block text-sm font-medium mb-3 text-white">
              آپلود تصویر
            </label>
            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-lg border border-[#e5d8d0]/20">
              <MultiImageDropzone
                value={fileStates}
                dropzoneOptions={{
                  maxFiles: 1,
                  maxSize: 5 * 1024 * 1024, // 5MB
                  accept: {
                    'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
                  }
                }}
                onChange={handleFileStatesChange}
                onFilesAdded={handleFilesAdded}
                className="w-full"
              />
            </div>
          </div>

          <div className="text-center text-white/70 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative bg-transparent px-4">یا</div>
          </div>

          {/* URL Input */}
          <div>
            <label className="block text-sm font-medium mb-3 text-white">
              لینک تصویر
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-3 text-black rounded-lg border border-[#e5d8d0] bg-white/80 focus:outline-none focus:border-[#a37462] transition-all duration-300"
            />
          </div>

          {/* Alt Text */}
          <div>
            <label className="block text-sm font-medium mb-3 text-white">
              متن جایگزین (Alt)
            </label>
            <input
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="توضیح تصویر"
              className="w-full px-4 py-3 text-black rounded-lg border border-[#e5d8d0] bg-white/80 focus:outline-none focus:border-[#a37462] transition-all duration-300"
            />
          </div>

          {/* Upload Instructions */}
          <div className="text-sm text-white/60 space-y-1 bg-white/5 p-4 rounded-lg">
            <p>• تصویر در محل نشانگر متن درج خواهد شد</p>
            <p>• فرمت‌های مجاز: PNG, JPG, JPEG, GIF, WebP</p>
            <p>• حداکثر حجم فایل: 5 مگابایت</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleUrlSubmit}
            disabled={!imageUrl.trim() && fileStates.length === 0}
            className="flex-1 bg-[#a37462] text-white py-3 px-4 rounded-lg hover:bg-[#a37462]/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium"
          >
            افزودن تصویر
          </button>
          <button
            onClick={() => {
              setFileStates([]);
              setImageUrl("");
              setAltText("");
              onClose();
            }}
            className="flex-1 bg-white/20 text-white py-3 px-4 rounded-lg hover:bg-white/30 transition-all duration-300 font-medium"
          >
            لغو
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default function AddBlogPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [mainImage, setMainImage] = useState("");
  const [secondImage, setSecondImage] = useState("");
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const handleAddTag = () => {
    if (tags.length >= 3) {
      toast.error("شما فقط می‌توانید ۳ برچسب اضافه کنید");
      return;
    }

    if (tagInput.trim()) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleImageUpload = (imageUrl: string, type: "main" | "second") => {
    if (type === "main") {
      setMainImage(imageUrl);
    } else {
      setSecondImage(imageUrl);
    }
  };

  const handleInsertImage = (url: string, alt: string = "تصویر بلاگ") => {
    editor?.chain().focus().setImage({ src: url, alt }).run();
  };

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        paragraph: { HTMLAttributes: { dir: "auto" } },
        bulletList: false,
        orderedList: false,
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
          class: "max-w-full h-auto rounded-lg my-4 mx-auto block shadow-md",
        },
        allowBase64: true,
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
        description,
        seoTitle,
        content: editor?.getHTML(),
        image: mainImage || null,
        secondImage: secondImage || null,
        tags,
      };

      const response = await fetch("/api/blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        body: JSON.stringify(blogData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("بلاگ با موفقیت ایجاد شد");
        // Reset form
        setTitle("");
        setDescription("");
        setSeoTitle("");
        setMainImage("");
        setSecondImage("");
        setTags([]);
        editor?.commands.clearContent();
        setWordCount(0);
      } else {
        toast.error(result.message || "خطا در ایجاد بلاگ");
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
        className="text-2xl md:text-4xl font-black my-4 text-center text-white"
      >
        افزودن بلاگ جدید
      </motion.h2>
      <motion.p
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-base md:text-xl font-medium mb-8 text-center text-[#e4e4e4]/50"
      >
        در این قسمت می‌توانید بلاگ جدید خود را ایجاد کنید
      </motion.p>

      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
      />

      <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
        {/* SEO Section */}
        <div className="bg-[#a37462]/10 backdrop-blur-sm p-8 border border-[#e5d8d0]/20 shadow-lg rounded-xl">
          <label className="block mb-4 text-xl text-center text-gray-100">
            <span className="text-[#fff] font-bold">قسمت سئو</span>
          </label>
          <input
            type="text"
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            className="w-full px-6 py-4 mb-4 text-[#000] rounded-xl border border-[#e5d8d0] bg-white/80 focus:outline-none focus:border-[#a37462] transition-all duration-300"
            placeholder="عنوان سئو *"
            required
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-6 py-4 text-[#000] rounded-xl border border-[#e5d8d0] bg-white/80 focus:outline-none focus:border-[#a37462] transition-all duration-300 min-h-[100px]"
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
                className="w-full px-6 py-4 text-[#000] rounded-xl border border-[#e5d8d0] bg-white/80 outline-none focus:border-[#a37462]"
                placeholder="برچسب‌ها را وارد کنید..."
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
                  className="bg-[#e5d8d0] text-[#a37462] px-4 py-2 rounded-full flex items-center gap-2 font-medium"
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
        <BlogImageUpload
          onImageUpload={handleImageUpload}
          currentMainImage={mainImage}
          currentSecondImage={secondImage}
        />

        {/* Content Section */}
        <div className="bg-[#a37462]/10 backdrop-blur-sm p-8 border border-[#e5d8d0]/20 shadow-lg rounded-xl">
          <label className="block text-2xl font-bold text-[#fff] text-center mb-6">
            عنوان بلاگ
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-6 py-4 mb-6 text-[#000] rounded-xl border border-[#e5d8d0] bg-white/80 focus:outline-none focus:border-[#a37462] transition-all duration-300"
            placeholder="عنوان بلاگ *"
            required
          />

          <div>
            <label className="block text-2xl font-bold text-[#fff] text-center my-6">
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

                {/* Image Button */}
                <MenuButton
                  onClick={() => setShowImageModal(true)}
                  active={false}
                >
                  <i className="fas fa-image"></i>
                </MenuButton>

                {[2, 3, 4, 5].map((level) => (
                  <MenuButton
                    key={level}
                    onClick={() =>
                      editor
                        ?.chain()
                        .focus()
                        .toggleHeading({ level: level as 1 | 2 | 3 | 4 | 5 })
                        .run()
                    }
                    active={editor?.isActive("heading", { level })}
                  >
                    H{level}
                  </MenuButton>
                ))}

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
              </div>

              <div className="p-6 text-black bg-white/90">
                <EditorContent editor={editor} />
              </div>

              <div className="mt-2 text-sm text-[#fff] text-right border-t border-[#e5d8d0] p-4">
                تعداد کلمات: {wordCount}
              </div>
            </div>
          </div>
        </div>

        
        <div className="text-right pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-transparent text-white px-8 py-2.5 border hover:bg-gray-700 w-full rounded-lg hover:shadow-lg transition-all duration-300 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "در حال انتشار..." : "انتشار بلاگ"}
          </button>
        </div>
      </form>

      {/* Image Upload Modal */}
      <ImageUploadModal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        onImageSelect={handleInsertImage}
      />

      <ToastContainer position="top-center" rtl={true} />
    </div>
  );
}
