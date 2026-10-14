import { formatMoney, fromCents, splitEqual, toCents } from '../src/lib/money';

describe('toCents', () => {
  it('parses decimal strings', () => {
    expect(toCents('100.00')).toBe(10000);
    expect(toCents('12.5')).toBe(1250);
    expect(toCents('0.07')).toBe(7);
    expect(toCents('5')).toBe(500);
    expect(toCents('.5')).toBe(50);
    expect(toCents(' 19.99 ')).toBe(1999);
  });
  it('avoids float error', () => {
    expect(toCents('1.15')).toBe(115);
    expect(toCents('0.29')).toBe(29);
    expect(toCents(19.99)).toBe(1999);
  });
  it('handles negatives', () => {
    expect(toCents('-3.20')).toBe(-320);
  });
  it('rejects bad input', () => {
    expect(() => toCents('abc')).toThrow();
    expect(() => toCents('')).toThrow();
    expect(() => toCents('.')).toThrow();
    expect(() => toCents('1.234')).toThrow();
  });
  it('accepts trailing zeros beyond 2 decimals', () => {
    expect(toCents('1.2300')).toBe(123);
  });
});

describe('fromCents', () => {
  it('formats with two decimals', () => {
    expect(fromCents(10000)).toBe('100.00');
    expect(fromCents(5)).toBe('0.05');
    expect(fromCents(0)).toBe('0.00');
    expect(fromCents(-5)).toBe('-0.05');
    expect(fromCents(123456)).toBe('1234.56');
  });
  it('rejects non-integers', () => {
    expect(() => fromCents(1.5)).toThrow();
  });
  it('round-trips with toCents', () => {
    for (const s of ['0.01', '99.99', '100.00', '-12.30']) {
      expect(fromCents(toCents(s))).toBe(s);
    }
  });
});

describe('formatMoney', () => {
  it('formats as USD with grouping', () => {
    expect(formatMoney('100.00')).toBe('$100.00');
    expect(formatMoney(1234.5)).toBe('$1,234.50');
    expect(formatMoney('0.5')).toBe('$0.50');
    expect(formatMoney('-3.2')).toBe('-$3.20');
  });
  it('falls back to $0.00 on garbage', () => {
    expect(formatMoney('nope')).toBe('$0.00');
  });
});

describe('splitEqual', () => {
  it('splits 100.00 / 3 with the leftover cent to the first participant', () => {
    expect(splitEqual(toCents('100.00'), 3)).toEqual([3334, 3333, 3333]);
  });
  it('gives leftover cents to the first participants', () => {
    expect(splitEqual(10, 4)).toEqual([3, 3, 2, 2]);
    expect(splitEqual(101, 3)).toEqual([34, 34, 33]);
  });
  it('splits evenly when divisible', () => {
    expect(splitEqual(900, 3)).toEqual([300, 300, 300]);
    expect(splitEqual(500, 1)).toEqual([500]);
  });
  it('always sums to the total', () => {
    for (const [total, n] of [
      [10000, 3],
      [1, 1],
      [9999, 7],
      [100, 100],
    ]) {
      expect(splitEqual(total, n).reduce((a, b) => a + b, 0)).toBe(total);
    }
  });
  it('rejects shares that would be 0.00 (backend rule)', () => {
    expect(() => splitEqual(2, 3)).toThrow(/too small/);
  });
  it('rejects bad arguments', () => {
    expect(() => splitEqual(0, 3)).toThrow();
    expect(() => splitEqual(100, 0)).toThrow();
    expect(() => splitEqual(100.5, 2)).toThrow();
  });
});
