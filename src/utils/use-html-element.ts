import { useCallback, useEffect, useState } from "react";

export function useHTMLElement<E extends HTMLElement>(effect: (element: E) => void) {
  const [element, setElement] = useState<E>();
  useEffect(() => element && effect(element), [element]);
  const ref = useCallback((element: E | null) => {
    if (element instanceof HTMLElement) setElement(element);
  }, []);
  return [element, ref];
}
