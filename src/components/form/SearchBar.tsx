import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import React from 'react';

interface SearchBarProps {
    className?: string
    placeholder?: string;
    value?: string;
    error?: string; // Propriedade para mensagem de erro
    onSearch?: (query: string) => void;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
    className,
    placeholder = 'Search...',
    value,
    error,
    onSearch,
    onChange,
}) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && onSearch) {
            onSearch(value || '');
        }
    };

    return (
        <div className={`flex flex-col ${className}`}>
            <div className="relative">
                <input
                    type="text"
                    value={value}
                    onChange={onChange}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className={`h-12 w-full p-3 pr-12 rounded-xl shadow-secondary focus:outline-none focus:ring-2 focus:ring-primary`}
                />
                <div className="absolute inset-y-0 right-3 flex items-center text-gray-500">
                    <FontAwesomeIcon icon={faSearch} />
                </div>
            </div>
            <p className="text-sm text-red-500">{error && <strong>{error}</strong>}</p>
        </div>
    );
};

export default SearchBar;
