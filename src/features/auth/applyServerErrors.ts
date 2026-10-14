import type { FieldPath, FieldValues, UseFormSetError } from 'react-hook-form';
import { ApiError } from '@/api/errors';

/** Puts server field errors onto the form; returns a message when nothing mapped to a form field. */
export const applyServerErrors = <T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  fields: ReadonlyArray<FieldPath<T>>,
): string | null => {
  if (!(error instanceof ApiError)) {
    return 'Something went wrong. Please try again.';
  }
  let mapped = false;
  for (const [field, messages] of Object.entries(error.fieldErrors ?? {})) {
    if ((fields as readonly string[]).includes(field) && messages[0]) {
      setError(field as FieldPath<T>, { type: 'server', message: messages[0] });
      mapped = true;
    }
  }
  return mapped ? null : error.detail || error.title;
};
