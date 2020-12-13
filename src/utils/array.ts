export const chooseRandomIndex = <T>(array: T[]): number => Math.floor(Math.random() * array.length);
export const chooseRandom = <T>(array: T[]): T => array[chooseRandomIndex(array)];
