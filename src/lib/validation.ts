import { EMPTY_DOC_ERROR } from "@/components/markdown-editor";
import { ValidationError } from "@/types";
import { CodeMirrorError, RSError } from "@/types";
import {
  validate,
  Validator,
  ValidationError as RSValidationError,
} from "mdmodels-core";

/**
 * Converts an Validator object to a ValidationError object.
 *
 * @param error - The Validator object to convert.
 * @returns A ValidationError object containing the converted error information.
 */
export function mdErrorToValidationError(
  error: RSValidationError
): ValidationError {
  const locationLine = `Line ${error.positions[0].line}, Column ${error.positions[0].column.start}`;
  return {
    id: error.attribute ?? "",
    location: locationLine,
    message: error.message,
    kind: "error",
  };
}

/**
 * Converts an RSError object to an array of CodeMirrorError objects.
 *
 * @param error - The RSError object to convert.
 * @returns An array of CodeMirrorError objects containing the converted error information.
 */
export function mdErrorToCodeMirrorError(error: RSError): CodeMirrorError[] {
  const errors: CodeMirrorError[] = [];

  for (const position of error.positions) {
    errors.push({
      from: position.offset.start,
      to: position.offset.end,
      severity: "error",
      message: error.message,
    });
  }

  return errors;
}

/**
 * Validates markdown code and returns an array of validation errors.
 *
 * @param code - The markdown string to validate
 * @returns An array of ValidationError objects containing any validation errors found
 */
export function getErrors(code: string): ValidationError[] {
  const validation: Validator = validate(code);
  const convertedErrors: ValidationError[] = convertErrors(validation);

  return convertedErrors;
}

/**
 * Converts an array of RSValidation errors into ValidationError objects.
 * Filters out empty document errors and converts the remaining errors using mdErrorToValidationError.
 *
 * @param validation - The RSValidation object containing validation errors
 * @returns An array of ValidationError objects containing the converted errors
 */
export function convertErrors(validation: Validator): ValidationError[] {
  const convertedErrors: ValidationError[] = [];

  for (const error of validation.errors) {
    if (error.message === EMPTY_DOC_ERROR) {
      continue;
    }

    const convertedError = mdErrorToValidationError(error);
    convertedErrors.push(convertedError);
  }

  return convertedErrors;
}
