/**
 * Represents a validation error from the RSError format.
 *
 * @property attribute - The attribute associated with the error.
 * @property error_type - The type of error.
 * @property location - The location of the error.
 * @property message - The error message.
 * @property object - The object related to the error.
 * @property positions - The positions of the error in the source.
 */
interface RSError {
  attribute: string;
  error_type: string;
  location: string;
  message: string;
  object: string;
  positions: RSPosition[];
}

/**
 * Represents a position in the source code where an error occurs.
 *
 * @property line - The line number of the error position.
 * @property column - An object representing the start and end column numbers of the error.
 * @property offset - An object representing the start and end offsets of the error in the source.
 */
interface RSPosition {
  line: number;
  column: { start: number; end: number };
  offset: { start: number; end: number };
}

/**
 * Represents the result of a validation process.
 *
 * @property is_valid - Indicates whether the validation passed or failed.
 * @property errors - An array of validation errors, if any.
 */
interface RSValidation {
  is_valid: boolean;
  errors: RSError[];
}

/**
 * Represents an error in the CodeMirror editor.
 *
 * @property from - The starting position of the error.
 * @property to - The ending position of the error.
 * @property severity - The severity level of the error.
 * @property message - The error message.
 */
interface CodeMirrorError {
  from: number;
  to: number;
  severity: string;
  message: string;
}

export type { RSError, RSValidation, CodeMirrorError };
