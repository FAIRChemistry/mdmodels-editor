import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import { getErrors } from "../validation";
import { MDModelSchema, Tab, ValidationError } from "@/types";
import { getMdModelStructure } from "../mdutils";

export const INITIAL_CODE = `---
id-field: true
repo: "https://www.github.com/my/repo/"
prefix: "tst"
prefixes:
  schema: http://schema.org/
nsmap:
  tst: http://example.com/test/
---

### Test

This is simple description of the test. It represents a basic data model with a name identifier, a numeric value, and a reference to Test2 objects. The Test object demonstrates common data modeling patterns like identifiers, primitive types, and relationships between objects.

- __name__
  - Type: Identifier
  - Term: schema:hello
  - Description: The name of the test.
  - XML: @name
- number
  - Type: float
  - Term: schema:one
  - XML: @number
  - Default: 1.0
- test2
  - Type: [Test2](#test2)[]
  - Term: schema:something
  - XML: SomeTest2

### Test2

- names
  - Type: string[]
  - Term: schema:hello
  - XML: name
- number
  - Type: float
  - Term: schema:one
  - XML: @number
  - Minimum: 0
`;

/**
 * Store interface for managing validation errors
 */
interface ValidatorStore {
  errors: ValidationError[];
  code: string;
  structure: MDModelSchema | null;
  selectedTab: Tab;

  // Actions
  setCode: (code: string) => void;
  setSelectedTab: (tab: Tab) => void;

  // Computed values
  getStructure: () => MDModelSchema | null;
}

export const useValidatorStore = create<ValidatorStore>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      errors: getErrors(INITIAL_CODE),
      code: INITIAL_CODE,
      structure: getMdModelStructure(INITIAL_CODE),
      selectedTab: Tab.Graph,

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
export const useErrors = () => useValidatorStore((state) => state.errors);
export const useSelectedTab = () =>
  useValidatorStore((state) => state.selectedTab);
export const useStructure = () => useValidatorStore((state) => state.structure);
export const useModelObject = (name: string) =>
  useValidatorStore((state) =>
    state.structure?.objects.find((o) => o.name === name)
  );
