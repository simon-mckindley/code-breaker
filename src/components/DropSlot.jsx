import { useRef, useEffect } from 'react';

export default function DropSlot({ slotIndex, rowIndex, color, locked, rectTrigger, getBoundingRect }) {
    const slotRef = useRef(null);

    useEffect(() => {
        if (slotRef.current && !locked) {
            const rect = slotRef.current.getBoundingClientRect();
            getBoundingRect(slotIndex, rowIndex, rect);
        }
    }, [rectTrigger]);

    return (
        <div ref={slotRef} className="guess">
            {color && <div className={`peg ${color}`} />}
        </div>
    );
}
