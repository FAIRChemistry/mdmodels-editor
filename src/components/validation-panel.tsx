import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useValidatorStore } from "@/lib/stores/validator-store";
import { ValidationError } from "@/types";
import { AlertCircle, XCircle, AlertTriangle } from "lucide-react";

const HighlightText = ({ text }: { text: string }) => {
  const parts = text.split(/('.*?')/g);

  return (
    <p className="text-gray-300">
      {parts.map((part, index) => {
        if (part.startsWith("'") && part.endsWith("'")) {
          return (
            <span className="text-white font-bold" key={index}>
              {part.slice(1, -1)}
            </span>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </p>
  );
};

export function ValidationPanel() {
  const { errors } = useValidatorStore();

  const getErrorIcon = (kind: ValidationError["kind"]) => {
    switch (kind) {
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "info":
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="rounded-r-lg border-y border-r border-[#30363d] bg-[#0d1117] overflow-hidden backdrop-blur-sm bg-opacity-95">
      <div className="border-b border-[#30363d] px-4 py-3 min-h-[3.1rem]">
        <h2 className="text-sm font-medium text-gray-400">
          Validation Results
        </h2>
      </div>
      <ScrollArea className="h-[600px] px-4 py-2">
        <div className="space-y-3">
          {errors.map((error) => (
            <Card key={error.id} className="bg-[#161b22] border-[#30363d]">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  {getErrorIcon(error.kind)}
                  <span className="text-gray-400">{error.location}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 text-sm text-gray-300">
                <HighlightText text={error.message} />
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
