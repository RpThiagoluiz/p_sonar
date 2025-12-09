import { QueryFailedExceptionFilter } from './query-failed.filter';
import { ArgumentsHost, HttpStatus } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

describe('QueryFailedExceptionFilter', () => {
  let filter: QueryFailedExceptionFilter;
  let mockArgumentsHost: ArgumentsHost;
  let mockResponse: any;

  beforeEach(() => {
    filter = new QueryFailedExceptionFilter();

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: jest.fn().mockReturnValue(mockResponse),
      }),
    } as any;
  });

  it('should handle duplicate key error (unique constraint)', () => {
    const error = new QueryFailedError(
      'INSERT INTO ...',
      [],
      new Error('duplicate key value violates unique constraint'),
    );
    (error as any).code = '23505';

    filter.catch(error, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.CONFLICT,
      message: 'A record with this value already exists',
      error: 'Conflict',
    });
  });

  it('should handle generic database errors', () => {
    const errorMessage = 'Some database error';
    const error = new QueryFailedError('SELECT * FROM ...', [], new Error(errorMessage));
    (error as any).code = '99999';

    filter.catch(error, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      error: errorMessage,
    });
  });
});
