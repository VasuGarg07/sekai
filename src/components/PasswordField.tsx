import { Check, Eye, EyeOff, X } from "lucide-react";
import { useId, useState } from "react";
import { PASSWORD_RULES } from "../shared/passwordRules";
import { inputClass, labelClass } from "../ui/formClasses";

interface PasswordFieldProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
    autoComplete: "current-password" | "new-password";
    showRules?: boolean;
}

export default function PasswordField({ value, onChange, label = "Password", autoComplete, showRules = false }: PasswordFieldProps) {
    const [visible, setVisible] = useState(false);
    const id = useId();
    const rulesId = useId();

    return (
        <div>
            <label htmlFor={id} className={labelClass}>{label}</label>
            <div className="relative">
                <input
                    id={id}
                    type={visible ? "text" : "password"}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    autoComplete={autoComplete}
                    aria-describedby={showRules ? rulesId : undefined}
                    required
                    className={`${inputClass} pr-10`}
                />
                <button
                    type="button"
                    onClick={() => setVisible(v => !v)}
                    aria-label={visible ? "Hide password" : "Show password"}
                    className="absolute inset-y-0 right-0 px-3 text-zinc-400 hover:text-white"
                >
                    {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
            </div>

            {showRules && (
                <ul id={rulesId} className="mt-2 grid grid-cols-1 xs:grid-cols-2 gap-x-4 gap-y-1">
                    {PASSWORD_RULES.map(rule => {
                        const met = rule.test(value);
                        return (
                            <li key={rule.label} className={`flex items-center gap-1.5 text-xs ${met ? "text-green-400" : "text-zinc-500"}`}>
                                {met ? <Check className="w-3 h-3" aria-hidden="true" /> : <X className="w-3 h-3" aria-hidden="true" />}
                                {rule.label}
                                <span className="sr-only">{met ? "(done)" : "(missing)"}</span>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
