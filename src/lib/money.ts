export type MoneyInput = string | number;

const normalizeMoneyString = (value: MoneyInput): string => {
  if (typeof value === 'number') {
    return value.toFixed(2);
  }

  return value.trim();
};

export const toCents = (value: MoneyInput): number => {
  const text = normalizeMoneyString(value);
  const parsed = Number.parseFloat(text);

  if (Number.isNaN(parsed)) {
    return 0;
  }

  return Math.round(parsed * 100);
};

export const fromCents = (value: number): string => {
  const safeValue = Number.isFinite(value) ? Math.round(value) : 0;
  const dollars = Math.floor(Math.abs(safeValue) / 100);
  const cents = Math.abs(safeValue) % 100;
  const sign = safeValue < 0 ? '-' : '';

  return `${sign}${dollars}.${String(cents).padStart(2, '0')}`;
};

export const addCents = (left: number, right: number): number => left + right;

export const subtractCents = (left: number, right: number): number => left - right;

export const splitEvenly = (totalCents: number, participantCount: number): number[] => {
  const safeCount = Math.max(1, participantCount);
  const base = Math.floor(totalCents / safeCount);
  const remainder = totalCents % safeCount;

  return Array.from({ length: safeCount }, (_, index) => base + (index < remainder ? 1 : 0));
};

export const moneyToCurrency = (value: MoneyInput): string => {
  const amount = Number.parseFloat(normalizeMoneyString(value));

  return Number.isFinite(amount)
    ? new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount)
    : '$0.00';
};
