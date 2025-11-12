import { formatCurrency } from '../index';

describe('formatCurrency', () => {
  it('should format currency correctly for whole numbers', () => {
    expect(formatCurrency(1000)).toBe('₦1,000');
    expect(formatCurrency(5000)).toBe('₦5,000');
    expect(formatCurrency(10000)).toBe('₦10,000');
  });

  it('should format currency correctly for decimal numbers', () => {
    expect(formatCurrency(1000.50)).toBe('₦1,000.5');
    expect(formatCurrency(2500.75)).toBe('₦2,500.75');
  });

  it('should handle zero and negative numbers', () => {
    expect(formatCurrency(0)).toBe('₦0');
    expect(formatCurrency(-500)).toBe('-₦500');
  });

  it('should handle small amounts', () => {
    expect(formatCurrency(50)).toBe('₦50');
    expect(formatCurrency(99)).toBe('₦99');
  });

  it('should handle large amounts', () => {
    expect(formatCurrency(1000000)).toBe('₦1,000,000');
    expect(formatCurrency(2500000)).toBe('₦2,500,000');
  });
});