import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useValidatorStore } from "@/lib/stores/validator-store";
import { Tab } from "@/types";

interface EditorTabsProps {
  tabs: {
    value: Tab;
    label: string;
  }[];
}

export function EditorTabs({ tabs }: EditorTabsProps) {
  const { setSelectedTab } = useValidatorStore();

  return (
    <TabsList className="h-12 bg-transparent border-none space-x-4 p-0">
      {tabs.map((tab) => (
        <TabsTrigger
          id={`${tab.value}-tab`}
          key={tab.value}
          value={tab.value}
          onClick={() => setSelectedTab(tab.value)}
          className="h-full px-4 rounded-none border-b-2 border-transparent data-[state=active]:border-[#f78166] bg-transparent text-sm text-gray-400 hover:text-gray-300"
        >
          {tab.label}
        </TabsTrigger>
      ))}
    </TabsList>
  );
}
