import React from "react";

interface PriceInputProps {
  label: string;
  value?: number;
  error?: string;
  onChange?: (value: number) => void;
  className?: string;
  disabled?: boolean;
}

const PriceInput: React.FC<PriceInputProps> = ({
  label,
  value = 0,
  error,
  onChange,
  className = "",
  disabled = false,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/[^0-9]/g, ""); // Permite apenas números
    const numericValue = parseInt(inputValue, 10);

    if (!isNaN(numericValue)) {
      onChange?.(numericValue / 100); // Divide por 100 para obter o valor decimal
    } else {
      onChange?.(0); // Permite limpar o campo
    }
  };

  const formatValue = (value: number) => {
    const cents = Math.round(value * 100);
    const formatted = (cents / 100).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return formatted;
  };

  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      <label className="text-sm font-medium">{label}</label>
      <input
        type="text"
        value={formatValue(value)}
        onChange={handleInputChange}
        disabled={disabled}
        className={`h-12 p-3 rounded-xl shadow-secondary focus:outline-none focus:ring-2 ${
          error
            ? "focus:ring-red-500 border border-red-500"
            : "focus:ring-[#FA240F]"
        }`}
      />
      {error && (
        <p className="text-sm text-red-500">
          <strong>{error}</strong>
        </p>
      )}
    </div>
  );
};

export default PriceInput;