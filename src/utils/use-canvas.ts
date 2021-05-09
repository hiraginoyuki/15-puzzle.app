import { useEffect, useState } from "react";
import { useAnimationFrame } from "./use-animation-frame";

type Callback = (ctx: HTMLCanvasElement) => void;
export function useCanvas(init: Callback, onFrame: Callback) {
  const [canvasElement, setCanvasElement] = useState<HTMLCanvasElement>();

  useEffect(() => {
    if (canvasElement) init(canvasElement);
  }, [canvasElement]);

  useAnimationFrame(() => {
    if (canvasElement) onFrame(canvasElement);
  }, [canvasElement]);

  return setCanvasElement as (element: HTMLCanvasElement) => void;
}
