
export default function DropSlot({ color, locked, onDropColor }) {
    const handleDragOver = (e) => {
        e.preventDefault(); // Necessary to allow drop
    };

    const handleDrop = (e) => {
        if (locked) {
            return;
        }
        // const droppedColor = e.dataTransfer.getData("text/plain");
        onDropColor(droppedColor);
    };

    return (
        <div
            className="guess"
            // onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            {color && <div className={`peg ${color}`} />}
        </div>
    );
}
