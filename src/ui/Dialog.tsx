import { useImperativeHandle, useRef, type ReactNode, type RefObject } from "react";

export interface DialogHandle {
    openDialog: () => void;
    closeDialog: () => void;
};

interface DialogProps {
    children: ReactNode,
    ref: RefObject<DialogHandle | null>
}

export const Dialog = ({ children, ref }: DialogProps) => {

    const dialogRef = useRef<HTMLDialogElement | null>(null);

    useImperativeHandle(ref, () => ({
        openDialog: () => dialogRef.current?.showModal(),
        closeDialog: () => dialogRef.current?.close()
    }));

    return (
        <dialog
            ref={dialogRef}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-transparent p-0 backdrop:bg-black/50"
            onClick={(e) => {
                if (e.target === dialogRef.current) dialogRef.current?.close();
            }}
        >
            {children}
        </dialog>
    );
}