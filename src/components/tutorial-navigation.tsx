import { Button } from "@/components/ui/button";

const SyntaxTutorials = {
  title: "Syntax",
  docs: [
    { id: "syntax-overview", title: "Overview" },
    { id: "syntax-defining-an-object", title: "Composing a Data Model" },
    { id: "syntax-semantic-information", title: "Semantic Information" },
    { id: "syntax-export", title: "Converting Your Data Model" },
  ],
};

const EditorTutorials = {
  title: "Editor",
  docs: [
    { id: "editor-overview", title: "Overview" },
    { id: "editor-linting", title: "Linting" },
  ],
};

const utilityTutorials = {
  title: "Utility",
  docs: [{ id: "utility-badge-gen", title: "Repository Badge Generator" }],
};

const tutorials = [SyntaxTutorials, EditorTutorials, utilityTutorials];

interface TutorialSection {
  title: string;
  docs: { id: string; title: string }[];
  onSelectTutorial: (tutorialId: string) => void;
  selectedTutorial: string;
}

function TutorialSection({
  title,
  docs,
  onSelectTutorial,
  selectedTutorial,
}: TutorialSection) {
  return (
    <>
      <div
        className={`mt-2 cursor-pointer transition-colors mb-2 text-sm text-[#727a82]`}
      >
        {title}
      </div>
      <ul className="space-y-1 flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible gap-0">
        {docs.map((doc) => (
          <li key={doc.id} className="flex-shrink-0 md:flex-shrink">
            <Button
              variant="ghost"
              className={`w-full justify-start text-sm rounded-md ${
                selectedTutorial === doc.id
                  ? "text-[#1F6FEB] hover:bg-[#30363D] hover:text-[#1F6FEB]"
                  : "text-[#C9D1D9] hover:bg-[#30363D] hover:text-[#C9D1D9]"
              }`}
              onClick={() => onSelectTutorial(doc.id)}
            >
              {doc.title}
            </Button>
          </li>
        ))}
      </ul>
    </>
  );
}

interface TutorialNavigationProps {
  selectedTutorial: string;
  onSelectTutorial: (tutorialId: string) => void;
}

export function TutorialNavigation({
  selectedTutorial,
  onSelectTutorial,
}: TutorialNavigationProps) {
  return (
    <nav className="w-full md:w-64 bg-[#161B22] border-b md:border-b-0 md:border-r border-[#30363D]">
      <div className="border-b border-[#30363d] px-4 py-3 min-h-[3.1rem] flex items-center">
        <h2 className="text-sm font-medium text-gray-400">Tutorials</h2>
      </div>
      <div className="p-4">
        <div className="flex flex-col gap-2">
          {tutorials.map((tutorial) => (
            <TutorialSection
              key={tutorial.title}
              {...tutorial}
              selectedTutorial={selectedTutorial}
              onSelectTutorial={onSelectTutorial}
            />
          ))}
        </div>
      </div>
    </nav>
  );
}
