import React from 'react';
import { ShoppingCartIcon } from '../components/icons/ShoppingCartIcon';

interface HomeScreenProps {
  onCreateList: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onCreateList }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <div className="w-32 h-32 bg-rose-100 rounded-full flex items-center justify-center mb-8">
        <ShoppingCartIcon className="w-16 h-16 text-rose-400" />
      </div>
      <h1 className="text-4xl font-bold mb-2">Shopping List</h1>
      <p className="text-lg text-gray-600 mb-2">Your List is Empty</p>
      <p className="text-gray-500 mb-12">
        Create a list and add items to your trolley for an easier shopping experience
      </p>
      <button
        onClick={onCreateList}
        className="w-full max-w-sm bg-gradient-to-r from-pink-400 to-rose-400 text-white font-bold py-4 px-4 rounded-full"
      >
        Create List
      </button>
    </div>
  );
};

export default HomeScreen;
