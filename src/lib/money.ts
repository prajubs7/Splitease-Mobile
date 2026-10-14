// Money is handled as integer cents; never do arithmetic on decimal numbers.

const MONEY_PATTERN = /^([+-])?(\d*)(?:\.(\d*))?$/;

/** "100.00" | "12.5" | 12.5 -> 10000 | 1250. Throws on malformed input or more than 2 decimals. */
export const toCents = (value: string | number): number => {
  const text = (typeof value === 'number' ? String(value) : value).trim();
  const match = MONEY_PATTERN.exec(text);
  if (!match || (match[2] === '' && !match[3])) {
    throw new Error(`Invalid money amount: "${text}"`);
  }
  const sign = match[1];
  const whole = match[2] ?? '';
  const fraction = match[3] ?? '';
  if (/[1-9]/.test(fraction.slice(2))) {
    throw new Error(`Too many decimal places: "${text}"`);
  }
  const cents = Number(whole || '0') * 100 + Number(fraction.padEnd(2, '0').slice(0, 2));
  return sign === '-' ? -cents : cents;
};

/** 10000 -> "100.00", -5 -> "-0.05". */
export const fromCents = (cents: number): string => {
  if (!Number.isInteger(cents)) {
    throw new Error(`Cents must be an integer: ${cents}`);
  }
  const abs = Math.abs(cents);
  const text = `${Math.floor(abs / 100)}.${String(abs % 100).padStart(2, '0')}`;
  return cents < 0 ? `-${text}` : text;
};

const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

/** "1234.5" | 1234.5 -> "$1,234.50". Falls back to $0.00 for unparseable input. */
export const formatMoney = (value: string | number): string => {
  let cents: number;
  try {
    cents = toCents(value);
  } catch {
    cents = 0;
  }
  return formatter.format(cents / 100);
};

/** Same as the backend SplitCalculator: base share rounded down, leftover cents go to the first participants. */
export const splitEqual = (totalCents: number, n: number): number[] => {
  if (!Number.isInteger(totalCents) || totalCents <= 0) {
    throw new Error('Total must be a positive number of cents');
  }
  if (!Number.isInteger(n) || n <= 0) {
    throw new Error('Participant count must be a positive integer');
  }
  const base = Math.floor(totalCents / n);
  if (base === 0) {
    throw new Error(`${fromCents(totalCents)} is too small to split among ${n} people`);
  }
  const extra = totalCents - base * n;
  return Array.from({ length: n }, (_, i) => (i < extra ? base + 1 : base));
};
