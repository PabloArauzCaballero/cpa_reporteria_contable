export const MONEY_EPSILON = 0.009;

export function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function sumMoney(values: number[]): number {
  return roundMoney(values.reduce((total, value) => total + value, 0));
}

export function isAlmostZero(value: number): boolean {
  return Math.abs(value) <= MONEY_EPSILON;
}
