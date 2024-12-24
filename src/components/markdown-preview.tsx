import ReactMarkdown from "react-markdown";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useValidatorStore } from "@/lib/store";
import matter from "gray-matter";
export function MarkdownPreview() {
  const { code } = useValidatorStore();
  const { content } = matter(code);

  console.log(content);

  return (
    <ScrollArea className="h-[600px] p-4">
      <ReactMarkdown
        className="prose prose-invert max-w-none"
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-2xl font-bold mb-4" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-xl font-bold mb-3" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-lg font-bold mb-2" {...props} />
          ),
          p: ({ node, ...props }) => <p className="mb-4" {...props} />,
          ul: ({ node, ...props }) => (
            <ul className="list-disc pl-6 mb-4" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal pl-6 mb-4" {...props} />
          ),
          li: ({ node, ...props }) => <li className="mb-1" {...props} />,
          a: ({ node, ...props }) => (
            <a className="text-blue-400 hover:underline" {...props} />
          ),
          // @ts-ignore
          code: ({ node, inline, ...props }) =>
            inline ? (
              <code className="bg-gray-800 rounded px-1 py-0.5" {...props} />
            ) : (
              <code className="block bg-gray-800 rounded p-2 mb-4" {...props} />
            ),
        }}
      >
        {content}
      </ReactMarkdown>
    </ScrollArea>
  );
}
