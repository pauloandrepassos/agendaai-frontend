import React, { useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { ptBR } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import "../../styles/datepicker.css";

registerLocale("pt-BR", ptBR);

interface DateInputProps {
  selectedDate: Date | null;
  onDateChange: (date: Date | null) => void;
  highlightedDates?: string[];
  className?: string;
}

const DateInput: React.FC<DateInputProps> = ({
  selectedDate,
  onDateChange,
  highlightedDates = [],
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleChange = (date: Date | null) => {
    onDateChange(date);
    setIsOpen(false);
  };

  const formatLocalDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const highlightWithRed = (date: Date) => {
    const formattedDate = formatLocalDate(date);
    return highlightedDates.includes(formattedDate)
      ? "highlighted-date"
      : "";
  };

  const localHighlightedDates = highlightedDates.map((dateStr) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day);
  });

  return (
    <div className={`relative ${className} border`}>
      <button
        onClick={handleClick}
        className="bg-elementbg items-center shadow-primary border-2 border-primary hover:bg-primary hover:text-white rounded-lg py-1 px-4 flex gap-2 font-bold h-full"
      >
        Data
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-2 right-0 bg-white border-2 border-secondary p-4 rounded-lg shadow-lg">
          <DatePicker
            selected={selectedDate}
            onChange={handleChange}
            inline
            highlightDates={localHighlightedDates}
            locale="pt-BR"
            dayClassName={highlightWithRed}
            dateFormat="dd/MM/yyyy"
          />
          <div className="divider"></div>
          <div className="mt-2 text-sm">
            <p><span className="legend selected"></span> Dia selecionado</p>
            <p><span className="legend highlighted"></span> Dia destacado</p>
            <p><span className="legend outside-month"></span> Fora do mês atual</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateInput;
