import { HuggingFaceModel } from "@/server/providers/huggingface";
import {
  Star,
  Download,
  Bot,
  Calendar,
  FileCode,
  BookText,
} from "lucide-react";
import { timeAgo } from "@/lib/utils";
import { SaveButton } from "./SaveButton";
import { ModelTagBadge } from "./ModelTagBadge";

export function ModelCard(props: HuggingFaceModel) {
  const {
    id,
    author,
    downloads,
    likes,
    lastModified,
    tags,
    pipeline_tag,
    library_name,
    description,
  } = props;

  const nf = new Intl.NumberFormat("en", { notation: "compact" });

  const otherTags = tags
    .filter((t) => t !== pipeline_tag && t !== library_name)
    .slice(0, 3);

  const modelUrl = `https://huggingface.co/${id}`;

  return (
    <article className="relative group flex h-full flex-col rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
      <div className="flex-grow p-4 sm:p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Bot className="h-4 w-4 flex-shrink-0" />
              <p className="truncate">
                <a
                  href={`https://huggingface.co/${author}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline"
                >
                  {author}
                </a>
                <span className="mx-1 font-medium">/</span>
                <a
                  href={modelUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-gray-800 hover:underline dark:text-gray-200"
                >
                  {id.split("/")[1]}
                </a>
              </p>
            </div>
          </div>
          <SaveButton
            item={{
              type: "model",
              title: id,
              url: modelUrl,
              source: "Hugging Face",
              data: props,
            }}
          />
        </div>

        {description && (
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            {description}
          </p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {pipeline_tag && <ModelTagBadge tag={pipeline_tag} type="primary" />}
          {library_name && <ModelTagBadge tag={library_name} type="secondary" />}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {otherTags.map((tag) => (
            <ModelTagBadge key={tag} tag={tag} type="secondary" />
          ))}
        </div>
      </div>

      <div className="mt-auto flex flex-col space-y-2 border-t border-gray-200 p-4 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 sm:p-5">
        <div className="flex items-center gap-x-4">
          <span className="inline-flex items-center gap-1.5" title="Likes">
            <Star className="h-4 w-4 text-yellow-500" />
            <span className="font-medium">{nf.format(likes)}</span>
          </span>
          <span className="inline-flex items-center gap-1.5" title="Downloads">
            <Download className="h-4 w-4 text-green-500" />
            <span className="font-medium">{nf.format(downloads)}</span>
          </span>
        </div>
        <span
          className="inline-flex items-center gap-1.5"
          title={`Last updated: ${lastModified}`}
        >
          <Calendar className="h-4 w-4" />
          Updated {timeAgo(lastModified)}
        </span>
      </div>

      {/* Quick-access links */}
      <div className="absolute bottom-full mb-2 flex w-full justify-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
        <a
          href={modelUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <BookText className="h-3 w-3" />
          Details
        </a>
        <a
          href={`${modelUrl}/tree/main`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <FileCode className="h-3 w-3" />
          Files
        </a>
      </div>
    </article>
  );
}