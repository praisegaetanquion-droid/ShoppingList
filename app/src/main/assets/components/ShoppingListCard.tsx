import React, { useState, useRef, useEffect } from 'react';
import { ShoppingList } from '../types';
import { MoreHorizontalIcon } from './icons';

interface ShoppingListCardProps {
  list: ShoppingList;
  onEdit: (list: ShoppingList) => void;
  onDuplicate: (list: ShoppingList) => void;
  onDelete: () => void;
  onSelect: (id: string) => void;
  onRelist: (list: ShoppingList) => void;
}

const priorityColors = {
  High: 'bg-blue-100',
  Medium: 'bg-yellow-100',
  Low: 'bg-green-100',
};

const ShoppingListCard: React.FC<ShoppingListCardProps> = ({ list, onEdit, onDuplicate, onDelete, onSelect, onRelist }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (buttonRef.current && buttonRef.current.contains(e.target as Node)) {
        return;
      }
      onSelect(list.id);
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return ''; // dateString is 'YYYY-MM-DD'
    // Split the string and create a new Date object. This interprets the date in the user's local timezone.
    const parts = dateString.split('-').map(Number);
    const displayDate = new Date(parts[0], parts[1] - 1, parts[2]);
    return displayDate.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  const cardClasses = list.isDone ? 'bg-gray-200 text-gray-500' : priorityColors[list.priority];
  const textClasses = list.isDone ? 'line-through' : '';

  return (
    <div className={`p-4 rounded-xl shadow-sm ${cardClasses} cursor-pointer`} onClick={handleCardClick}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className={`font-bold text-lg ${textClasses}`}>{list.name}</h3>
          {list.dueDate && <p className={`text-sm ${list.isDone ? 'text-gray-500' : 'text-gray-600'} ${textClasses}`}>{formatDate(list.dueDate)}</p>}
        </div>
        <div className="flex items-center gap-2">
            {list.isDone && <span className="text-sm font-semibold text-gray-600 bg-gray-300 px-2 py-0.5 rounded-md">Done</span>}
            <div className="relative" ref={menuRef}>
            <button ref={buttonRef} onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen);}} className="p-1 z-10 relative">
                <MoreHorizontalIcon className="h-5 w-5 text-gray-600" />
            </button>
            {menuOpen && (
                <div className="absolute right-0 mt-2 w-28 bg-white rounded-md shadow-lg z-20 border">
                <ul className="py-1">
                    {list.isDone ? (
                        <li>
                        <button onClick={(e) => { e.stopPropagation(); onRelist(list); setMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-semibold">
                            Re-list
                        </button>
                        </li>
                    ) : (
                        <>
                        <li>
                        <button onClick={(e) => { e.stopPropagation(); onEdit(list); setMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-semibold">
                            Edit
                        </button>
                        </li>
                        <li>
                        <button onClick={(e) => { e.stopPropagation(); onDuplicate(list); setMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-semibold">
                            Duplicate
                        </button>
                        </li>
                        </>
                    )}
                    <li>
                    <button onClick={(e) => { e.stopPropagation(); onDelete(); setMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 font-semibold">
                        Delete
                    </button>
                    </li>
                </ul>
                </div>
            )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingListCard;