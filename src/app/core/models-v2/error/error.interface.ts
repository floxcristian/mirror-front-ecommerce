export interface IError {
  statusCode: number;
  errorCode: string;
  message: string;
  // Solo si errorCode == VALIDATION_PROBLEM
  errors?: string[];
}
