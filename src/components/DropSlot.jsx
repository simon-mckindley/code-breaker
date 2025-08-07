import { useRef, useEffect } from 'react';

export default function DropSlot({ slotIndex, rowIndex, color, locked, rectTrigger, getBoundingRect }) {
    const slotRef = useRef(null);

    useEffect(() => {
        if (slotRef.current && !locked) {
            const rect = slotRef.current.getBoundingClientRect();
            getBoundingRect(slotIndex, rowIndex, rect);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rectTrigger]);

    return (
        <div ref={slotRef} className="guess">
            {color && <div className={`peg ${color}`} />}
        </div>
    );
}
