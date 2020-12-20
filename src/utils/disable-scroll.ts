//@ts-ignore
let disabled = false;
function onTouchMove(event: TouchEvent) {
  if ((event.target as HTMLElement).classList.contains("allow-scroll")) event.stopPropagation();
  else event.preventDefault(); 
} 
document.addEventListener("touchmove", onTouchMove, { passive: false });

export function disableScroll() { disabled = true; }
export function enableScroll() { disabled = false; }
