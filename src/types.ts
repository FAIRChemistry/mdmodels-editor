import { type Node } from "reactflow";
import { Attribute, Object as ObjectType } from "mdmodels-core";
/**
 * Represents a validation error with location and message details.
 *
 * @property id - Unique identifier for the error.
 * @property location - Location where the error occurred.
 * @property message - Description of the error.
 * @property kind - Severity level of the error ("error", "warning", or "info").
 */
export type ValidationError = {
  id: string;
  location: string;
  message: string;
  kind: "error" | "warning" | "info";
};

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

/**
 * Represents XML configuration for an attribute
 */
interface XMLConfig {
  is_attr: boolean;
  name: string;
}

/**
 * Represents an option with key-value pair
 */
interface Option {
  key: string;
  value: string;
}

/**
 * Represents a node in the graph with schema object data
 */
type ObjectNodeType = Node<ObjectType, "objectNode">;

/**
 * Represents the available tabs in the application UI
 * - Graph: Displays the visual graph representation of the data model
 * - Schema: Shows the schema validation and export options
 * - Editor: The markdown editor view
 */
export enum Tab {
  Graph = "graph",
  Editor = "editor",
  Preview = "preview",
}

interface AttributeEdge extends Attribute {
  sourceObject: string;
  targetObject: string;
}

export type {
  ObjectNodeType,
  RSError,
  RSValidation,
  CodeMirrorError,
  XMLConfig,
  Option,
  AttributeEdge,
};
