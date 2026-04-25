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

    return createPortal(
        <div
            onClick={(e) => {
                if (e.target === e.currentTarget) handleClose();
            }}
            className={`fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 bg-black/50 transition-all duration-200 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}>
            <div
                className={`transition-all duration-300 ${isOpen ? "translate-y-0 scale-100" : "translate-y-full md:translate-y-0 md:scale-95"}`}>
                {children}
            </div>
        </div>,
        document.getElementById("portal-root")!
    );
};
