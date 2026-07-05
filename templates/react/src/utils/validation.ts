export const nullSafe = (value: any): boolean =>
  typeof value !== 'undefined' && value !== null;
