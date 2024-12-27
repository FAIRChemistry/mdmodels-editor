import { useState } from "react";
import { FilePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogOverlay,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useValidatorStore } from "@/lib/stores/validator-store";
import { Tab } from "@/types";

const DEFAULT_CODE = `### Object

- attribute
  - Type: string
`;

export default function NewDocumentButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { code, setCode, setSelectedTab } = useValidatorStore();
  const { toast } = useToast();

  const handleConfirm = () => {
    setCode(DEFAULT_CODE);
    setSelectedTab(Tab.Editor);
    setIsModalOpen(false);
    toast({
      title: "Document created",
      description: "Your new document has been created successfully.",
    });
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-transparent text-gray-400 hover:text-gray-300 border-none hover:bg-transparent hover:border-none"
          title="New document"
          disabled={code.length === 0}
        >
          <FilePlus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogOverlay className="bg-black/30 backdrop-blur-sm" />
      <DialogContent className="bg-[#161b22] border border-[#30363d] text-white shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Create New Document
          </DialogTitle>
          <DialogDescription className="text-[#8b949e]">
            Are you sure you want to create a new document? This action cannot
            be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={() => setIsModalOpen(false)}
            className="border-[#30363d] bg-[#21262d] hover:bg-[#30363d] text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-[#238636] hover:bg-[#2ea043] text-white border-0"
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
