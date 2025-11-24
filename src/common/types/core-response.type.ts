import { CoreException } from '../exceptions/core.exception';

export type CoreResponse<T> =
  | {
      value: T;
      error: undefined;
    }
  | {
      value: undefined;
      error: CoreException;
    };
