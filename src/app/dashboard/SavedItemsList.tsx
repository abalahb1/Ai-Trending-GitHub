"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { SavedItem, SavedType } from "@prisma/client";
import NewsCard from "@/components/NewsCard";
import RepoCard from "@/components/RepoCard";
import { ModelCard } from "@/components/ModelCard";
import { Trash2 } from "lucide-react";

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
        setItems(items.filter((item) => item.id !== id));
        router.refresh();
      } else {
        throw new Error("Failed to delete item");
      }
    } catch (error) {
      console.error(error);
      alert("Error deleting item. Please try again.");
    }
  };

  const renderCard = (item: SavedItem) => {
    switch (item.type) {
      case "article":
        return <NewsCard {...(item.data as any)} />;
      case "repo":
        return <RepoCard {...(item.data as any)} />;
      case "model":
        return <ModelCard {...(item.data as any)} />;
      default:
        return null;
    }
  };

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
        <h3 className="text-lg font-semibold">No saved items yet.</h3>
        <p className="mt-1 text-sm text-gray-500">
          Start exploring and save articles, repos, or models to see them here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => (
        <div key={item.id} className="relative group">
          {renderCard(item)}
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
