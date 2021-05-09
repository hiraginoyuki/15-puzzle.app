import React, { useEffect } from "react";
import { useCallbackRef } from "./use-callback-ref";

export function useAnimationFrame(onFrame: (time: number) => any, deps?: React.DependencyList) {
  const callbackRef = useCallbackRef(onFrame, deps || []);

  useEffect(() => {
    let id: number;
    function frame(time: number) {
      callbackRef.current(time);
      id = requestAnimationFrame(frame);
    }
    id = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(id);
  }, []);
}
