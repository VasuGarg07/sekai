import { createContext, useContext, useState, type ReactNode } from "react";
import { GlobalModal } from "./GlobalModal";

type ModalContextType = {
    open: (content: ReactNode) => void;
    close: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
    const ctx = useContext(ModalContext);
    if (!ctx) throw new Error("useModal must be used within ModalProvider");
    return ctx;
};

export const ModalProvider = ({ children }: { children: ReactNode }) => {
    const [content, setContent] = useState<ReactNode | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const open = (c: ReactNode) => {
        setContent(c);
        setIsOpen(true);
    };

    const close = () => {
        setIsOpen(false);
        setTimeout(() => setContent(null), 200); // let animation finish
    };

    return (
        <ModalContext.Provider value={{ open, close }}>
            {children}
            <GlobalModal isOpen={isOpen} onClose={close}>
                {content}
            </GlobalModal>
        </ModalContext.Provider>
    );
};
