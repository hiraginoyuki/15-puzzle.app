export function defineOnGlobal(o: {}) {
  Object.entries(o).forEach(([key, value]) => {
    if (window.hasOwnProperty(key)) delete window[key as any];
    Object.defineProperty(window, key, { value, configurable: true });
  });
}
