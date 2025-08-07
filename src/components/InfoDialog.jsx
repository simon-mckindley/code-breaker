import { forwardRef, useImperativeHandle, useRef } from "react";

const InfoDialog = forwardRef((props, ref) => {
    const dialogRef = useRef();

    // Expose openDialog and closeDialog to parent via ref
    useImperativeHandle(ref, () => ({
        open: () => dialogRef.current?.showModal(),
        close: () => dialogRef.current?.close(),
    }));

    return (
        <dialog ref={dialogRef} className="message-dialog">
            <div className="dialog-header">
                <h3>👋 Welcome to Code Breaker</h3>
                <button onClick={() => dialogRef.current?.close()}>X</button>
            </div>
            <p>
                <span>The aim of the game is to guess the colours and positions of the 4 hidden pegs.</span>
                <span>You have 10 guesses. After each guess you will see feedback pegs.</span>
                <span><span className="color yellow-span">Yellow</span> for a correct colour peg in the <span className="u-line">correct</span> place.</span>
                <span><span className="color white-span">White</span> for a correct colour peg in an <span className="u-line">incorrect</span> place.</span>
                <span>Good luck. 😊</span>
            </p>
            <div className="dialog-footer"></div>
            <div className="shadow-box"></div>
        </dialog>
    );
});

export default InfoDialog;
