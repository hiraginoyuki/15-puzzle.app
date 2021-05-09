import { DependencyList, MutableRefObject, useCallback, useRef } from "react";

export function useCallbackRef<T extends (...args: any[]) => any>(callback: T, deps?: DependencyList) {
  const ref = useRef<T>();
  ref.current = useCallback(callback, deps || []);
  return ref as MutableRefObject<T>;
}
