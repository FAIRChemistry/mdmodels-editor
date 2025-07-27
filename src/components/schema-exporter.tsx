import { useState, useMemo } from "react";
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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// @ts-ignore
import { useToast } from "@/hooks/use-toast";
import CodeMirror from "@uiw/react-codemirror";
import { githubDark } from "@uiw/codemirror-theme-github";
import { EditorView } from "@codemirror/view";
import { markdown } from "@codemirror/lang-markdown";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { rust } from "@codemirror/lang-rust";
import { json } from "@codemirror/lang-json";
import { xml } from "@codemirror/lang-xml";
import { Templates } from "mdmodels-core";
import { useValidatorStore } from "@/lib/stores/validator-store";
import { convertModel } from "@/lib/mdutils";

const TEMPLATE_MAPPING: Record<string, Templates> = {
  markdown: Templates.Markdown,
  "json-schema": Templates.JsonSchema,
  xsd: Templates.XmlSchema,
  pydantic: Templates.PythonPydanticXML,
  "pydantic-v2": Templates.PythonPydantic,
  dataclass: Templates.PythonDataclass,
  rust: Templates.Rust,
  go: Templates.Golang,
  typescript: Templates.Typescript,
  "typescript-zod": Templates.TypescriptZod,
  protobuf: Templates.Protobuf,
  graphql: Templates.Graphql,
  linkml: Templates.Linkml,
  julia: Templates.Julia,
  mermaid: Templates.Mermaid,
  mkdocs: Templates.MkDocs,
  shacl: Templates.Shacl,
  shex: Templates.Shex,
};

