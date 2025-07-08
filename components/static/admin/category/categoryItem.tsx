import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

export default function CategoryItem({ category, onEdit, onDelete }) {
  const [open, setOpen] = useState(true);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: category._id,
    });

  return (
    <li
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        border: "1px solid #eee",
        padding: "8px",
        borderRadius: "8px",
        background: "#fff",
      }}
      {...attributes}
      {...listeners}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          {category.children?.length > 0 && (
            <button onClick={() => setOpen((prev) => !prev)}>▸</button>
          )}
          <span>{category.name.fa}</span>
        </div>

        <div className="flex gap-2">
          <button onClick={() => onEdit(category)} className="text-blue-500">
            ویرایش
          </button>
          <button
            onClick={() => onDelete(category._id)}
            className="text-red-500"
          >
            حذف
          </button>
        </div>
      </div>

      {open && category.children?.length > 0 && (
        <ul className="ml-6 mt-2">
          {category.children.map((child) => (
            <CategoryItem
              key={child._id}
              category={child}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
