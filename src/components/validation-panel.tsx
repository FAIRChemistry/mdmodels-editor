import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useValidatorStore } from "@/lib/stores/validator-store";
import { ValidationError } from "@/types";
import { AlertCircle, XCircle, AlertTriangle } from "lucide-react";

const HighlightText = ({ text }: { text: string }) => {
  const parts = text.split(/('.*?')/g);

  return (
    <div className="overflow-hidden text-gray-300 whitespace-pre-wrap break-words">
      {parts.map((part, index) => {
        if (part.startsWith("'") && part.endsWith("'")) {
          const content = part.slice(1, -1);
          const codePattern = /`([^`]+)`/g;
          const textWithCode = content.replace(codePattern, '<code class="px-1 py-0.5 bg-gray-800 rounded text-xs font-mono">$1</code>');

          return (
            <span
              key={index}
              className="font-bold"
              dangerouslySetInnerHTML={{ __html: textWithCode }}
            />
          );
        }

        // Handle regular text with potential inline code
        const codePattern = /`([^`]+)`/g;
        const textWithCode = part.replace(codePattern, '<code class="px-1 py-0.5 bg-gray-800 rounded text-xs font-mono">$1</code>');

        return (
          <span
            key={index}
            dangerouslySetInnerHTML={{ __html: textWithCode }}
          />
        );
      })}
    </div>
  );
};

export function ValidationPanel() {
  const { errors } = useValidatorStore();

  const getErrorIcon = (kind: ValidationError["kind"]) => {
    switch (kind) {
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case "info":
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="rounded-r-lg border-y border-r border-[#30363d] bg-[#0d1117] overflow-hidden backdrop-blur-sm bg-opacity-95 w-full max-w-full">
      <div className="border-b border-[#30363d] px-4 py-3 min-h-[3.1rem]">
        <h2 className="text-sm font-medium text-gray-400">
          Validation Results
        </h2>
      </div>
      <ScrollArea className="h-[600px] px-4 py-2">
        <div className="space-y-3">
          {errors.map((error) => (
            <Card key={error.id} className="bg-[#161b22] border-[#30363d] w-full max-w-full overflow-hidden">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="flex gap-2 items-center text-sm font-medium truncate">
                  {getErrorIcon(error.kind)}
                  <span className="text-gray-400 truncate">{error.location}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="overflow-hidden p-4 pt-0 text-sm text-gray-300">
                <HighlightText text={error.message} />
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
