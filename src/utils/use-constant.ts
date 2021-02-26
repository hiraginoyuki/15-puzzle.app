import { useRef } from "react";

export function useConstant<T>(getConstant: () => T) {
  const isDeclaredRef = useRef(false);
  const constantRef = useRef<T>();
  if (!isDeclaredRef.current) {
    isDeclaredRef.current = true;
    constantRef.current = getConstant();
  }
  return constantRef.current!;
}
