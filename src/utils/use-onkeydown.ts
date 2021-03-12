import { useEffect, useRef } from "react";

type Listener = (event: KeyboardEvent) => any;

export function useOnKeyDown(listener: Listener, deps?: React.DependencyList) {
  const listenerRef = useRef<Listener>((event) => listener(event));
  useEffect(() => {
    document.removeEventListener("keydown", listenerRef.current);
    document.addEventListener("keydown", listenerRef.current = (event) => listener(event));
  }, [listener].concat(deps || []));
}
