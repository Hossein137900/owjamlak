"use client";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState } from "react";
import CategoryItem from "./categoryItem";

interface Category {
  _id: string;
  name: { fa: string; en: string };
  slug: { fa: string; en: string };
  level: number;
  parent?: string;
  order: number;
  children?: Category[];
}

export default function CategoryTree({
  categories,
  onReorder,
  onEdit,
  onDelete,
}) {
  const [items, setItems] = useState(categories);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = items.findIndex((i) => i._id === active.id);
      const newIndex = items.findIndex((i) => i._id === over?.id);
      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);

      // ذخیره ترتیب در دیتابیس
      await fetch("/api/category/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          newItems.map((item, index) => ({ _id: item._id, order: index }))
        ),
      });

      onReorder?.();
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((i) => i._id)}
        strategy={verticalListSortingStrategy}
      >
        <ul className="space-y-2">
          {items.map((cat) => (
            <CategoryItem
              key={cat._id}
              category={cat}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}
