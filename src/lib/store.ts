import { create } from "zustand";

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
 * Represents a validation error with location and message details
 */
interface ValidationError {
  id: string;
  location: string;
  message: string;
  kind: "error" | "warning" | "info";
}

/**
 * Store interface for managing validation errors
 */
interface ValidatorStore {
  errors: ValidationError[];
  setErrors: (errors: ValidationError[]) => void;
  code: string;
  setCode: (code: string) => void;
}

/**
 * Zustand store for managing validation state
 * Provides access to validation errors and methods to update them
 */
export const useValidatorStore = create<ValidatorStore>((set) => ({
  errors: [],
  setErrors: (errors) => set({ errors }),
  code: INITIAL_CODE,
  setCode: (code) => set({ code }),
}));
