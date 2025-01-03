import React from "react"

interface SelectProps {
    label: string
    options: { value: string; label: string }[]
    error?: string
    value?: string
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
    className?: string
    disabled?: boolean;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, options, error, value, className, disabled, ...rest }: SelectProps, ref) => {
        return (
            <div className={`flex flex-col space-y-2 ${className}`}>
                <label className="text-sm font-medium">{label}</label>
                <select
                    ref={ref}
                    value={value}
                    disabled={disabled}
                    className={`h-12 p-3 rounded-xl shadow-secondary focus:outline-none focus:ring-2 ${
                        error
                            ? "focus:ring-red-500 border border-red-500"
                            : "focus:ring-[#FA240F]"
                    }`}
                    {...rest}
                >
                    <option value="">Selecione uma opção</option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <p className="text-sm text-red-500">{error && <strong>{error}</strong>}</p>
            </div>
        )
    }
)

Select.displayName = "Select"

export default Select