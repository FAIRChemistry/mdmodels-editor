import { useState } from "react";
import { Download, ClipboardCopy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// @ts-ignore
import { useToast } from "@/hooks/use-toast";
import { Templates } from "mdmodels-core";
import { useValidatorStore } from "@/lib/stores/validator-store";
import { convertModel } from "@/lib/mdutils";

const TEMPLATE_MAPPING: Record<string, Templates> = {
  markdown: Templates.Markdown,
  "json-schema": Templates.JsonSchema,
  xsd: Templates.XmlSchema,
  pydantic: Templates.PythonPydanticXML,
  dataclass: Templates.PythonDataclass,
  typescript: Templates.Typescript,
  shacl: Templates.Shacl,
  shex: Templates.Shex,
};

const schemaTypes = [
  {
    value: "markdown",
    label: "Markdown",
    extension: "md",
    description: "The current markdown code in the editor.",
  },
  {
    value: "xsd",
    label: "XSD",
    extension: "xsd",
    description:
      "XML Schema Definition, a recommendation of the World Wide Web Consortium (W3C), specifies how to formally describe the elements in an Extensible Markup Language (XML) document.",
  },
  {
    value: "pydantic",
    label: "Python PyDantic",
    extension: "py",
    description:
      "Data validation and settings management using Python type annotations.",
  },
  {
    value: "dataclass",
    label: "Python Dataclass",
    extension: "py",
    description:
      "A module in Python that provides a decorator and functions for automatically adding generated special methods to user-defined classes.",
  },
  {
    value: "typescript",
    label: "TypeScript",
    extension: "ts",
    description:
      "A typed superset of JavaScript that compiles to plain JavaScript.",
  },
  {
    value: "shacl",
    label: "SHACL",
    extension: "ttl",
    description:
      "Shapes Constraint Language, a language for validating RDF graphs against a set of conditions.",
  },
  {
    value: "shex",
    label: "ShEx",
    extension: "shex",
    description:
      "Shape Expressions, a language for describing RDF graph structures.",
  },
];

export default function SchemaExporter() {
  const [selectedSchema, setSelectedSchema] = useState<string | undefined>();
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const { code } = useValidatorStore();

  const handleDownload = () => {
    if (!selectedSchema) return;

    const schema = schemaTypes.find((s) => s.value === selectedSchema);
    if (!schema) return;

    let content: string;
    if (selectedSchema !== "markdown") {
      content = convertModel(code, TEMPLATE_MAPPING[selectedSchema]);
    } else {
      content = code;
    }

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `schema.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Schema Downloaded",
      description: `Your ${schema.label} schema has been downloaded.`,
    });
  };

  const handleCopy = () => {
    if (!selectedSchema) return;

    const schema = schemaTypes.find((s) => s.value === selectedSchema);
    if (!schema) return;

    const content = convertModel(code, TEMPLATE_MAPPING[selectedSchema]);
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    toast({
      title: "Copied to Clipboard",
      description: `Your ${schema.label} schema has been copied to the clipboard.`,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-transparent text-gray-400 hover:text-gray-300 border-none hover:bg-transparent hover:border-none"
          title="Export Data Model"
        >
          <Download className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-lg border border-[#30363d] bg-[#0d1117] overflow-hidden backdrop-blur-lg bg-opacity-95">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">
            Export Schema
          </DialogTitle>
          <DialogDescription className="text-[#768390]">
            Choose a schema type to export. You can download the file or copy
            the content to your clipboard.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Select onValueChange={setSelectedSchema}>
            <SelectTrigger className="w-full border-[#444c56] bg-[#22272e] text-white">
              <SelectValue placeholder="Select schema type" />
            </SelectTrigger>
            <SelectContent className="bg-[#22272e] border-[#444c56]">
              {schemaTypes.map((schema) => (
                <SelectItem
                  key={schema.value}
                  value={schema.value}
                  className="text-white hover:bg-[#2d333b] focus:bg-[#2d333b]"
                >
                  {schema.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedSchema && (
            <p className="text-sm text-[#768390] bg-[#2d333b] p-3 rounded-md">
              {schemaTypes.find((s) => s.value === selectedSchema)?.description}
            </p>
          )}
          <div className="flex justify-end space-x-2">
            <div className="relative">
              <Button
                onClick={handleCopy}
                disabled={!selectedSchema}
                variant="outline"
                className="bg-[#373e47] border-[#444c56] text-white hover:bg-[#444c56] disabled:opacity-50"
              >
                <ClipboardCopy className="mr-2 h-4 w-4" />
                Copy to Clipboard
              </Button>
              {copied && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#2d333b] text-white text-xs rounded border border-[#444c56]">
                  Copied!
                </div>
              )}
            </div>
            <Button
              onClick={handleDownload}
              disabled={!selectedSchema}
              className="bg-[#238636] text-white hover:bg-[#2ea043] border-[#238636] disabled:opacity-50"
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
