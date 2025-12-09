import { UnexpectedError } from './unexpected-error.exception';

describe('UnexpectedError', () => {
  it('should create exception with correct code and messages', () => {
    const message = 'An unexpected error occurred';

    const exception = new UnexpectedError(message);

    expect(exception).toBeInstanceOf(Error);
    expect(exception.code).toBe('UERR');
    expect(exception.message).toBe(message);
    expect(exception.shortMessage).toBe('Unexpected error occurred');
  });

  it('should have static CODE property', () => {
    expect(UnexpectedError.CODE).toBe('UERR');
  });
});
