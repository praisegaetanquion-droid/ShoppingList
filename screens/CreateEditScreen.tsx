import React, { useState, useEffect } from 'react';
import { ShoppingList, Priority } from '../types';
import { BackIcon, ChevronDownIcon } from '../components/icons';
import CalendarModal from '../components/modals/CalendarModal';
import ConfirmModal from '../components/modals/ConfirmModal';

interface CreateEditScreenProps {
  list: ShoppingList | null;
  isDuplicating: boolean;
  isRelisting: boolean;
  onSave: (listData: Omit<ShoppingList, 'id' | 'items' | 'isDone'>) => void;
  onBack: () => void;
  onNavigateHome: () => void;
}

const priorityOptions: Priority[] = ['High', 'Medium', 'Low'];

const priorityStyles = {
    High: { bg: 'bg-blue-100', text: 'text-blue-800', selectedRing: 'ring-blue-400' },
    Medium: { bg: 'bg-yellow-100', text: 'text-yellow-800', selectedRing: 'ring-yellow-400' },
    Low: { bg: 'bg-green-100', text: 'text-green-800', selectedRing: 'ring-green-400' },
};

// Converts a 'YYYY-MM-DD' string to a local Date object
const fromYYYYMMDD = (dateString: string): Date => {
    const parts = dateString.split('-').map(Number);
    // new Date(year, monthIndex, day) treats it as local time
    return new Date(parts[0], parts[1] - 1, parts[2]);
};

// Converts a local Date object to a 'YYYY-MM-DD' string
const toYYYYMMDD = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};


const CreateEditScreen: React.FC<CreateEditScreenProps> = ({ list, isDuplicating, isRelisting, onSave, onBack, onNavigateHome }) => {
  const [name, setName] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [priority, setPriority] = useState<Priority>('High');
  const [isCalendarOpen, setCalendarOpen] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);

  useEffect(() => {
    if (list) {
      setName(list.name);
      if (list.dueDate) {
          setDueDate(fromYYYYMMDD(list.dueDate));
      } else {
          setDueDate(null);
      }
      setPriority(list.priority);
    }
  }, [list]);

  const handleSave = () => {
    onSave({ name, dueDate: dueDate ? toYYYYMMDD(dueDate) : null, priority });
  };
  
  const handleBack = () => {
      if (isDuplicating || isRelisting) {
          setShowWarningModal(true);
      } else {
          onBack();
      }
  }

  const getButtonText = () => {
    if (isDuplicating) return 'Save Duplicate';
    if (isRelisting) return 'Save Re-list';
    return list ? 'Save Changes' : 'Create List';
  };
  
  const formatDate = (date: Date | null) => {
      if (!date) return '';
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }
  
  const handleDateDone = (date: Date) => {
      setDueDate(date);
      setCalendarOpen(false);
  }

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex items-center mb-6">
        <button onClick={handleBack} className="p-2 -ml-2">
            <BackIcon className="h-6 w-6"/>
        </button>
      </div>
      <h1 className="text-4xl font-bold mb-8 cursor-pointer" onClick={onNavigateHome}>Shopping List</h1>
      
      <div className="space-y-6 flex-grow">
        <div>
          <label className="text-gray-700 font-semibold mb-2 block">List Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter list..."
            className="w-full p-3 bg-blue-50 border border-blue-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
            <label className="text-gray-700 font-semibold mb-2 block">Due Date</label>
            <div className="relative">
                <input
                    type="text"
                    readOnly
                    value={formatDate(dueDate)}
                    onClick={() => setCalendarOpen(true)}
                    placeholder="Select date"
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
                />
                <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
        </div>

        <div>
            <label className="text-gray-700 font-semibold mb-2 block">Set Priority</label>
            <div className="grid grid-cols-3 gap-4">
                {priorityOptions.map(p => {
                    const styles = priorityStyles[p];
                    const isSelected = priority === p;
                    return (
                        <button
                            key={p}
                            onClick={() => setPriority(p)}
                            className={`p-4 rounded-lg text-center transition-all ${styles.bg} ${styles.text}
                                ${isSelected ? `ring-2 ${styles.selectedRing}` : ''}
                            `}
                        >
                            <div className={`w-8 h-8 rounded-full mx-auto mb-2 ${p === 'High' ? 'bg-blue-400' : p === 'Medium' ? 'bg-yellow-400' : 'bg-green-400'}`}></div>
                            <span>{p}</span>
                        </button>
                    )
                })}
            </div>
        </div>
      </div>
      
      <div className="mt-6">
        <button
          onClick={handleSave}
          className="w-full bg-gradient-to-r from-pink-400 to-rose-400 text-white font-bold py-4 px-4 rounded-full disabled:opacity-50"
          disabled={!name || !dueDate}
        >
          {getButtonText()}
        </button>
      </div>

      <CalendarModal 
        isOpen={isCalendarOpen} 
        onClose={() => setCalendarOpen(false)} 
        onDone={handleDateDone}
        selectedDate={dueDate}
      />
      
      <ConfirmModal 
        isOpen={showWarningModal}
        type="warning"
        title="Cannot Go Back"
        message="This is a duplicated list. Please make changes and save, or click the save button to complete the process."
        onConfirm={() => setShowWarningModal(false)}
        confirmText="Got it"
      />
    </div>
  );
};

export default CreateEditScreen;
