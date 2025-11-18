import React, { useState } from 'react';
import BaseModal from './BaseModal';
import { BackIcon, XIcon } from '../icons';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDone: (date: Date) => void;
  selectedDate: Date | null;
}

const CalendarModal: React.FC<CalendarModalProps> = ({ isOpen, onClose, onDone, selectedDate }) => {
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date());
  const [displayDate, setDisplayDate] = useState(selectedDate || new Date());

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    let day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Adjust to Monday as first day
  };
  
  const today = new Date();
  today.setHours(0,0,0,0);

  const renderDays = () => {
    const daysInMonth = getDaysInMonth(displayDate.getFullYear(), displayDate.getMonth());
    const firstDay = getFirstDayOfMonth(displayDate.getFullYear(), displayDate.getMonth());
    const blanks = Array(firstDay).fill(null);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    return [...blanks, ...days].map((day, index) => {
        if (day === null) {
            return <div key={`blank-${index}`} className="w-10 h-10"></div>;
        }

        const dayDate = new Date(displayDate.getFullYear(), displayDate.getMonth(), day);
        dayDate.setHours(0,0,0,0);
        
        const isPast = dayDate < today;
        const isSelected = currentDate && dayDate.getTime() === currentDate.getTime();

        return (
            <div key={day} className="flex items-center justify-center">
                <button
                    onClick={() => !isPast && setCurrentDate(dayDate)}
                    disabled={isPast}
                    className={`w-10 h-10 rounded-full flex items-center justify-center
                        ${isPast ? 'text-gray-300' : 'hover:bg-pink-100'}
                        ${isSelected ? 'bg-rose-200 text-black font-bold' : ''}
                    `}
                >
                    {day}
                </button>
            </div>
        );
    });
  };

  const handlePrevMonth = () => {
    setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 1));
  };
  
  const handleDone = () => {
      onDone(currentDate);
  }

  return (
    <BaseModal isOpen={isOpen}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {displayDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
          <button onClick={onClose}><XIcon className="w-6 h-6"/></button>
        </div>
        
        <div className="flex justify-between items-center mb-4">
            <button onClick={handlePrevMonth}><BackIcon className="w-6 h-6" /></button>
            <h3 className="font-semibold">{displayDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
            <button onClick={handleNextMonth}><BackIcon className="w-6 h-6 rotate-180" /></button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-gray-500 mb-2">
            {daysOfWeek.map(day => <div key={day} className="font-medium">{day}</div>)}
        </div>

        <div className="grid grid-cols-7 gap-1 text-center">
            {renderDays()}
        </div>

        <button
            onClick={handleDone}
            className="w-full mt-6 bg-gradient-to-r from-pink-400 to-rose-400 text-white font-bold py-3 px-4 rounded-full"
        >
            Done
        </button>
      </div>
    </BaseModal>
  );
};

export default CalendarModal;