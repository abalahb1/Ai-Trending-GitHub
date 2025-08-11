"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import NewsCard from "@/components/NewsCard";
import RepoCard from "@/components/RepoCard";
import { Trash2 } from "lucide-react";

type SavedItem = {
  id: string;
  type: "article" | "repo";
  title: string;
  url: string;
  source: string | null;
  data: any;
};

type SavedItemsListProps = {
  initialItems: SavedItem[];
};

export function SavedItemsList({ initialItems }: SavedItemsListProps) {
  const [items, setItems] = useState(initialItems);
  const router = useRouter();

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/saved/${id}`, { method: "DELETE" });
      if (res.ok) {
        setItems(items.filter(item => item.id !== id));
        router.refresh();
      } else {
        throw new Error("Failed to delete item");
      }
    } catch (error) {
      console.error(error);
      alert("Error deleting item. Please try again.");
    }
  };

  if (items.length === 0) {
    return <div className="card">No saved items yet.</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map(item => (
        <div key={item.id} className="relative group">
          {item.type === "article" ? (
            <NewsCard {...item.data} />
          ) : (
            <RepoCard {...item.data} />
          )}
          <button
            onClick={() => handleDelete(item.id)}
            className="absolute top-2 right-2 z-20 p-1.5 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label="Delete item"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}