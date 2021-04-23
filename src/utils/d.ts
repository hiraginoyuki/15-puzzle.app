export function d<T>(obj: T, defaultTo: any = {}) {
  return obj || defaultTo as T;
}
