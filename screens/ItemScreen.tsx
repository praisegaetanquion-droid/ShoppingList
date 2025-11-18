import React, { useState, useRef, useEffect } from 'react';
import { ShoppingList, ShoppingItem } from '../types';
import { BackIcon, MoreHorizontalIcon } from '../components/icons';
import { ShoppingBagIcon } from '../components/icons/ShoppingBagIcon';
import ConfirmModal from '../components/modals/ConfirmModal';

interface ItemScreenProps {
  list: ShoppingList;
  onBack: () => void;
  onAddItem: (listId: string, itemName: string) => void;
  onToggleItem: (listId: string, itemId: string) => void;
  onEditItem: (listId: string, itemId: string, newName: string) => void;
  onDeleteItem: (listId: string, itemId: string) => void;
}

const ItemScreen: React.FC<ItemScreenProps> = ({ list, onBack, onAddItem, onToggleItem, onEditItem, onDeleteItem }) => {
  const [newItemName, setNewItemName] = useState('');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingItemName, setEditingItemName] = useState('');
  const [itemToDelete, setItemToDelete] = useState<ShoppingItem | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemName.trim()) {
      onAddItem(list.id, newItemName.trim());
      setNewItemName('');
    }
  };
  
  const handleEditClick = (item: ShoppingItem) => {
      setEditingItemId(item.id);
      setEditingItemName(item.name);
      setOpenMenuId(null);
  }
  
  const handleSaveEdit = () => {
      if (editingItemId && editingItemName.trim()) {
          onEditItem(list.id, editingItemId, editingItemName.trim());
          setEditingItemId(null);
          setEditingItemName('');
      }
  }
  
  const handleDeleteRequest = (item: ShoppingItem) => {
      setItemToDelete(item);
      setOpenMenuId(null);
  }
  
  const confirmDeleteItem = () => {
      if(itemToDelete) {
          onDeleteItem(list.id, itemToDelete.id);
          setItemToDelete(null);
      }
  }

  const EmptyState = () => (
    <div className="flex-grow flex flex-col items-center justify-center text-center p-8">
      <div className="w-32 h-32 bg-rose-100 rounded-full flex items-center justify-center mb-8">
        <ShoppingBagIcon className="w-16 h-16 text-rose-400" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Your List is Empty</h2>
      <p className="text-gray-500">Add items to your shopping list</p>
    </div>
  );
  
  const ItemList = ({ items }: { items: ShoppingItem[] }) => (
    <div className="flex-grow overflow-y-auto px-6 py-4">
        <ul className="space-y-3">
            {items.map(item => (
                <li key={item.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                    {editingItemId === item.id ? (
                        <div className="flex-grow flex items-center gap-2">
                            <input
                                type="text"
                                value={editingItemName}
                                onChange={e => setEditingItemName(e.target.value)}
                                onBlur={handleSaveEdit}
                                onKeyDown={e => e.key === 'Enter' && handleSaveEdit()}
                                autoFocus
                                className="flex-grow p-2 bg-white border border-rose-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
                            />
                            <button onClick={handleSaveEdit} className="bg-rose-500 text-white font-semibold px-4 py-2 rounded-lg">Save</button>
                        </div>
                    ) : (
                        <>
                        <div className="flex items-center">
                            <input 
                                type="checkbox"
                                id={`item-${item.id}`}
                                checked={item.purchased}
                                onChange={() => onToggleItem(list.id, item.id)}
                                className="h-6 w-6 rounded-md border-gray-300 text-rose-400 focus:ring-rose-400 cursor-pointer"
                            />
                            <label 
                                htmlFor={`item-${item.id}`} 
                                className={`ml-3 text-lg text-gray-800 cursor-pointer ${item.purchased ? 'line-through text-gray-400' : ''}`}
                            >
                                {item.name}
                            </label>
                        </div>
                        <div className="relative">
                            <button onClick={() => setOpenMenuId(item.id === openMenuId ? null : item.id)} className="p-1">
                                <MoreHorizontalIcon className="w-5 h-5 text-gray-500" />
                            </button>
                            {openMenuId === item.id && (
                                <div ref={menuRef} className="absolute right-0 mt-2 w-28 bg-white rounded-md shadow-lg z-20 border">
                                    <ul className="py-1">
                                        <li><button onClick={() => handleEditClick(item)} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-semibold">Edit</button></li>
                                        <li><button onClick={() => handleDeleteRequest(item)} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 font-semibold">Delete</button></li>
                                    </ul>
                                </div>
                            )}
                        </div>
                        </>
                    )}
                </li>
            ))}
        </ul>
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      <header className="flex items-center p-4 border-b">
        <button onClick={onBack} className="p-2">
          <BackIcon className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-bold ml-2">{list.name}</h1>
      </header>

      {list.items.length === 0 ? <EmptyState /> : <ItemList items={list.items} />}

      <form onSubmit={handleAddItem} className="p-4 border-t bg-white flex items-center gap-3">
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="Add new item..."
          className="flex-grow w-full p-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
        />
        <button type="submit" className="bg-rose-200 text-rose-800 rounded-lg p-3 flex-shrink-0 disabled:opacity-50" disabled={!newItemName.trim()}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
        </button>
      </form>
      
      <ConfirmModal
        isOpen={!!itemToDelete}
        type="delete"
        title="Delete Item?"
        message="Are you sure you want to delete this item? This cannot be undone."
        onConfirm={confirmDeleteItem}
        onCancel={() => setItemToDelete(null)}
      />
    </div>
  );
};

export default ItemScreen;