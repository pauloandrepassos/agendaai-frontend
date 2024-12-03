import React from 'react';

interface InputProps {
    label: string
    placeholder: string
    type?: string
    value?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ label, placeholder, type = 'text', value, ...rest }: InputProps, ref) => {
    return (
        <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">{label}</label>
            <input
                ref={ref}
                type={type}
                value={value}
                placeholder={placeholder}
                className="h-12 p-3 focus:outline-none focus:ring-2 focus:ring-[#FA240F] rounded-full shadow-[4px_4px_0_0_#FA240F]"
                {...rest}
            />
        </div>
    )
})

Input.displayName = 'Input' 

export default Input
