"use client";

import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { FileText } from "lucide-react";
import { CodeBlock } from "./CodeBlock";

type ReadmeProps = {
  content: string | null;
};

export function Readme({ content }: ReadmeProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center gap-2 border-b border-gray-200 p-4 dark:border-gray-700">
        <FileText className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          README.md
        </h2>
      </div>
      <div className="p-6">
        {content ? (
          <div className="prose max-w-none dark:prose-invert">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                pre: ({ node, ...props }) => <CodeBlock {...props} />,
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No README found or it could not be loaded.
          </p>
        )}
      </div>
    </div>
  );
}
