import { useEffect, useRef } from "react";

export default function DraggablePeg({ color }) {
    const pegRef = useRef(null);
    const pos = useRef({ x: 0, y: 0, startX: 0, startY: 0 });

    useEffect(() => {
        const peg = pegRef.current;
        if (!peg) return;

        const rect = peg.getBoundingClientRect();
        const parentRect = peg.offsetParent?.getBoundingClientRect();

        // Store initial position relative to offset parent
        const startLeft = rect.left - (parentRect?.left || 0);;
        const startTop = rect.top - (parentRect?.top || 0);

        const onMouseDown = (e) => {
            e.preventDefault();
            pos.current.startX = e.clientX;
            pos.current.startY = e.clientY;

            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
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

            // Snap back to original position
            peg.style.left = `${startLeft}px`;
            peg.style.top = `${startTop}px`;
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
