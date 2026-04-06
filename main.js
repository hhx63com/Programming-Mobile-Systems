// =====================================================
// PROG2005 Assignment 2 – Part 1 (TypeScript Inventory App)
// Author: [Your Name]
// Date: March 2026
// Description: Fully type-safe inventory management without alert/confirm
// =====================================================

interface InventoryItem {
    id: string;          // Unique
    name: string;
    category: 'Electronics' | 'Furniture' | 'Clothing' | 'Tools' | 'Miscellaneous';
    quantity: number;
    price: number;
    supplier: string;
    stockStatus: 'In Stock' | 'Low Stock' | 'Out of Stock';
    popularItem: 'Yes' | 'No';
    comment?: string;
}

// App state
let inventory: InventoryItem[] = [
    {
        id: "INV-001",
        name: "Gaming Laptop",
        category: "Electronics",
        quantity: 12,
        price: 1299.99,
        supplier: "TechDistro",
        stockStatus: "In Stock",
        popularItem: "Yes",
        comment: "High demand"
    },
    {
        id: "INV-002",
        name: "Office Desk",
        category: "Furniture",
        quantity: 3,
        price: 245.50,
        supplier: "FurnitureWorld",
        stockStatus: "Low Stock",
        popularItem: "No",
        comment: ""
    }
];

// DOM elements
let messageDiv: HTMLElement;
let inventoryTableDiv: HTMLElement;
let form: HTMLFormElement;
let submitBtn: HTMLButtonElement;
let cancelEditBtn: HTMLButtonElement;
let formTitle: HTMLElement;

// Editing state
let editMode = false;
let editOriginalName = "";

// Custom confirm resolver
let confirmResolver: ((value: boolean) => void) | null = null;

// Helper: Show message
function showMessage(msg: string, isError = false): void {
    if (!messageDiv) return;
    messageDiv.innerHTML = msg;
    messageDiv.style.background = isError ? "#ffe6e6" : "#e6ffed";
    messageDiv.style.borderLeftColor = isError ? "#c72a2a" : "#2c6e9e";
    setTimeout(() => {
        if (messageDiv.innerHTML === msg) messageDiv.innerHTML = "✓ Ready";
    }, 3000);
}

// Render table
function renderTable(items: InventoryItem[]): void {
    if (!inventoryTableDiv) return;
    if (items.length === 0) {
        inventoryTableDiv.innerHTML = "<p style='padding: 20px; text-align:center;'>📭 No items found.</p>";
        return;
    }
    let html = `<table><thead><tr>
        <th>ID</th><th>Name</th><th>Category</th><th>Qty</th><th>Price</th>
        <th>Supplier</th><th>Stock</th><th>Popular</th><th>Comment</th><th>Actions</th>
    </tr></thead><tbody>`;
    items.forEach(item => {
        html += `<tr>
            <td>${escapeHtml(item.id)}</td>
            <td>${escapeHtml(item.name)}</td>
            <td>${item.category}</td>
            <td>${item.quantity}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>${escapeHtml(item.supplier)}</td>
            <td>${item.stockStatus}</td>
            <td>${item.popularItem}</td>
            <td>${escapeHtml(item.comment || '')}</td>
            <td><button class="small edit-btn" data-name="${escapeHtml(item.name)}">✏️ Edit</button>
            <button class="small delete-btn" data-name="${escapeHtml(item.name)}">🗑️ Delete</button></td>
        </tr>`;
    });
    html += `</tbody></table>`;
    inventoryTableDiv.innerHTML = html;

    // Attach edit/delete events
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const name = (btn as HTMLElement).getAttribute('data-name');
            if (name) startEditByName(name);
        });
    });
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const name = (btn as HTMLElement).getAttribute('data-name');
            if (name) requestDeleteConfirm(name);
        });
    });
}

