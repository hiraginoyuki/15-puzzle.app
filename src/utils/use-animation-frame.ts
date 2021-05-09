import React, { useEffect, useRef } from "react";
import { useCallbackRef } from "./use-callback-ref";

export function useAnimationFrame(onFrame: (time: number) => any, deps?: React.DependencyList) {
  const idRef = useRef(0);
  const callbackRef = useCallbackRef(onFrame, deps || []);

  useEffect(() => {
    function frame(time: number) {
      callbackRef.current(time);
      idRef.current = requestAnimationFrame(frame);
    }
    idRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(idRef.current);
  }, []);

  return idRef;
}
