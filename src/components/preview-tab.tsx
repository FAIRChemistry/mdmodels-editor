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
      <div id="preview-scroll-container" className="flex relative h-full">
        <ReactMarkdown
          className="px-10 pt-10 pb-10 mt-5 max-w-none text-white prose prose-invert scrollbar-hide"
          remarkPlugins={[remarkFrontmatter]}
          components={{
            h1: ({ node, ...props }) => (
              <h1 className="mb-4 text-2xl font-bold text-white" {...props} />
            ),
            h2: ({ node, ...props }) => (
              <h2 className="mb-3 text-xl font-bold text-white" {...props} />
            ),
            h3: ({ node, ...props }) => (
              <h3
                id={`preview-${cleanObjectTitle(
                  props.children?.toString() ?? ""
                )}`}
                className="mb-2 text-lg font-bold text-white"
                {...props}
              />
            ),
            p: ({ node, ...props }) => (
              <p className="mb-4 text-justify text-gray-300" {...props} />
            ),
            ul: ({ node, ...props }) => (
              <ul className="pl-6 mb-4 list-disc text-gray-300" {...props} />
            ),
            ol: ({ node, ...props }) => (
              <ol className="pl-6 mb-4 list-decimal text-gray-300" {...props} />
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
                  className="block p-2 mb-4 text-gray-300 bg-gray-800 rounded"
                  {...props}
                />
              ),
            blockquote: ({ node, ...props }) => (
              <blockquote
                className="pl-4 italic text-gray-400 border-l-4 border-gray-700"
                {...props}
              />
            ),
            table: ({ node, ...props }) => (
              <div className="overflow-x-auto">
                <table
                  className="min-w-full text-gray-300 divide-y divide-gray-700"
                  {...props}
                />
              </div>
            ),
            th: ({ node, ...props }) => (
              <th
                className="px-4 py-2 text-xs font-medium tracking-wider text-left text-gray-400 uppercase bg-gray-800"
                {...props}
              />
            ),
            td: ({ node, ...props }) => (
              <td className="px-4 py-2 text-sm whitespace-nowrap" {...props} />
            ),
          }}
        >
          {code}
        </ReactMarkdown>
      </div>
    );
  }, [code]); // Recompute only when `content` changes

  return (
    <ScrollArea className="overflow-hidden px-4 h-full">
      {MarkdownContent}
    </ScrollArea>
  );
}
