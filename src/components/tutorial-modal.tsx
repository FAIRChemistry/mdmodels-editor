import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

import { TutorialNavigation } from "./tutorial-navigation";
import { TutorialContent } from "./tutorial-content";
import { HelpCircleIcon } from "lucide-react";
import { useValidatorStore } from "@/lib/stores/validator-store";

export function DataModelTutorialModal() {
  const { setTutorialOpen, tutorialOpen } = useValidatorStore();
  const [selectedTutorial, setSelectedTutorial] = useState("syntax-overview");

  return (
    <Dialog open={tutorialOpen} onOpenChange={setTutorialOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-transparent text-gray-400 hover:bg-transparent hover:text-gray-300"
          title="Open Tutorial"
          onClick={() => setTutorialOpen(!tutorialOpen)}
        >
          <HelpCircleIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl h-[90vh] p-0 bg-[#0D1117] border-[#30363D]">
        <div className="flex h-full">
          <TutorialNavigation
            selectedTutorial={selectedTutorial}
            onSelectTutorial={setSelectedTutorial}
          />
          <ScrollArea className="flex-grow">
            <TutorialContent selectedTutorial={selectedTutorial} />
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
