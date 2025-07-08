"use client";

import { useEffect, useState } from "react";
import { slugify } from "@/utils/slugify";
import CategoryTree from "./categoryTree";

interface Category {
  _id: string;
  name: { fa: string; en: string };
  slug: { fa: string; en: string };
  level: number;
  parent?: string;
  order: number;
  children?: Category[];
}

export default function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    nameFa: "",
    nameEn: "",
    level: 1,
    parentId: "",
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const res = await fetch("/api/category");
    const data = await res.json();
    const tree = buildTree(data.categories);
    setCategories(tree);
  };

  const buildTree = (flat: Category[]) => {
    const map: Record<string, Category> = {};
    const roots: Category[] = [];

    flat.forEach((cat) => {
      map[cat._id] = { ...cat, children: [] };
    });

    flat.forEach((cat) => {
      if (cat.parent && map[cat.parent]) {
        map[cat.parent].children?.push(map[cat._id]);
      } else {
        roots.push(map[cat._id]);
      }
    });

    return roots.sort((a, b) => a.order - b.order);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const body = {
      name: { fa: form.nameFa, en: form.nameEn },
      slug: {
        fa: slugify(form.nameFa),
        en: slugify(form.nameEn),
      },
      level: form.level,
      parentId: form.level === 1 ? null : form.parentId,
    };

    if (editingId) {
      await fetch(`/api/category/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } else {
      await fetch("/api/category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }

    resetForm();
    fetchCategories();
  };

  const resetForm = () => {
    setForm({ nameFa: "", nameEn: "", level: 1, parentId: "" });
    setEditingId(null);
  };

  const handleEdit = (category: Category) => {
    setForm({
      nameFa: category.name.fa,
      nameEn: category.name.en,
      level: category.level,
      parentId: category.parent || "",
    });
    setEditingId(category._id);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/category/${id}`, {
      method: "DELETE",
    });
    fetchCategories();
  };

  const availableParents = () => {
    const all: Category[] = [];

    const flatten = (nodes: Category[]) => {
      for (const node of nodes) {
        all.push(node);
        if (node.children) flatten(node.children);
      }
    };
    flatten(categories);

    if (form.level === 2) return all.filter((c) => c.level === 1);
    if (form.level === 3) return all.filter((c) => c.level === 2);
    return [];
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded-md shadow space-y-4 mb-8"
      >
        <h2 className="text-xl font-bold mb-2">
          {editingId ? "ویرایش دسته‌بندی" : "افزودن دسته‌بندی"}
        </h2>

        <input
          type="text"
          placeholder="نام فارسی"
          className="w-full border p-2 rounded"
          value={form.nameFa}
          onChange={(e) => setForm({ ...form, nameFa: e.target.value })}
        />

        <input
          type="text"
          placeholder="نام انگلیسی"
          className="w-full border p-2 rounded"
          value={form.nameEn}
          onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
        />

        <select
          value={form.level}
          onChange={(e) =>
            setForm({ ...form, level: parseInt(e.target.value) })
          }
          className="w-full border p-2 rounded"
        >
          <option value={1}>دسته اصلی</option>
          <option value={2}>زیر دسته</option>
          <option value={3}>زیر زیر دسته</option>
        </select>

        {(form.level === 2 || form.level === 3) && (
          <select
            value={form.parentId}
            onChange={(e) => setForm({ ...form, parentId: e.target.value })}
            className="w-full border p-2 rounded"
          >
            <option value="">انتخاب والد</option>
            {availableParents().map((parent) => (
              <option key={parent._id} value={parent._id}>
                {parent.name.fa}
              </option>
            ))}
          </select>
        )}

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {editingId ? "ویرایش" : "افزودن"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              لغو
            </button>
          )}
        </div>
      </form>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">دسته‌بندی‌ها</h2>
        <CategoryTree
          categories={categories}
          onReorder={fetchCategories}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
