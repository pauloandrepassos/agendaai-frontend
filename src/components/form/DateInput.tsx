import React from "react";

interface DateInputProps {
  label: string;
  selectedDate: Date | null;
  onDateChange: (date: Date | null) => void;
  className?: string;
}

const DateInput: React.FC<DateInputProps> = ({
  label,
  selectedDate,
  onDateChange,
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
      />
    </div>
  );
};

export default DateInput;