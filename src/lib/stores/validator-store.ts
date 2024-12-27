import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import { getErrors } from "../validation";
import { Tab, ValidationError } from "@/types";
import { getMdModelStructure } from "../mdutils";
import { DataModel } from "mdmodels-core";

export const INITIAL_CODE = `# MD-Models 

Welcome to the MD-Models editor! 

## Getting Started

- Unfamiliar with MD-Models? To learn more about MD-Models, please click on the question mark in the top right corner.
- To import a model from a GitHub repository, click on the "GitHub" button in the top right corner.
- To export your model to a file, click on the "Download" button in the top right corner.
- Left to the editor, you can see the table of contents of your model. Click on an item to navigate to it.
- Right to the editor, you can see validation errors and warnings.
- Try out the graph editor by clicking on the "Graph" button in the top right corner.

Looking for examples? Please click on the "GitHub" button in the top right corner and choose one of the examples.

To get started, simply edit this text and start writing your own model!

### Person

This is a place to add description of the object.

- __name__
  - Type: string
  - Term: schema:name
  - Description: The name of the person.

- age
  - Type: integer
  - Term: schema:age
  - Description: The age of the person.

- address
  - Type: Address
  - Term: schema:address
  - Description: The address of the person.

### Address

This is a place to add description of the object.

- street
  - Type: string
  - Term: schema:street
  - Description: The street of the address.
`;

/**
 * Store interface for managing validation errors
 */
interface ValidatorStore {
  errors: ValidationError[];
  code: string;
  structure: DataModel | null;
  selectedTab: Tab;
  tourTaken: boolean;

  // Actions
  setCode: (code: string) => void;
  setSelectedTab: (tab: Tab) => void;

  // Computed values
  getStructure: () => DataModel | null;
}

export const useValidatorStore = create<ValidatorStore>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      errors: getErrors(INITIAL_CODE),
      code: INITIAL_CODE,
      structure: getMdModelStructure(INITIAL_CODE),
      selectedTab: Tab.Editor,
      tourTaken: false,

      setCode: (code: string) => {
        set((state) => {
          const structure = getMdModelStructure(code) ?? state.structure;
          const errors = getErrors(code);

          return {
            code,
            structure,
            errors,
          };
        });
      },

      setSelectedTab: (tab: Tab) => set({ selectedTab: tab }),

      // Memoized selector
      getStructure: () => get().structure,
    }))
  )
);

// Monitor store updates
useValidatorStore.subscribe(
  (state) => state.code,
  (code) => {
    console.log("Code updated:", code.length);
  }
);

useValidatorStore.subscribe(
  (state) => state.errors,
  (errors) => {
    console.log("Errors updated:", errors.length);
  }
);

useValidatorStore.subscribe(
  (state) => state.structure,
  (structure) => {
    console.log("Structure updated:", structure ? "present" : "null");
  }
);

useValidatorStore.subscribe(
  (state) => state.selectedTab,
  (tab) => {
    console.log("Selected tab updated:", tab);
  }
);

export const useCode = () => useValidatorStore((state) => state.code);
export const useSetCode = () => useValidatorStore((state) => state.setCode);
export const useErrors = () => useValidatorStore((state) => state.errors);
export const useSelectedTab = () =>
  useValidatorStore((state) => state.selectedTab);
export const useStructure = () => useValidatorStore((state) => state.structure);
export const useModelObject = (name: string) =>
  useValidatorStore((state) =>
    state.structure?.objects.find((o) => o.name === name)
  );
export const useModelAttribute = (objectName: string, attributeName: string) =>
  useValidatorStore((state) =>
    state.structure?.objects
      .find((o) => o.name === objectName)
      ?.attributes.find((a) => a.name === attributeName)
  );
