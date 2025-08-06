import { useEffect, useRef } from "react";

export default function DraggablePeg({ color, dropSlotsRects, setDropColor }) {
    const pegRef = useRef(null);
    const pos = useRef({ x: 0, y: 0, startX: 0, startY: 0 });

    useEffect(() => {
        const peg = pegRef.current;
        if (!peg) return;

        const getEventClientCoords = (e) => {
            if (e.touches && e.touches[0]) {
                return { x: e.touches[0].clientX, y: e.touches[0].clientY };
            }
            return { x: e.clientX, y: e.clientY };
        };

        const startDrag = (x, y) => {
            pos.current.startX = x;
            pos.current.startY = y;
            peg.style.cursor = 'grabbing';
            peg.style.zIndex = '50';
        };

        const moveDrag = (x, y) => {
            const dx = x - pos.current.startX;
            const dy = y - pos.current.startY;
            pos.current.startX = x;
            pos.current.startY = y;
            peg.style.left = `${peg.offsetLeft + dx}px`;
            peg.style.top = `${peg.offsetTop + dy}px`;
        };

        const endDrag = () => {
            peg.style.cursor = '';
            peg.style.zIndex = '';
            const pegRect = peg.getBoundingClientRect();

            const overlap = dropSlotsRects.find((slot, index) => {
                const slotRect = slot.rect;
                if (slotRect) {
                    const isOverlapping =
                        pegRect.left < slotRect.right &&
                        pegRect.right > slotRect.left &&
                        pegRect.top < slotRect.bottom &&
                        pegRect.bottom > slotRect.top;

                    if (isOverlapping) {
                        setDropColor(index, slot.rowIndex, color);
                        return true;
                    }
                }
                return false;
            });

            peg.style.left = '';
            peg.style.top = '';
        };

        const onMouseDown = (e) => {
            e.preventDefault();
            const { x, y } = getEventClientCoords(e);
            startDrag(x, y);

            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
        };

        const onMouseMove = (e) => {
            e.preventDefault();
            const { x, y } = getEventClientCoords(e);
            moveDrag(x, y);
        };

        const onMouseUp = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
            endDrag();
        };

        const onTouchStart = (e) => {
            const { x, y } = getEventClientCoords(e);
            startDrag(x, y);

            document.addEventListener("touchmove", onTouchMove, { passive: false });
            document.addEventListener("touchend", onTouchEnd);
        };

        const onTouchMove = (e) => {
            e.preventDefault(); // prevent scrolling
            const { x, y } = getEventClientCoords(e);
            moveDrag(x, y);
        };

        const onTouchEnd = () => {
            document.removeEventListener("touchmove", onTouchMove);
            document.removeEventListener("touchend", onTouchEnd);
            endDrag();
        };

        peg.addEventListener("mousedown", onMouseDown);
        peg.addEventListener("touchstart", onTouchStart, { passive: false });

        return () => {
            peg.removeEventListener("mousedown", onMouseDown);
            peg.removeEventListener("touchstart", onTouchStart);
        };
    }, [dropSlotsRects, setDropColor, color]);

    return (
        <div ref={pegRef} className={`peg ${color}`} />
    );
}
