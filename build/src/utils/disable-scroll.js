//@ts-ignore
var disabled = false;
function onTouchMove(event) {
    if (event.target.classList.contains("allow-scroll"))
        event.stopPropagation();
    else
        event.preventDefault();
}
document.addEventListener("touchmove", onTouchMove, { passive: false });
export function disableScroll() { disabled = true; }
export function enableScroll() { disabled = false; }
//# sourceMappingURL=disable-scroll.js.map