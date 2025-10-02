import { X } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
};

export const GlobalModal = ({ isOpen, onClose, children }: Props) => {
    return (
        <div
            className={`fixed inset-0 z-50 flex items-end md:items-center justify-center 
        bg-black/50 transition-opacity duration-200 
        ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        >
            {/* Backdrop click closes modal */}
            <div className="absolute inset-0" onClick={onClose}></div>

            {/* Modal container */}
            <div
                className={`relative bg-white w-full md:max-w-lg max-h-[90vh] overflow-y-auto 
          rounded-t-2xl md:rounded-2xl p-4 md:p-6 transform transition-all duration-300
          ${isOpen ? "translate-y-0 md:scale-100" : "translate-y-full md:scale-95"}`}
            >
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100"
                >
                    <X className="w-5 h-5" />
                </button>

                {children}
            </div>
        </div>
    );
};
