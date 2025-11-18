export type Priority = "High" | "Medium" | "Low";

export interface ShoppingItem {
  id: string;
  name: string;
  purchased: boolean;
}

export interface ShoppingList {
  id: string;
  name: string;
  dueDate: string | null;
  priority: Priority;
  items: ShoppingItem[];
  isDone: boolean;
}