function escapeHtml(str: string): string {
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// Custom confirm modal
function showConfirm(message: string): Promise<boolean> {
    const modal = document.getElementById('customConfirm') as HTMLElement;
    const msgP = document.getElementById('confirmMessage') as HTMLElement;
    msgP.innerText = message;
    modal.classList.remove('hidden');
    return new Promise((resolve) => {
        confirmResolver = resolve;
    });
}

function closeConfirm(): void {
    const modal = document.getElementById('customConfirm');
    if (modal) modal.classList.add('hidden');
    confirmResolver = null;
}

// Delete with custom confirm
function requestDeleteConfirm(itemName: string): void {
    showConfirm(`Are you sure you want to delete item "${itemName}"?`).then(confirmed => {
        if (confirmed) {
            const index = inventory.findIndex(i => i.name === itemName);
            if (index !== -1) {
                inventory.splice(index, 1);
                renderTable(inventory);
                showMessage(`✅ Deleted "${itemName}" successfully.`);
            } else {
                showMessage(`Item "${itemName}" not found.`, true);
            }
        } else {
            showMessage(`Deletion cancelled.`);
        }
        closeConfirm();
    });
}

// Start edit by name (populate form)
function startEditByName(name: string): void {
    const item = inventory.find(i => i.name === name);
    if (!item) {
        showMessage("Item not found for editing", true);
        return;
    }
    editMode = true;
    editOriginalName = item.name;
    formTitle.innerText = "✏️ Edit Item";
    submitBtn.innerText = "💾 Update Item";
    cancelEditBtn.style.display = "inline-block";

    // Fill form
    (document.getElementById('itemId') as HTMLInputElement).value = item.id;
    (document.getElementById('itemName') as HTMLInputElement).value = item.name;
    (document.getElementById('category') as HTMLSelectElement).value = item.category;
    (document.getElementById('quantity') as HTMLInputElement).value = item.quantity.toString();
    (document.getElementById('price') as HTMLInputElement).value = item.price.toString();
    (document.getElementById('supplier') as HTMLInputElement).value = item.supplier;
    (document.getElementById('stockStatus') as HTMLSelectElement).value = item.stockStatus;
    (document.getElementById('popularItem') as HTMLSelectElement).value = item.popularItem;
    (document.getElementById('comment') as HTMLTextAreaElement).value = item.comment || "";
    // Disable ID field during edit (unique immutable)
    (document.getElementById('itemId') as HTMLInputElement).disabled = true;
}

function cancelEdit(): void {
    resetForm();
    editMode = false;
    editOriginalName = "";
    formTitle.innerText = "➕ Add New Item";
    submitBtn.innerText = "➕ Add Item";
    cancelEditBtn.style.display = "none";
    (document.getElementById('itemId') as HTMLInputElement).disabled = false;
    showMessage("Edit cancelled.");
}

function resetForm(): void {
    (document.getElementById('itemForm') as HTMLFormElement).reset();
    (document.getElementById('itemId') as HTMLInputElement).disabled = false;
}

// Add or Update
function handleSubmit(e: Event): void {
    e.preventDefault();
    const idInput = document.getElementById('itemId') as HTMLInputElement;
    const nameInput = document.getElementById('itemName') as HTMLInputElement;
    const category = (document.getElementById('category') as HTMLSelectElement).value as InventoryItem['category'];
    const quantity = parseInt((document.getElementById('quantity') as HTMLInputElement).value);
    const price = parseFloat((document.getElementById('price') as HTMLInputElement).value);
    const supplier = (document.getElementById('supplier') as HTMLInputElement).value.trim();
    const stockStatus = (document.getElementById('stockStatus') as HTMLSelectElement).value as InventoryItem['stockStatus'];
    const popularItem = (document.getElementById('popularItem') as HTMLSelectElement).value as InventoryItem['popularItem'];
    const comment = (document.getElementById('comment') as HTMLTextAreaElement).value;

    // Validation
    if (!idInput.value.trim() || !nameInput.value.trim() || !supplier) {
        showMessage("ID, Name, Supplier are required.", true); return;
    }
    if (isNaN(quantity) || quantity < 0) { showMessage("Quantity must be >=0", true); return; }
    if (isNaN(price) || price < 0) { showMessage("Price must be >=0", true); return; }

    if (!editMode) {
        // Add: ID must be unique
        if (inventory.some(i => i.id === idInput.value.trim())) {
            showMessage("Item ID must be unique!", true); return;
        }
        const newItem: InventoryItem = {
            id: idInput.value.trim(),
            name: nameInput.value.trim(),
            category,
            quantity,
            price,
            supplier,
            stockStatus,
            popularItem,
            comment: comment || undefined
        };
        inventory.push(newItem);
        showMessage(`Added "${newItem.name}" successfully.`);
    } else {
        // Edit: ensure name doesn't conflict with other items (except itself)
        const newName = nameInput.value.trim();
        if (newName !== editOriginalName && inventory.some(i => i.name === newName)) {
            showMessage("Another item already has this name. Choose unique name.", true); return;
        }
        const targetIndex = inventory.findIndex(i => i.name === editOriginalName);
        if (targetIndex !== -1) {
            inventory[targetIndex] = {
                ...inventory[targetIndex],
                id: idInput.value.trim(),
                name: newName,
                category,
                quantity,
                price,
                supplier,
                stockStatus,
                popularItem,
                comment: comment || undefined
            };
            showMessage(`Updated "${editOriginalName}" → "${newName}".`);
        } else {
            showMessage("Original item lost during edit", true);
        }
        cancelEdit(); // exit edit mode
    }
    renderTable(inventory);
    if (!editMode) resetForm();
}

// Search and display
function searchItems(): void {
    const query = (document.getElementById('searchInput') as HTMLInputElement).value.trim().toLowerCase();
    if (!query) {
        renderTable(inventory);
        showMessage("Showing all items.");
        return;
    }
    const filtered = inventory.filter(i => i.name.toLowerCase().includes(query));
    renderTable(filtered);
    showMessage(`🔍 Found ${filtered.length} item(s) matching "${query}".`);
}

function showAll(): void {
    (document.getElementById('searchInput') as HTMLInputElement).value = "";
    renderTable(inventory);
    showMessage("Displaying all inventory items.");
}

function showPopularOnly(): void {
    const popular = inventory.filter(i => i.popularItem === "Yes");
    renderTable(popular);
    showMessage(`⭐ Showing ${popular.length} popular items.`);
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    messageDiv = document.getElementById('messageArea')!;
    inventoryTableDiv = document.getElementById('inventoryTable')!;
    form = document.getElementById('itemForm') as HTMLFormElement;
    submitBtn = document.getElementById('submitBtn') as HTMLButtonElement;
    cancelEditBtn = document.getElementById('cancelEditBtn') as HTMLButtonElement;
    formTitle = document.getElementById('formTitle')!;

    form.addEventListener('submit', handleSubmit);
    cancelEditBtn.addEventListener('click', cancelEdit);
    document.getElementById('searchBtn')!.addEventListener('click', searchItems);
    document.getElementById('resetSearchBtn')!.addEventListener('click', showAll);
    document.getElementById('showAllBtn')!.addEventListener('click', showAll);
    document.getElementById('showPopularBtn')!.addEventListener('click', showPopularOnly);

    // Custom confirm buttons
    document.getElementById('confirmYesBtn')!.addEventListener('click', () => {
        if (confirmResolver) confirmResolver(true);
        closeConfirm();
    });
    document.getElementById('confirmNoBtn')!.addEventListener('click', () => {
        if (confirmResolver) confirmResolver(false);
        closeConfirm();
    });

    // Initial render
    renderTable(inventory);
    showMessage("Welcome! Add or manage inventory.");
    cancelEditBtn.style.display = "none";
});