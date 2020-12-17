export function defineOnGlobal(o: {}) {
  Object.defineProperties(
    window,
    Object.assign(
      {},
      ...Object.entries(o).map(([key, value]) => ({ [key]: { value } }))
    )
  );
}
