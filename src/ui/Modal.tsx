import { useImperativeHandle, useState, type ReactNode, type RefObject } from "react";
import { createPortal } from "react-dom";

export interface ModalHandle {
    open: () => void;
    close: () => void;
};

interface ModalProps {
    ref: RefObject<ModalHandle | null>,
    children: ReactNode
}

export const Modal = ({ children, ref }: ModalProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    useImperativeHandle(ref, () => ({
        open: handleOpen,
        close: handleClose
    }));

    if(!isOpen) return null

    return createPortal(
        <div
            onClick={(e) => {
                if (e.target === e.currentTarget) handleClose();
            }}
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50`}>
                {children}
        </div>,
        document.getElementById("portal-root")!
    );
};
