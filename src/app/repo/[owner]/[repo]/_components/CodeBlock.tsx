"use client";

import { useState, Children, isValidElement } from "react";
import { Check, Copy } from "lucide-react";

// This function recursively extracts text content from React children
function getTextFromChildren(children: React.ReactNode): string {
  let text = "";
  Children.forEach(children, child => {
    if (typeof child === "string" || typeof child === "number") {
      text += child;
    } else if (isValidElement(child) && child.props.children) {
      text += getTextFromChildren(child.props.children);
    }
  });
  return text;
}

export function CodeBlock({
  children,
  ...props
}: React.HTMLAttributes<HTMLPreElement>) {
  const [isCopied, setIsCopied] = useState(false);

  // The children prop for a <pre> tag in react-markdown is typically a <code> element
  const codeText = getTextFromChildren(children);

  const handleCopy = async () => {
    if (!codeText) return;
    try {
      await navigator.clipboard.writeText(codeText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="relative group">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-1.5 rounded-md bg-gray-700 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Copy code"
      >
        {isCopied ? (
          <Check className="h-4 w-4 text-green-400" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </button>
      <pre {...props}>{children}</pre>
    </div>
  );
}