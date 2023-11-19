interface ErrorMessage {
  field: string;
  code: string;
  param?: string|number|Date;
  message?: string;
}

export interface Validator<T> {
  validate(model: T, ctx?: any): Promise<ErrorMessage[]>;
}

export interface SyncValidator<T> {
  validate(model: T, ctx?: any): ErrorMessage[];
}
