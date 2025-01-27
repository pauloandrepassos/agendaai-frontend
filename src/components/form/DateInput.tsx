import React from "react";

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
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = event.target.value ? new Date(event.target.value) : null;
    onDateChange(dateValue);
  };

  return (
    <div className={`flex flex-col ${className}`}>
      <label className="text-sm font-medium mb-1">{label}</label>
      <input
        type="date"
        value={selectedDate ? selectedDate.toISOString().split("T")[0] : ""}
        onChange={handleInputChange}
        className="h-12 p-3 rounded-xl shadow-secondary focus:outline-none focus:ring-2 focus:ring-[#FA240F]"
        placeholder="Selecione a data"
        onKeyDown={(e) => e.preventDefault()}
        list="highlighted-dates"
      />
      {/*<datalist id="highlighted-dates">
        {highlightedDates.map((date) => (
          <option key={date} value={date} />
        ))}
      </datalist>*/}
    </div>
  );
};

export default DateInput;

/**
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

 */