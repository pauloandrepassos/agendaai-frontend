"use client"
import React, { useState, useRef, useEffect } from "react";

interface SelectProps {
  label?: string;
  options: { value: string; label: string }[];
  error?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

const CustomSelect = React.forwardRef<HTMLDivElement, SelectProps>(
  ({ label, options, error, value, className, disabled, onChange }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedLabel, setSelectedLabel] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Atualiza o rótulo selecionado com base no valor
    useEffect(() => {
      const selectedOption = options.find((option) => option.value === value);
      setSelectedLabel(selectedOption ? selectedOption.label : "Selecione uma opção");
    }, [value, options]);

    // Fecha o dropdown ao clicar fora
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    const handleOptionClick = (value: string, label: string) => {
      if (onChange) {
        onChange(value);
      }
      setSelectedLabel(label);
      setIsOpen(false);
    };

    return (
      <div className={`flex flex-col ${className}`} ref={dropdownRef}>
        {label && <label className="text-sm font-medium">{label}</label>}
        <div
          className={`h-12 p-3 rounded-xl shadow-secondary focus:outline-none focus:ring-2 flex items-center justify-between cursor-pointer ${error
              ? "focus:ring-red-500 border border-red-500"
              : "focus:ring-[#FA240F]"
            }`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <span>{selectedLabel}</span>
          <svg
            className={`w-5 h-5 transition-transform ${isOpen ? "transform rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        {isOpen && (
          <div className="mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
            <ul>
              {options.map((option) => (
                <li
                  key={option.value}
                  className={`p-3 hover:bg-gray-100 cursor-pointer ${value === option.value ? "bg-gray-100" : ""
                    }`}
                  onClick={() => handleOptionClick(option.value, option.label)}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          </div>
        )}
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

CustomSelect.displayName = "CustomSelect";

export default CustomSelect;