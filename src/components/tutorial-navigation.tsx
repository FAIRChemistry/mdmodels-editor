import { Button } from "@/components/ui/button"

const tutorials = [
  { id: 'defining-an-object', title: 'Defining an Object' },
  { id: 'adding-attributes-and-types', title: 'Adding Attributes and Types' },
  { id: 'interconnecting-objects', title: 'Interconnecting Objects' },
  { id: 'adding-documentation', title: 'Adding Documentation' },
]

interface TutorialNavigationProps {
  selectedTutorial: string
  onSelectTutorial: (tutorialId: string) => void
}

export function TutorialNavigation({ selectedTutorial, onSelectTutorial }: TutorialNavigationProps) {
  return (
    <nav className="w-full md:w-64 bg-[#161B22] border-b md:border-b-0 md:border-r border-[#30363D] p-4">
      <h2 className="text-sm font-semibold mb-4 text-[#C9D1D9]">Tutorial Sections</h2>
      <ul className="space-y-1 flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible">
        {tutorials.map((tutorial) => (
          <li key={tutorial.id} className="flex-shrink-0 md:flex-shrink">
            <Button
              variant="ghost"
              className={`w-full justify-start text-sm rounded-md ${
                selectedTutorial === tutorial.id 
                  ? 'bg-[#1F6FEB] text-white hover:bg-[#1F6FEB]/90'
                  : 'text-[#C9D1D9] hover:bg-[#30363D]'
              }`}
              onClick={() => onSelectTutorial(tutorial.id)}
            >
              {tutorial.title}
            </Button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

