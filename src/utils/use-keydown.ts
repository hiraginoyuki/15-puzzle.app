import { DependencyList, useEffect } from "react";
import { useCallbackRef } from "./use-callback-ref";

export function useKeydown(target: EventTarget, callback: (event: KeyboardEvent) => any, deps: DependencyList): void {
  const keydownRef = useCallbackRef(callback, deps);

  useEffect(() => {
    target?.addEventListener("keydown", (event: KeyboardEvent) => keydownRef.current(event));
  }, [ target ]);
}
