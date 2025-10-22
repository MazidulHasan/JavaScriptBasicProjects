// storage.js
// Helper functions to work with localStorage for the grocery list

const Storage = (function () {
  const KEY = "groceryListItems";

  function getItems() {
    const raw = localStorage.getItem(KEY);
    try {
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      // If parsing fails, reset storage
      console.error("Error parsing localStorage:", e);
      localStorage.removeItem(KEY);
      return [];
    }
  }

  function saveItems(items) {
    localStorage.setItem(KEY, JSON.stringify(items));
  }

  function addItem(item) {
    const items = getItems();
    items.push(item);
    saveItems(items);
  }

  function updateItems(items) {
    saveItems(items);
  }

  function clearAll() {
    localStorage.removeItem(KEY);
  }

  return {
    getItems,
    addItem,
    updateItems,
    clearAll,
  };
})();
