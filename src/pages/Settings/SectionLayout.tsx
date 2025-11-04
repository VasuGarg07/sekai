import type { ReactNode } from "react";

interface SectionLayoutProps {
    icon?: ReactNode;
    title: string;
    description?: string;
    children: ReactNode;
}

export const SectionLayout = ({
    icon,
    title,
    description,
    children,
}: SectionLayoutProps) => (
    <section className="mb-20">
        <div className="flex items-center gap-3 mb-3">
            {icon}
            <h2 className="text-2xl font-semibold text-white">{title}</h2>
        </div>

        {description && (
            <>
                <p className="text-sm text-zinc-400 mb-4 leading-relaxed">
                    {description}
                </p>
                <div className="border-t border-zinc-600 mb-6" />
            </>
        )}

        <div>{children}</div>
        <div className="border-t border-zinc-600 mt-6" />
    </section>
);