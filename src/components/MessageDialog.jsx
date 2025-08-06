import { forwardRef, useImperativeHandle, useRef } from "react";

const MessageDialog = forwardRef((props, ref) => {
    const dialogRef = useRef();

    // Expose openDialog and closeDialog to parent via ref
    useImperativeHandle(ref, () => ({
        open: () => dialogRef.current?.showModal(),
        close: () => dialogRef.current?.close(),
    }));

    return (
        <dialog ref={dialogRef} className="message-dialog">
            <div className="dialog-header">
                <h3>{props.title || 'Message'}</h3>
                <button onClick={() => dialogRef.current?.close()}>X</button>
            </div>
            <p>{props.message || '...'}</p>
            <div className="dialog-footer"></div>
            <div className="shadow-box"></div>
        </dialog>
    );
});

export default MessageDialog;
