import React from "react";

interface InputProps {
    label: string;
    placeholder: string;
    type?: string;
    value?: string;
    error?: string; // Propriedade para mensagem de erro
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string
    disabled?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ label, placeholder, type = "text", value, error, className, disabled, ...rest }: InputProps, ref) => {
        return (
            <div className={`flex flex-col ${className}`}>
                <label className="text-sm font-medium">{label}</label>
                <input
                    ref={ref}
                    type={type}
                    value={value}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={`h-12 p-3 rounded-xl shadow-secondary focus:outline-none focus:ring-2 ${error
                            ? "focus:ring-red-500 border border-red-500"
                            : "focus:ring-[#FA240F]"
                        }`}
                    {...rest}
                />
                <p className="text-sm text-red-500">{error && <strong>{error}</strong>}</p>
            </div>
        );
    }
);

Input.displayName = "Input";

export default Input;
