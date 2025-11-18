import React, { useState, useEffect } from "react";
import { ShoppingList, ShoppingItem } from "./types";
import HomeScreen from "./screens/HomeScreen";
import ListScreen from "./screens/ListScreen";
import CreateEditScreen from "./screens/CreateEditScreen";
import ItemScreen from "./screens/ItemScreen";

type Screen = "home" | "list" | "create" | "edit" | "items";

const App: React.FC = () => {
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [screen, setScreen] = useState<Screen>("home");
  const [activeListId, setActiveListId] = useState<string | null>(null);
  const [editingList, setEditingList] = useState<ShoppingList | null>(null);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [isRelisting, setIsRelisting] = useState(false);
  const [relistSourceId, setRelistSourceId] = useState<string | null>(null);

  useEffect(() => {
    const storedLists = localStorage.getItem("shoppingLists");
    if (storedLists) {
      const parsedLists = JSON.parse(storedLists);
      if (parsedLists.length > 0) {
        setLists(parsedLists);
        setScreen("list");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("shoppingLists", JSON.stringify(lists));
    if (lists.length === 0 && (screen === "list" || screen === "items")) {
      setScreen("home");
    }
  }, [lists, screen]);

  const navigateToHome = () => setScreen("home");

  const navigateToListScreen = () => {
    if (lists.length > 0) {
      setScreen("list");
    } else {
      setScreen("home");
    }
  };

  const handleCreateList = () => {
    setEditingList(null);
    setIsDuplicating(false);
    setIsRelisting(false);
    setScreen("create");
  };

  const handleEditList = (list: ShoppingList) => {
    setEditingList(list);
    setIsDuplicating(false);
    setIsRelisting(false);
    setScreen("edit");
  };

  const handleDuplicateList = (list: ShoppingList) => {
    const duplicatedItems = list.items.map(item => ({ ...item, purchased: false }));
    setEditingList({ ...list, id: crypto.randomUUID(), name: list.name, items: duplicatedItems, isDone: false });
    setIsDuplicating(true);
    setIsRelisting(false);
    setScreen("edit");
  };
  
  const handleRelist = (list: ShoppingList) => {
    const relistedItems = list.items.map(item => ({ ...item, purchased: false }));
    setEditingList({ ...list, id: crypto.randomUUID(), name: list.name, items: relistedItems, isDone: false });
    setIsRelisting(true);
    setRelistSourceId(list.id);
    setIsDuplicating(false);
    setScreen('edit');
  }

  const handleDeleteList = (id: string) => {
    setLists((prevLists) => prevLists.filter((list) => list.id !== id));
  };

  const handleSelectList = (listId: string) => {
    setActiveListId(listId);
    setScreen("items");
  };

  const handleSaveList = (listData: Omit<ShoppingList, "id" | "items" | "isDone">) => {
    if (editingList && !isDuplicating && !isRelisting) {
      // Update existing list
      setLists((prevLists) =>
        prevLists.map((list) =>
          list.id === editingList.id ? { ...list, ...listData } : list
        )
      );
    } else {
      // Create new, duplicated, or relisted list
      const newList: ShoppingList = {
        id: editingList?.id || crypto.randomUUID(),
        ...listData,
        items: editingList?.items || [],
        isDone: false, // A new, duplicated, or relisted list is never done from the start
      };
      setLists((prevLists) => {
        const listsWithoutSource = isRelisting && relistSourceId
          ? prevLists.filter(l => l.id !== relistSourceId)
          : prevLists;
        return [...listsWithoutSource, newList];
      });
    }
    setEditingList(null);
    setIsDuplicating(false);
    setIsRelisting(false);
    setRelistSourceId(null);
    setScreen("list");
  };

  const handleAddItem = (listId: string, itemName: string) => {
    const newItem: ShoppingItem = {
      id: crypto.randomUUID(),
      name: itemName,
      purchased: false,
    };
    setLists((prevLists) =>
      prevLists.map((list) =>
        list.id === listId
          ? { ...list, items: [...list.items, newItem], isDone: false }
          : list
      )
    );
  };

  const handleToggleItem = (listId: string, itemId: string) => {
    setLists((prevLists) =>
      prevLists.map((list) => {
        if (list.id !== listId) return list;

        const newItems = list.items.map((item) =>
          item.id === itemId ? { ...item, purchased: !item.purchased } : item
        );
        
        const allPurchased = newItems.length > 0 && newItems.every(item => item.purchased);

        return {
          ...list,
          items: newItems,
          isDone: allPurchased,
        };
      })
    );
  };
  
  const handleEditItem = (listId: string, itemId: string, newName: string) => {
      setLists(prevLists => prevLists.map(list => {
          if (list.id !== listId) return list;
          return {
              ...list,
              items: list.items.map(item =>
                  item.id === itemId ? { ...item, name: newName } : item
              )
          }
      }))
  }
  
  const handleDeleteItem = (listId: string, itemId: string) => {
      setLists(prevLists => prevLists.map(list => {
          if (list.id !== listId) return list;
          const newItems = list.items.filter(item => item.id !== itemId);
          const allPurchased = newItems.length > 0 && newItems.every(item => item.purchased);
          return {
              ...list,
              items: newItems,
              isDone: allPurchased,
          }
      }))
  }

  const renderScreen = () => {
    switch (screen) {
      case "home":
        return <HomeScreen onCreateList={handleCreateList} />;
      case "list":
        return (
          <ListScreen
            lists={lists}
            onCreateList={handleCreateList}
            onEdit={handleEditList}
            onDuplicate={handleDuplicateList}
            onDelete={handleDeleteList}
            onSelectList={handleSelectList}
            onNavigateHome={navigateToHome}
            onRelist={handleRelist}
          />
        );
      case "create":
      case "edit":
        return (
          <CreateEditScreen
            list={editingList}
            isDuplicating={isDuplicating}
            isRelisting={isRelisting}
            onSave={handleSaveList}
            onBack={navigateToListScreen}
            onNavigateHome={navigateToHome}
          />
        );
      case "items": {
        const activeList = lists.find((l) => l.id === activeListId);
        if (!activeList) {
          navigateToListScreen(); // Should not happen
          return null;
        }
        return (
          <ItemScreen
            key={activeList.id} // Add key to force re-mount on list change
            list={activeList}
            onBack={navigateToListScreen}
            onAddItem={handleAddItem}
            onToggleItem={handleToggleItem}
            onEditItem={handleEditItem}
            onDeleteItem={handleDeleteItem}
          />
        );
      }
      default:
        return <HomeScreen onCreateList={handleCreateList} />;
    }
  };

  return <div className="bg-white h-full w-full">{renderScreen()}</div>;
};

export default App;