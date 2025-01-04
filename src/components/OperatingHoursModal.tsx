import React, { ReactNode, useState } from "react";
import OperatingHours from "./establishment/OperatingHours";

interface OperatingHoursModalProps {
  isOpen: boolean;
  onClose: () => void;
  establishmentId: number;
      children: ReactNode
}

const OperatingHoursModal: React.FC<OperatingHoursModalProps> = ({
  isOpen,
  onClose,
  establishmentId,
  children
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-[90%] sm:w-[400px] relative">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-black"
          onClick={onClose}
        >
          X
        </button>
        <h2 className="text-xl font-semibold mb-4">Horários de Funcionamento</h2>
        {children}
      </div>
    </div>
  );
};

export default OperatingHoursModal