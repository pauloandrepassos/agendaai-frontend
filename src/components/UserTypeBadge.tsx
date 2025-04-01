// components/UserTypeBadge.tsx
"use client"

interface UserTypeBadgeProps {
    userType: 'admin' | 'vendor' | 'client';
    className?: string;
}

export default function UserTypeBadge({ userType, className = '' }: UserTypeBadgeProps) {
    // Mapeamento de tipos para cores e traduções
    const typeConfig = {
        admin: {
            bgColor: 'bg-purple-100',
            textColor: 'text-purple-800',
            label: 'Administrador'
        },
        vendor: {
            bgColor: 'bg-blue-100',
            textColor: 'text-blue-800',
            label: 'Vendedor'
        },
        client: {
            bgColor: 'bg-green-100',
            textColor: 'text-green-800',
            label: 'Cliente'
        }
    };

    const config = typeConfig[userType] || typeConfig.client;

    return (
        <span
            className={`px-3 py-1 text-sm font-semibold rounded-full ${config.bgColor} ${config.textColor} ${className}`}
        >
            {config.label}
        </span>
    );
}