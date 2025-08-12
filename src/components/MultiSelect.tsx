"use client";

import { useState, useRef, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";

type MultiSelectProps = {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
};

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select tags...",
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  const handleSelect = (option: string) => {
    if (!selected.includes(option)) {
      onChange([...selected, option]);
    }
  };

  const handleDeselect = (option: string) => {
    onChange(selected.filter((s) => s !== option));
  };

  return (
    <div className="relative" ref={ref}>
      <div
        className="flex min-h-[38px] w-full flex-wrap items-center gap-2 rounded-md border border-gray-200 bg-white p-2 text-sm dark:border-gray-700 dark:bg-gray-800"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selected.length === 0 && (
          <span className="text-gray-500 dark:text-gray-400">
            {placeholder}
          </span>
        )}
        {selected.map((value) => (
          <span
            key={value}
            className="inline-flex items-center gap-x-1.5 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-200"
          >
            {value}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleDeselect(value);
              }}
              className="group"
            >
              <X className="h-3 w-3 text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200" />
            </button>
          </span>
        ))}
        <ChevronDown
          className={`absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>
      {isOpen && (
        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          {options.map((option) => (
            <div
              key={option}
              onClick={() => handleSelect(option)}
              className={`cursor-pointer px-3 py-2 text-sm ${
                selected.includes(option)
                  ? "bg-blue-500 text-white"
                  : "text-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
