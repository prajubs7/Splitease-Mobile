export type FieldErrors = Record<string, string[]>;

export type ProblemDetail = {
  status: number;
  title: string;
  detail: string;
  errors?: unknown;
  fieldErrors?: unknown;
};

const toFieldErrors = (raw: unknown): FieldErrors | undefined => {
  if (Array.isArray(raw)) {
    const result: FieldErrors = {};
    for (const item of raw) {
      if (typeof item === 'object' && item !== null) {
        const { field, message, defaultMessage } = item as Record<string, unknown>;
        const text = message ?? defaultMessage;
        if (typeof field === 'string' && typeof text === 'string') {
          (result[field] ??= []).push(text);
        }
      }
    }
    return Object.keys(result).length > 0 ? result : undefined;
  }
  if (typeof raw === 'object' && raw !== null) {
    const result: FieldErrors = {};
    for (const [field, value] of Object.entries(raw)) {
      if (typeof value === 'string') {
        result[field] = [value];
      } else if (Array.isArray(value)) {
        result[field] = value.filter((v): v is string => typeof v === 'string');
      }
    }
    return Object.keys(result).length > 0 ? result : undefined;
  }
  return undefined;
};

export class ApiError extends Error {
  status: number;
  title: string;
  detail: string;
  fieldErrors?: FieldErrors;

  constructor(problem: ProblemDetail) {
    super(problem.detail || problem.title || 'Request failed');
    this.name = 'ApiError';
    this.status = problem.status;
    this.title = problem.title;
    this.detail = problem.detail;
    this.fieldErrors = toFieldErrors(problem.fieldErrors ?? problem.errors);
  }

  static fromProblemDetail(payload: unknown, fallbackStatus = 0): ApiError {
    const p = (typeof payload === 'object' && payload !== null ? payload : {}) as Record<
      string,
      unknown
    >;
    return new ApiError({
      status: typeof p.status === 'number' ? p.status : fallbackStatus,
      title: typeof p.title === 'string' ? p.title : 'Request failed',
      detail: typeof p.detail === 'string' ? p.detail : 'Something went wrong.',
      errors: p.errors,
      fieldErrors: p.fieldErrors,
    });
  }
}
