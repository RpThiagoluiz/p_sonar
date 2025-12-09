import { ResourceConflictException } from './resource-conflict.exception';

describe('ResourceConflictException', () => {
  it('should create exception with correct code and messages', () => {
    const message = 'Resource already exists';

    const exception = new ResourceConflictException(message);

    expect(exception).toBeInstanceOf(Error);
    expect(exception.code).toBe('RC409');
    expect(exception.message).toBe(message);
    expect(exception.shortMessage).toBe('Resource conflict');
  });

  it('should have static CODE property', () => {
    expect(ResourceConflictException.CODE).toBe('RC409');
  });
});
