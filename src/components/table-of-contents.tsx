import { useState, useEffect } from "react";
import { RiStackLine } from "react-icons/ri";
import { useCode } from "@/lib/stores/validator-store";
import { useReactFlow } from "reactflow";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

function TableOfContents() {
  const [toc, setToc] = useState<TOCItem[]>([]);
  const code = useCode();
  const { setCenter, getNodes } = useReactFlow();

  useEffect(() => {
    const headingRegex = /^(#{1,3})\s+(.+)$/gm;
    const headings: TOCItem[] = [];
    let match;

    while ((match = headingRegex.exec(code)) !== null) {
      headings.push({
        id: match[2],
        text: match[2],
        level: match[1].length,
      });
    }

    setToc(headings);
  }, [code]);

  const handleClick = (id: string) => {
    const cleanedName = id.replace(/\(.*?\)/g, "").trim();
    const nodes = getNodes();
    const node = nodes.find((n) => n.id === cleanedName);
    if (!node) {
      console.log("node not found");
      return;
    }

    setCenter(
      node.position.x + (node.width || 0) / 2,
      node.position.y + (node.height || 0) / 2,
      {
        zoom: 1.1,
        duration: 800,
      }
    );
  };

  return (
    <div className="rounded-lg border border-[#30363d] bg-[#0d1117] overflow-hidden backdrop-blur-sm bg-opacity-95">
      <div className="border-b border-[#30363d] px-4 py-3">
        <h2 className="text-sm font-medium text-gray-400">Table of Contents</h2>
      </div>
      <div className="p-4">
        <div className="flex flex-col gap-1">
          {toc.map((item) => {
            if (item.level === 1) return null;
            return (
              <div
                key={item.id}
                className={`cursor-pointer transition-colors mb-2 text-sm ${
                  item.level === 2
                    ? "text-[#727a82]"
                    : "text-[#c9d1d9] hover:text-[#58a6ff]"
                }`}
                style={{ marginLeft: `${(item.level - 2) * 12}px` }}
                onClick={
                  item.level === 3 ? () => handleClick(item.text) : undefined
                }
              >
                <div className="flex items-center gap-1">
                  {item.level === 3 && <RiStackLine className="h-4 w-4" />}
                  <span>{item.text.replace(/\(.*?\)/g, "").trim()}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default TableOfContents;
