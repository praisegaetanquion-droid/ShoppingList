import React, { useState } from 'react';
import { ShoppingList, Priority } from '../types';
import ShoppingListCard from '../components/ShoppingListCard';
import ConfirmModal from '../components/modals/ConfirmModal';

interface ListScreenProps {
  lists: ShoppingList[];
  onCreateList: () => void;
  onEdit: (list: ShoppingList) => void;
  onDuplicate: (list: ShoppingList) => void;
  onDelete: (id: string) => void;
  onSelectList: (id: string) => void;
  onNavigateHome: () => void;
  onRelist: (list: ShoppingList) => void;
}

const ListScreen: React.FC<ListScreenProps> = ({ lists, onCreateList, onEdit, onDuplicate, onDelete, onSelectList, onNavigateHome, onRelist }) => {
  const [filter, setFilter] = useState<Priority | 'All'>('All');
  const [listToDelete, setListToDelete] = useState<ShoppingList | null>(null);

  const priorityOrder: Priority[] = ['High', 'Medium', 'Low'];
  
  const sortedLists = [...lists].sort((a, b) => {
    // 1. Done lists go to the bottom
    if (a.isDone !== b.isDone) {
      return a.isDone ? 1 : -1;
    }
    // 2. Sort by priority
    const priorityA = priorityOrder.indexOf(a.priority);
    const priorityB = priorityOrder.indexOf(b.priority);
    return priorityA - priorityB;
  });
  
  const filteredLists = sortedLists.filter(list => filter === 'All' || list.priority === filter);

  const handleDeleteRequest = (list: ShoppingList) => {
    setListToDelete(list);
  };

  const confirmDelete = () => {
    if (listToDelete) {
      onDelete(listToDelete.id);
      setListToDelete(null);
    }
  };

  const priorityFilters: (Priority | 'All')[] = ['All', 'High', 'Medium', 'Low'];
  
  const activeFilterStyles: { [key in Priority | 'All']: string } = {
    All: 'bg-rose-200 text-rose-800',
    High: 'bg-blue-200 text-blue-800',
    Medium: 'bg-yellow-200 text-yellow-800',
    Low: 'bg-green-200 text-green-800',
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <h1 className="text-4xl font-bold mb-6 cursor-pointer" onClick={onNavigateHome}>Shopping List</h1>
      <div className="flex space-x-2 mb-6">
        {priorityFilters.map(p => (
          <button
            key={p}
            onClick={() => setFilter(p)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors
              ${filter === p ? activeFilterStyles[p] : 'bg-gray-200 text-gray-700'}`}
          >
            {p}
          </button>
        ))}
      </div>
      <div className="flex-grow overflow-y-auto space-y-4">
        {filteredLists.map(list => (
          <ShoppingListCard
            key={list.id}
            list={list}
            onEdit={onEdit}
            onDuplicate={onDuplicate}
            onDelete={() => handleDeleteRequest(list)}
            onSelect={onSelectList}
            onRelist={onRelist}
          />
        ))}
      </div>
      <div className="mt-6">
        <button
          onClick={onCreateList}
          className="w-full bg-gradient-to-r from-pink-400 to-rose-400 text-white font-bold py-4 px-4 rounded-full"
        >
          Create List
        </button>
      </div>
      
      <ConfirmModal
        isOpen={!!listToDelete}
        type="delete"
        title="Are you sure?"
        message="Do you really want to delete this list? This process cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setListToDelete(null)}
      />
    </div>
  );
};

export default ListScreen;