const formatTypes = [
  {
    value: "markdown",
    label: "Markdown",
    extension: "md",
    description: "The current markdown code in the editor.",
  },
  {
    value: "json-schema",
    label: "JSON Schema",
    extension: "json",
    description:
      "A JSON Schema is a JSON-based format for defining the structure of JSON data.",
  },
  {
    value: "xsd",
    label: "XSD",
    extension: "xsd",
    description:
      "XML Schema Definition, a recommendation of the World Wide Web Consortium (W3C), specifies how to formally describe the elements in an Extensible Markup Language (XML) document.",
  },
  {
    value: "protobuf",
    label: "Protocol Buffers",
    extension: "proto",
    description:
      "Google's language-neutral, platform-neutral extensible mechanism for serializing structured data.",
  },
  {
    value: "graphql",
    label: "GraphQL",
    extension: "graphql",
    description:
      "A query language for APIs and runtime for executing queries with existing data.",
  },
  {
    value: "linkml",
    label: "LinkML",
    extension: "yaml",
    description:
      "A modeling language for linked data with YAML syntax, used for creating schemas and ontologies.",
  },
  {
    value: "mermaid",
    label: "Mermaid Class Diagram",
    extension: "md",
    description:
      "A visual representation of the data model as a Mermaid class diagram for documentation and visualization.",
  },
  {
    value: "mkdocs",
    label: "MkDocs",
    extension: "md",
    description:
      "Documentation format optimized for MkDocs static site generator with enhanced navigation and structure.",
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

const programmingLanguageTypes = [
  {
    value: "pydantic",
    label: "Python Pydantic (XML)",
    extension: "py",
    description:
      "Data validation and settings management using Python type annotations with XML support.",
  },
  {
    value: "pydantic-v2",
    label: "Python Pydantic v2",
    extension: "py",
    description:
      "Modern Pydantic v2 data validation with enhanced performance and type safety.",
  },
  {
    value: "dataclass",
    label: "Python Dataclass",
    extension: "py",
    description:
      "A module in Python that provides a decorator and functions for automatically adding generated special methods to user-defined classes.",
  },
  {
    value: "rust",
    label: "Rust",
    extension: "rs",
    description:
      "A systems programming language that focuses on safety, speed, and concurrency with strong type checking.",
  },
  {
    value: "go",
    label: "Go",
    extension: "go",
    description:
      "A statically typed, compiled programming language designed for simplicity and efficiency.",
  },
  {
    value: "typescript",
    label: "TypeScript (io-ts)",
    extension: "ts",
    description:
      "TypeScript with io-ts runtime type validation for robust data handling.",
  },
  {
    value: "typescript-zod",
    label: "TypeScript (Zod)",
    extension: "ts",
    description:
      "TypeScript with Zod schema validation library for type-safe runtime validation.",
  },
  {
    value: "julia",
    label: "Julia",
    extension: "jl",
    description:
      "A high-performance programming language for technical computing with dynamic typing and JIT compilation.",
  },
];

const allSchemaTypes = [...formatTypes, ...programmingLanguageTypes];

// Map schema types to CodeMirror language extensions
const getLanguageExtension = (schemaType: string) => {
  switch (schemaType) {
    case "markdown":
    case "mermaid":
    case "mkdocs":
      return [markdown()];
    case "json-schema":
      return [json()];
    case "xsd":
      return [xml()];
    case "pydantic":
    case "pydantic-v2":
    case "dataclass":
      return [python()];
    case "rust":
      return [rust()];
    case "typescript":
    case "typescript-zod":
      return [javascript({ typescript: true })];
    case "go":
    case "julia":
    case "protobuf":
    case "graphql":
    case "linkml":
    case "shacl":
    case "shex":
    default:
      return []; // No specific language support, use plain text
  }
};

export default function SchemaExporter() {
  const [selectedSchema, setSelectedSchema] = useState<string | undefined>("markdown");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const { code } = useValidatorStore();

  // Generate preview content
  const previewContent = useMemo(() => {
    if (!selectedSchema) return "";

    if (selectedSchema === "markdown") {
      return code;
    } else {
      return convertModel(code, TEMPLATE_MAPPING[selectedSchema]);
    }
  }, [selectedSchema, code]);

  // Get language extensions for syntax highlighting
  const previewExtensions = useMemo(() => {
    if (!selectedSchema) return [];

    return [
      ...getLanguageExtension(selectedSchema),
      EditorView.theme({
        "&": {
          fontSize: "11px",
        },
        ".cm-editor": {
          borderRadius: "6px",
        },
        ".cm-focused": {
          outline: "none",
        },
        ".cm-gutters": {
          backgroundColor: "#0D1117",
          border: "none",
        },
        ".cm-lineNumbers": {
          color: "#484F58",
        },
      }),
      EditorView.lineWrapping,
    ];
  }, [selectedSchema]);

  const handleDownload = () => {
    if (!selectedSchema) return;

    const schema = allSchemaTypes.find((s) => s.value === selectedSchema);
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
    a.download = `model.${schema.extension}`;
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

    const schema = allSchemaTypes.find((s) => s.value === selectedSchema);
    if (!schema) return;

    let content: string;
    if (selectedSchema !== "markdown") {
      content = convertModel(code, TEMPLATE_MAPPING[selectedSchema]);
    } else {
      content = code;
    }

    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    toast({
      title: "Copied to Clipboard",
      description: `Your ${schema.label} export has been copied to the clipboard.`,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="text-gray-400 bg-transparent border-none hover:text-gray-300 hover:bg-transparent hover:border-none"
          title="Export Data Model"
        >
          <Download className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent
        className={`rounded-lg border border-[#30363d] bg-[#0d1117] overflow-hidden backdrop-blur-lg bg-opacity-95 ${selectedSchema ? 'sm:max-w-[1200px]' : 'sm:max-w-[425px]'
          }`}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">
            Export Data Model
          </DialogTitle>
          <DialogDescription className="text-[#768390]">
            Choose a target to export your data model to. You can download the
            file or copy the content to your clipboard.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-6 py-4">
          {/* Left side - Controls */}
          <div className="w-[380px] flex-shrink-0">
            <div className="grid gap-4">
              <Select onValueChange={setSelectedSchema} value={selectedSchema}>
                <SelectTrigger className="w-full border-[#444c56] bg-[#22272e] text-white">
                  <SelectValue placeholder="Select target" />
                </SelectTrigger>
                <SelectContent className="bg-[#22272e] border-[#444c56]">
                  <SelectGroup>
                    <SelectLabel className="text-[#768390] px-2 py-1.5 text-sm font-medium">
                      Programming Languages
                    </SelectLabel>
                    {programmingLanguageTypes.map((schema) => (
                      <SelectItem
                        key={schema.value}
                        value={schema.value}
                        className="text-white hover:bg-[#2d333b] focus:bg-[#2d333b]"
                      >
                        {schema.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel className="text-[#768390] px-2 py-1.5 text-sm font-medium">
                      Formats
                    </SelectLabel>
                    {formatTypes.map((schema) => (
                      <SelectItem
                        key={schema.value}
                        value={schema.value}
                        className="text-white hover:bg-[#2d333b] focus:bg-[#2d333b]"
                      >
                        {schema.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {selectedSchema && (
                <p className="text-sm text-[#768390] bg-[#2d333b] p-3 rounded-md">
                  {allSchemaTypes.find((s) => s.value === selectedSchema)?.description}
                </p>
              )}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Button
                    onClick={handleCopy}
                    disabled={!selectedSchema}
                    variant="outline"
                    className="w-full bg-[#373e47] border-[#444c56] text-white hover:bg-[#444c56] disabled:opacity-50"
                  >
                    <ClipboardCopy className="mr-2 w-4 h-4" />
                    Copy
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
                  className="flex-1 bg-[#238636] text-white hover:bg-[#2ea043] border-[#238636] disabled:opacity-50"
                >
                  <Download className="mr-2 w-4 h-4" />
                  Download
                </Button>
              </div>
            </div>
          </div>

          {/* Right side - Preview */}
          {selectedSchema && (
            <div className="overflow-hidden flex-1 min-w-0">
              <div className="h-full">
                <div className="border border-[#30363d] rounded-md overflow-hidden h-[400px]">
                  <CodeMirror
                    value={previewContent}
                    theme={githubDark}
                    extensions={previewExtensions}
                    editable={false}
                    basicSetup={{
                      lineNumbers: true,
                      foldGutter: false,
                      dropCursor: false,
                      allowMultipleSelections: false,
                      indentOnInput: false,
                      searchKeymap: false,
                    }}
                    height="400px"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
