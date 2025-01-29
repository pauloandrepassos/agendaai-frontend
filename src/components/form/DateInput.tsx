
import React from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DateInputProps {
  label: string;
  selectedDate: Date | null;
  onDateChange: (date: Date | null) => void;
  highlightedDates?: string[];
  className?: string;
}

const DateInput: React.FC<DateInputProps> = ({
  label,
  selectedDate,
  onDateChange,
  highlightedDates = [],
  className,
}) => {
  const highlightDates = highlightedDates.map((date) => new Date(date));

  return (
    <div className={`flex flex-col ${className}`}>
      <label className="text-sm font-medium mb-1">{label}</label>
      <ReactDatePicker
        selected={selectedDate}
        onChange={onDateChange}
        dateFormat="yyyy-MM-dd"
        className="h-12 p-3 rounded-xl shadow-secondary focus:outline-none focus:ring-2 focus:ring-[#FA240F]"
        placeholderText="Selecione a data"
        highlightDates={[
          {
            "react-datepicker__day--highlighted": highlightDates,
          },
        ]}
        inline // Exibe o calendário como componente inline
      />
    </div>
  );
};

export default DateInput;