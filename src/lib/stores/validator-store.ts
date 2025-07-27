import { create } from "zustand";
import { devtools, subscribeWithSelector, persist } from "zustand/middleware";
import { getErrors } from "../validation";
import { Tab, ValidationError } from "@/types";
import { getMdModelStructure } from "../mdutils";
import { DataModel } from "mdmodels-core";
import INITIAL_CODE from "@/content/initial-model.md?raw";

/**
 * Store interface for managing validation errors
 */
interface ValidatorStore {
  errors: ValidationError[];
  code: string;
  structure: DataModel | null;
  selectedTab: Tab;
  tourTaken: boolean;
  tutorialOpen: boolean;
  setTutorialOpen: (open: boolean) => void;

  // Actions
  setCode: (code: string) => void;
  setSelectedTab: (tab: Tab) => void;

  // Computed values
  getStructure: () => DataModel | null;
}

export const useValidatorStore = create<ValidatorStore>()(
  devtools(
    persist(
      subscribeWithSelector((set, get) => ({
        errors: getErrors(INITIAL_CODE),
        code: INITIAL_CODE,
        structure: getMdModelStructure(INITIAL_CODE),
        selectedTab: Tab.Editor,
        tourTaken: false,
        tutorialOpen: false,
        setTutorialOpen: (open: boolean) => set({ tutorialOpen: open }),

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
      })),
      {
        name: "mdmodels-editor-state",
        partialize: (state) => ({
          code: state.code,
          selectedTab: state.selectedTab,
          tourTaken: state.tourTaken,
        }),
        // @ts-ignore
        onRehydrate: (state) => {
          if (state) {
            // Recompute derived state after rehydration
            const structure = getMdModelStructure(state.code);
            const errors = getErrors(state.code);

            state.structure = structure;
            state.errors = errors;
          }
        },
      }
    )
  )
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
