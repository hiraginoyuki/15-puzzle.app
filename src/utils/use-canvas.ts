import { DependencyList, useEffect, useRef, useState } from "react";
export function useCanvas(onFrame: (ctx: CanvasRenderingContext2D, time: number) => void, deps: DependencyList, fps: number = 60) {
  const [canvasElement, setCanvasElement] = useState<HTMLCanvasElement>();
  const ctxRef = useRef<CanvasRenderingContext2D>();

  useEffect(() => {
    if (!canvasElement) return;
    ctxRef.current = canvasElement.getContext("2d")!;
  }, [canvasElement]);

  useEffect(() => {
    if (!canvasElement || !ctxRef.current) return;
    const id = setInterval(() => {
      requestAnimationFrame(time => {
        onFrame(ctxRef.current!, performance.timing.navigationStart + time);
      });
    }, 1000 / fps);
    return () => clearInterval(id);
  }, [canvasElement, fps, ...deps || []]);

  return setCanvasElement as (element: HTMLCanvasElement) => void;
}
