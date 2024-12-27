import { EMPTY_DOC_ERROR } from "@/components/markdown-editor";
import {
  convert_to,
  Templates,
  validate,
  json_schema,
  parse_model,
  Validator,
  DataModel,
} from "mdmodels";

/**
 * Validates markdown model content using the mdmodels validator
 * @param content The markdown string to validate
 * @returns RSValidation object containing any validation errors
 */
export function validateMdModel(content: string): Validator {
  return validate(content);
}

/**
 * Checks if a string contains a valid markdown model
 * @param content The markdown string to check
 * @returns true if the content is a valid markdown model or has validation errors other than being empty,
 *          false if the content is empty or not a markdown model
 */
export function isMdModel(content: string): boolean {
  const validation = validateMdModel(content);

  if (validation.errors.length === 1) {
    const error = validation.errors[0];
    if (error.message === EMPTY_DOC_ERROR) {
      return false;
    } else {
      return true;
    }
  }

  return true;
}

/**
 * Converts a markdown model to a different format using the specified template
 * @param content The markdown string to convert
 * @param template The template format to convert to (e.g. JsonSchema)
 * @returns The converted model in the target format
 */
export function convertModel(content: string, template: Templates) {
  if (template === Templates.JsonSchema) {
    return json_schema(content, undefined, false);
  }
  return convert_to(content, template);
}

/**
 * Parses a markdown model string into a structured DataModel object
 * @param content The markdown string to parse
 * @returns The parsed DataModel object, or null if parsing fails
 */
export function getMdModelStructure(content: string): DataModel | null {
  try {
    const parsed = parse_model(content);
    return parsed;
  } catch (error) {
    console.error(error);
    return null;
  }
}
