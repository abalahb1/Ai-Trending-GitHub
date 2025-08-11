"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bookmark, BookmarkCheck } from "lucide-react";

type SaveButtonProps = {
  item: {
    type: "article" | "repo";
    title: string;
    url: string;
    source?: string | null;
    data: any;
  };
};

export function SaveButton({ item }: SaveButtonProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      if (res.ok) {
        setIsSaved(true);
        router.refresh();
      } else {
        throw new Error("Failed to save item");
      }
    } catch (error) {
      console.error(error);
      alert("Error saving item. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleSave}
      disabled={isSaved || isLoading}
      className="absolute top-2 right-2 z-20 p-1.5 rounded-full bg-white/80 text-gray-700 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
      aria-label="Save item"
    >
      {isSaved ? (
        <BookmarkCheck className="h-5 w-5 text-green-500" />
      ) : (
        <Bookmark className="h-5 w-5" />
      )}
    </button>
  );
}