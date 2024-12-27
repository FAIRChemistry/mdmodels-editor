"use client";

import { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
// @ts-ignore
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// @ts-ignore
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import { EditorTab } from "./editor-tab";
import BadgeGenerator from "@/components/badge-generator";
import rehypeRaw from "rehype-raw";

import editorGraph from "@/content/editor-graph.md?raw";
import editorLinting from "@/content/editor-linting.md?raw";
import editorOverview from "@/content/editor-overview.md?raw";
import syntaxDefiningAnObject from "@/content/syntax-defining-an-object.md?raw";
import syntaxExportingASchema from "@/content/syntax-export.md?raw";
import syntaxOverview from "@/content/syntax-overview.md?raw";
import syntaxSemanticInformation from "@/content/syntax-semantic-information.md?raw";
import utilityBadgeGen from "@/content/utility-badge-gen.md?raw";

const EDITOR_WIDTH = "650px";

interface TutorialContentProps {
  selectedTutorial: string;
}

const contentMap = {
  "editor-graph": editorGraph,
  "editor-linting": editorLinting,
  "editor-overview": editorOverview,
  "syntax-defining-an-object": syntaxDefiningAnObject,
  "syntax-export": syntaxExportingASchema,
  "syntax-overview": syntaxOverview,
  "syntax-semantic-information": syntaxSemanticInformation,
  "utility-badge-gen": utilityBadgeGen,
};

console.log(contentMap);

export function TutorialContent({ selectedTutorial }: TutorialContentProps) {
  const [content, setContent] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // @ts-ignore
    setContent(contentMap[selectedTutorial] || "");
    containerRef.current?.scrollTo(0, 0);
  }, [selectedTutorial]);

  return (
    <div
      ref={containerRef}
      className="pt-6 pb-60 px-10 bg-[#0D1117] text-[#C9D1D9] overflow-y-auto h-[calc(100vh-4rem)] text-justify hyphens-auto text-base leading-relaxed mx-1 scrollbar-hide"
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          // @ts-ignore
          badgegenerator: ({ node, ...props }) => <BadgeGenerator {...props} />,
          h1: ({ node, ...props }) => (
            <h1
              className="text-3xl font-semibold text-white mb-4 border-b border-[#30363D] pb-2"
              {...props}
            />
          ),
          h2: ({ node, ...props }) => (
            <h2
              className="text-2xl font-semibold text-white mt-8 mb-4 border-b border-[#30363D] pb-2"
              {...props}
            />
          ),
          h3: ({ node, ...props }) => (
            <h3
              className="text-xl font-semibold text-white mt-6 mb-3"
              {...props}
            />
          ),
          p: ({ node, ...props }) => (
            <p className="text-[#C9D1D9] mb-4" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul
              className="list-disc list-inside space-y-2 text-[#C9D1D9] mb-4 pl-4"
              {...props}
            />
          ),
          ol: ({ node, ...props }) => (
            <ol
              className="list-decimal list-inside space-y-2 text-[#C9D1D9] mb-4 pl-4"
              {...props}
            />
          ),
          li: ({ node, ...props }) => <li className="mb-1" {...props} />,
          a: ({ node, ...props }) => (
            <a className="text-[#58a6ff] hover:underline" {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-[#30363D] pl-4 py-1 mb-4 text-[#8B949E] italic"
              {...props}
            />
          ),
          // @ts-ignore
          code: ({ node, inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <div className="flex flex-row items-center justify-center my-10">
                <div
                  className={`shadow-xl bg-[#0D1117] border border-[#30363D] rounded-lg overflow-hidden w-[${EDITOR_WIDTH}]
                            [&_*]:!cursor-text [&_.cm-editor]:rounded-xl [&_.cm-scroller]:!overflow-auto`}
                >
                  <EditorTab
                    className="text-md"
                    height="auto"
                    width={EDITOR_WIDTH}
                    readonly={true}
                    useLineGutter={true}
                    code={String(children).replace(/\n$/, "")}
                  />
                </div>
              </div>
            ) : (
              <code
                className="bg-[#161B22] rounded-md px-1 py-0.5 text-[#E6EDF3]"
                {...props}
              >
                {children}
              </code>
            );
          },
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto mb-4">
              <table
                className="min-w-full divide-y divide-[#30363D]"
                {...props}
              />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead className="bg-[#161B22]" {...props} />
          ),
          th: ({ node, ...props }) => (
            <th
              className="px-6 py-3 text-left text-xs font-medium text-[#8B949E] uppercase tracking-wider"
              {...props}
            />
          ),
          td: ({ node, ...props }) => (
            <td
              className="px-6 py-4 whitespace-nowrap text-sm text-[#C9D1D9]"
              {...props}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
