import { useEffect, useRef, useCallback } from "react";
import { useForceUpdate } from "./use-force-update";

export function useKeydown(target: EventTarget, callback: (event: KeyboardEvent) => any, deps?: React.DependencyList): void {
  const keydownRef = useRef(callback);
  keydownRef.current = useCallback(callback, deps || []);

  useEffect(useForceUpdate(), deps || []);
  useEffect(() => {
    target?.addEventListener("keydown", (event: KeyboardEvent) => keydownRef.current(event));
  }, [ target ]);
}
