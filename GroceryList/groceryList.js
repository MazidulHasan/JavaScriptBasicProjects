// groceryList.js
// Full CRUD logic for Grocery Bud app
// Uses DOMContentLoaded, new Date(), createAttribute, setAttributeNode, appendChild, filter, map

// DOM elements
const form = document.querySelector(".grocery-form");
const groceryInput = document.querySelector("#grocery");
const submitBtn = document.querySelector(".submit-btn");
const alertBox = document.querySelector(".alert");
const listContainer = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");

// app state
let items = []; // array of { id, value, createdAt }
let editId = null;

// ---------- Helpers ----------
function showAlert(message, type = "success") {
  alertBox.textContent = message;
  alertBox.className = `alert alert-${type}`; // ✅ updated line
  setTimeout(() => {
    alertBox.textContent = "";
    alertBox.className = "alert";
  }, 2000);
}


function createDataIdAttribute(id) {
  // Demonstrate createAttribute & setAttributeNode (less common than setAttribute)
  const attr = document.createAttribute("data-id");
  attr.value = id;
  return attr;
}

function clearInput() {
  groceryInput.value = "";
  editId = null;
  submitBtn.textContent = "submit";
}

// ---------- Rendering ----------
function render() {
  listContainer.innerHTML = "";

  if (items.length === 0) {
    document.querySelector(".grocery-container").classList.remove("show-container");
    return;
  }

  document.querySelector(".grocery-container").classList.add("show-container");

  items.forEach((item) => {
    const article = document.createElement("article");
    article.classList.add("grocery-item");
    const dataIdAttr = createDataIdAttribute(item.id);
    article.setAttributeNode(dataIdAttr);

    const p = document.createElement("p");
    p.classList.add("title");
    p.textContent = item.value;

    const btnContainer = document.createElement("div");
    btnContainer.classList.add("btn-container");

    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-btn");
    editBtn.innerHTML = '<i class="fas fa-edit"></i>';

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';

    btnContainer.appendChild(editBtn);
    btnContainer.appendChild(deleteBtn);
    article.appendChild(p);
    article.appendChild(btnContainer);
    listContainer.appendChild(article);
  });
}


// ---------- CRUD operations ----------

function handleAddItem(value) {
  const newItem = {
    id: String(new Date().getTime()), // unique id using new Date()
    value: value.trim(),
    createdAt: new Date().toISOString(),
  };
  items.push(newItem);
  Storage.addItem(newItem);
  render();
  showAlert("Item added", "success");
  clearInput();
}

function handleDeleteItem(id) {
  // use filter to remove
  items = items.filter((it) => it.id !== id);
  Storage.updateItems(items);
  render();
  showAlert("Item removed", "danger");
}

function handleEditInit(id) {
  const item = items.find((it) => it.id === id);
  if (!item) return;
  groceryInput.value = item.value;
  editId = id;
  submitBtn.textContent = "edit";
  groceryInput.focus();
}

function handleEditSave(id, newValue) {
  // use map to update the correct item (returns a new array)
  items = items.map((it) => {
    if (it.id === id) {
      return {
        ...it,
        value: newValue.trim(),
        // optionally update lastEdited:
        lastEditedAt: new Date().toISOString(),
      };
    }
    return it;
  });
  Storage.updateItems(items);
  render();
  showAlert("Item updated", "success");
  clearInput();
}

function handleClearAll() {
  items = [];
  Storage.clearAll();
  render();
  showAlert("All items cleared", "danger");
}

// ---------- Event listeners ----------

// On DOM ready, load items & render
window.addEventListener("DOMContentLoaded", () => {
  items = Storage.getItems();
  render();
});

// Form submit - create or save edit
form.addEventListener("submit", function (e) {
  e.preventDefault();
  const value = groceryInput.value;
  if (!value) {
    showAlert("Please enter a value", "danger");
    return;
  }

  if (!editId) {
    // create
    handleAddItem(value);
  } else {
    // save edits
    handleEditSave(editId, value);
  }
});

// Event delegation for edit & delete
listContainer.addEventListener("click", function (e) {
  const target = e.target;
  // find the nearest grocery-item ancestor to read data-id
  const article = target.closest(".grocery-item");
  if (!article) return;
  const id = article.getAttribute("data-id");

  if (target.closest(".edit-btn")) {
    handleEditInit(id);
  } else if (target.closest(".delete-btn")) {
    handleDeleteItem(id);
  }
});

// clear-all button
clearBtn.addEventListener("click", function () {
  handleClearAll();
});
