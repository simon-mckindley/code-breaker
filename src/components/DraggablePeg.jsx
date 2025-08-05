import { useEffect, useRef } from "react";

export default function DraggablePeg({ color, dropSlotsRects, setDropColor }) {
    const pegRef = useRef(null);
    const pos = useRef({ x: 0, y: 0, startX: 0, startY: 0 });

    useEffect(() => {
        const peg = pegRef.current;
        if (!peg) return;

        const onMouseDown = (e) => {
            e.preventDefault();
            pos.current.startX = e.clientX;
            pos.current.startY = e.clientY;

            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);

            peg.style.cursor = 'grabbing';
        };

        const onMouseMove = (e) => {
            e.preventDefault();

            const dx = e.clientX - pos.current.startX;
            const dy = e.clientY - pos.current.startY;

            pos.current.startX = e.clientX;
            pos.current.startY = e.clientY;

            peg.style.left = `${peg.offsetLeft + dx}px`;
            peg.style.top = `${peg.offsetTop + dy}px`;
        };

        const onMouseUp = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
            peg.style.cursor = '';

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
                        // console.log("Dropped on slot");
                        setDropColor(index, slot.rowIndex, color);
                        return true;
                    }

                    return false;
                }
            });

            // if (!overlap) console.log("Not dropped on any slot");

            // Snap back to original position
            peg.style.left = '';
            peg.style.top = '';
        };

        peg.addEventListener("mousedown", onMouseDown);

        return () => {
            peg.removeEventListener("mousedown", onMouseDown);
        };
    });

    return (
        <div ref={pegRef} className={`peg ${color}`} />
    );
}
