export type ProblemDetail = {
  status: number;
  title: string;
  detail: string;
  errors?: Record<string, string[]>;
  fieldErrors?: Record<string, string[]>;
};

export class ApiError extends Error {
  status: number;
  title: string;
  detail: string;
  fieldErrors?: Record<string, string[]>;

  constructor(problem: ProblemDetail) {
    super(problem.detail || problem.title || 'Request failed');
    this.name = 'ApiError';
    this.status = problem.status;
    this.title = problem.title;
    this.detail = problem.detail;
    this.fieldErrors = problem.fieldErrors ?? problem.errors;
  }
}
