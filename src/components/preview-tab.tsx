import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCode } from "@/lib/stores/validator-store";
import remarkFrontmatter from "remark-frontmatter";
import { cleanObjectTitle } from "@/lib/mdutils";
import { Badge } from "./ui/badge";

export function PreviewTab() {
  const code = useCode();

  // Memoize the ReactMarkdown component to prevent re-rendering
  const MarkdownContent = useMemo(() => {
    return (
      <div id="preview-scroll-container" className="flex h-full relative">
        <ReactMarkdown
          className="prose prose-invert max-w-none text-white px-10 pb-10 mt-5 pt-10 scrollbar-hide"
          remarkPlugins={[remarkFrontmatter]}
          components={{
            h1: ({ node, ...props }) => (
              <h1 className="text-2xl font-bold mb-4 text-white" {...props} />
            ),
            h2: ({ node, ...props }) => (
              <h2 className="text-xl font-bold mb-3 text-white" {...props} />
            ),
            h3: ({ node, ...props }) => (
              <h3
                id={`preview-${cleanObjectTitle(
                  props.children?.toString() ?? ""
                )}`}
                className="text-lg font-bold mb-2 text-white"
                {...props}
              />
            ),
            p: ({ node, ...props }) => (
              <p className="mb-4 text-gray-300 text-justify" {...props} />
            ),
            ul: ({ node, ...props }) => (
              <ul className="list-disc pl-6 mb-4 text-gray-300" {...props} />
            ),
            ol: ({ node, ...props }) => (
              <ol className="list-decimal pl-6 mb-4 text-gray-300" {...props} />
            ),
            li: ({ node, ...props }) => (
              <li className="mb-1 text-gray-300">
                {(() => {
                  const content = props.children?.toString() || "";
                  const labelMatches = content.match(
                    /^(description|Description|\w+):\s+(.+)$/
                  );

                  if (labelMatches) {
                    const [_, label, value] = labelMatches;
                    if (label.toLowerCase() === "description") {
                      return (
                        <span>
                          Description: <span className="italic">{value}</span>
                        </span>
                      );
                    }
                    return (
                      <span>
                        {label}:{" "}
                        <Badge
                          variant="secondary"
                          className="cursor-pointer hover:opacity-80"
                          onClick={() => {
                            const element = document.getElementById(
                              `preview-${cleanObjectTitle(value).replace(
                                "[]",
                                ""
                              )}`
                            );
                            element?.scrollIntoView({
                              behavior: "smooth",
                              block: "start",
                            });
                          }}
                        >
                          {value}
                        </Badge>
                      </span>
                    );
                  }

                  return props.children;
                })()}
              </li>
            ),
            a: ({ node, ...props }) => (
              <a className="text-blue-400 hover:underline" {...props} />
            ),
            // @ts-ignore
            code: ({ node, inline, ...props }) =>
              inline ? (
                <p />
              ) : (
                <code
                  className="block bg-gray-800 rounded p-2 mb-4 text-gray-300"
                  {...props}
                />
              ),
            blockquote: ({ node, ...props }) => (
              <blockquote
                className="border-l-4 border-gray-700 pl-4 italic text-gray-400"
                {...props}
              />
            ),
            table: ({ node, ...props }) => (
              <div className="overflow-x-auto">
                <table
                  className="min-w-full divide-y divide-gray-700 text-gray-300"
                  {...props}
                />
              </div>
            ),
            th: ({ node, ...props }) => (
              <th
                className="px-4 py-2 bg-gray-800 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                {...props}
              />
            ),
            td: ({ node, ...props }) => (
              <td className="px-4 py-2 whitespace-nowrap text-sm" {...props} />
            ),
          }}
        >
          {code}
        </ReactMarkdown>
      </div>
    );
  }, [code]); // Recompute only when `content` changes

  return (
    <ScrollArea className="h-full px-4 overflow-hidden">
      {MarkdownContent}
    </ScrollArea>
  );
}
