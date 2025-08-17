import { describe, it, expect } from 'vitest';
import { parseError } from '@/utils/errors';

describe('parseError', () => {
  it('should map 42501 code to PERMISSION category', () => {
    const error = { code: '42501', message: 'permission denied for table users' };
    const result = parseError(error);
    
    expect(result.category).toBe('PERMISSION');
    expect(result.message).toBe('Not authorized for this action.');
  });

  it('should map permission denied text to PERMISSION category', () => {
    const error = new Error('Permission denied for this resource');
    const result = parseError(error);
    
    expect(result.category).toBe('PERMISSION');
    expect(result.message).toBe('Not authorized for this action.');
  });

  it('should handle regular errors as UNKNOWN category', () => {
    const error = new Error('Network timeout');
    const result = parseError(error);
    
    expect(result.category).toBe('UNKNOWN');
    expect(result.message).toBe('Network timeout');
  });

  it('should handle string errors', () => {
    const error = 'Something went wrong';
    const result = parseError(error);
    
    expect(result.category).toBe('UNKNOWN');
    expect(result.message).toBe('Something went wrong');
  });

  it('should handle unknown error types', () => {
    const error = { unexpected: 'object' };
    const result = parseError(error);
    
    expect(result.category).toBe('UNKNOWN');
    expect(result.message).toBe('Unknown error');
  });
});