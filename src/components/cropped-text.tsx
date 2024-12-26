import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface CroppedTextProps {
  text: string;
  maxWords?: number;
  className?: string;
}

export function CroppedText({
  text,
  maxWords = 50,
  className,
}: CroppedTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const cropText = useCallback((text: string, maxWords: number) => {
    const words = text.split(" ");
    if (words.length <= maxWords) {
      return text;
    }
    return words.slice(0, maxWords).join(" ") + " [...]";
  }, []);

  const toggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const displayText = isExpanded ? text : cropText(text, maxWords);

  return (
    <p
      className={cn("cursor-pointer transition-colors", className)}
      onClick={toggleExpand}
    >
      {displayText}
    </p>
  );
}
