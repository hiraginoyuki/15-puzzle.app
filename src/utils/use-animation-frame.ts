import React, { useEffect, useRef } from "react";

export function useAnimationFrame(onFrame: (time: number) => any, deps?: React.DependencyList) {
  const idRef = useRef(0);

  useEffect(() => {
    function frame(time: number) {
      onFrame(time);
      idRef.current = requestAnimationFrame(frame);
    }
    idRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(idRef.current);
  }, deps);

  return idRef;
}
