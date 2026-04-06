// 定义数据模型接口
interface InventoryItem {
    id: string;
    name: string;
    category: string;
    quantity: number;
    price: number;
    supplier: string;
    stockStatus: string;
    popularItem: string;
    comment: string;
}

// 库存数据存储
let inventory: InventoryItem[] = [];

// DOM元素
const messageElement = document.getElementById('message') as HTMLElement;
const itemForm = document.getElementById('itemForm') as HTMLFormElement;
const itemIdInput = document.getElementById('itemId') as HTMLInputElement;
const itemNameInput = document.getElementById('itemName') as HTMLInputElement;
const categoryInput = document.getElementById('category') as HTMLSelectElement;
const quantityInput = document.getElementById('quantity') as HTMLInputElement;
const priceInput = document.getElementById('price') as HTMLInputElement;
const supplierInput = document.getElementById('supplier') as HTMLInputElement;
const stockStatusInput = document.getElementById('stockStatus') as HTMLSelectElement;
const popularItemInput = document.getElementById('popularItem') as HTMLSelectElement;
const commentInput = document.getElementById('comment') as HTMLTextAreaElement;
const addButton = document.getElementById('addButton') as HTMLButtonElement;
const editButton = document.getElementById('editButton') as HTMLButtonElement;
const searchInput = document.getElementById('searchInput') as HTMLInputElement;
const searchButton = document.getElementById('searchButton') as HTMLButtonElement;
const clearSearchButton = document.getElementById('clearSearch') as HTMLButtonElement;
const displayAllButton = document.getElementById('displayAll') as HTMLButtonElement;
const displayPopularButton = document.getElementById('displayPopular') as HTMLButtonElement;
const deleteInput = document.getElementById('deleteInput') as HTMLInputElement;
const deleteButton = document.getElementById('deleteButton') as HTMLButtonElement;
const tableBody = document.getElementById('tableBody') as HTMLElement;

// 显示消息函数
function showMessage(message: string, isError: boolean = false): void {
    messageElement.textContent = message;
    messageElement.className = isError ? 'message error' : 'message success';
    
    // 3秒后清除消息
    setTimeout(() => {
        messageElement.textContent = '';
        messageElement.className = 'message';
    }, 3000);
}

// 验证输入数据
function validateInput(): boolean {
    const id = itemIdInput.value.trim();
    const name = itemNameInput.value.trim();
    const quantity = parseInt(quantityInput.value);
    const price = parseFloat(priceInput.value);
    const supplier = supplierInput.value.trim();
    
    if (!id) {
        showMessage('Item ID is required', true);
        return false;
    }
    
    if (!name) {
        showMessage('Item Name is required', true);
        return false;
    }
    
    if (isNaN(quantity) || quantity < 0) {
        showMessage('Quantity must be a non-negative number', true);
        return false;
    }
    
    if (isNaN(price) || price < 0) {
        showMessage('Price must be a non-negative number', true);
        return false;
    }
    
    if (!supplier) {
        showMessage('Supplier Name is required', true);
        return false;
    }
    
    return true;
}

// 检查ID是否唯一
function isIdUnique(id: string, excludeId: string = ''): boolean {
    return !inventory.some(item => item.id === id && item.id !== excludeId);
}

// 添加新物品
function addItem(e: Event): void {
    e.preventDefault();
    
    if (!validateInput()) {
        return;
    }
    
    const id = itemIdInput.value.trim();
    
    if (!isIdUnique(id)) {
        showMessage('Item ID must be unique', true);
        return;
    }
    
    const newItem: InventoryItem = {
        id: id,
        name: itemNameInput.value.trim(),
        category: categoryInput.value,
        quantity: parseInt(quantityInput.value),
        price: parseFloat(priceInput.value),
        supplier: supplierInput.value.trim(),
        stockStatus: stockStatusInput.value,
        popularItem: popularItemInput.value,
        comment: commentInput.value.trim()
    };
    
    inventory.push(newItem);
    showMessage('Item added successfully');
    renderTable(inventory);
    itemForm.reset();
}

// 编辑物品
function editItem(): void {
    const name = itemNameInput.value.trim();
    
    if (!name) {
        showMessage('Item Name is required for editing', true);
        return;
    }
    
    const index = inventory.findIndex(item => item.name === name);
    
    if (index === -1) {
        showMessage('Item not found', true);
        return;
    }
    
    if (!validateInput()) {
        return;
    }
    
    const id = itemIdInput.value.trim();
    
    if (!isIdUnique(id, inventory[index].id)) {
        showMessage('Item ID must be unique', true);
        return;
    }
    
    inventory[index] = {
        id: id,
        name: name,
        category: categoryInput.value,
        quantity: parseInt(quantityInput.value),
        price: parseFloat(priceInput.value),
        supplier: supplierInput.value.trim(),
        stockStatus: stockStatusInput.value,
        popularItem: popularItemInput.value,
        comment: commentInput.value.trim()
    };
    
    showMessage('Item updated successfully');
    renderTable(inventory);
    itemForm.reset();
}

// 删除物品
function deleteItem(): void {
    const name = deleteInput.value.trim();
    
    if (!name) {
        showMessage('Please enter item name to delete', true);
        return;
    }
    
    const index = inventory.findIndex(item => item.name === name);
    
    if (index === -1) {
        showMessage('Item not found', true);
        return;
    }
    
    // 确认删除
    if (confirm(`Are you sure you want to delete ${name}?`)) {
        inventory.splice(index, 1);
        showMessage('Item deleted successfully');
        renderTable(inventory);
        deleteInput.value = '';
    }
}

// 搜索物品
function searchItems(): void {
    const searchTerm = searchInput.value.toLowerCase();
    
    if (!searchTerm) {
        showMessage('Please enter a search term', true);
        return;
    }
    
    const filteredItems = inventory.filter(item => 
        item.name.toLowerCase().includes(searchTerm)
    );
    
    if (filteredItems.length === 0) {
        showMessage('No items found', true);
    } else {
        showMessage(`Found ${filteredItems.length} item(s)`);
    }
    
    renderTable(filteredItems);
}

// 清除搜索
function clearSearch(): void {
    searchInput.value = '';
    renderTable(inventory);
    showMessage('Search cleared');
}

// 显示所有物品
function displayAllItems(): void {
    renderTable(inventory);
    showMessage('Displaying all items');
}

// 显示热门物品
function displayPopularItems(): void {
    const popularItems = inventory.filter(item => item.popularItem === 'Yes');
    
    if (popularItems.length === 0) {
        showMessage('No popular items found', true);
    } else {
        showMessage(`Found ${popularItems.length} popular item(s)`);
    }
    
    renderTable(popularItems);
}

// 渲染表格
function renderTable(items: InventoryItem[]): void {
    tableBody.innerHTML = '';
    
    items.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.category}</td>
            <td>${item.quantity}</td>
            <td>${item.price.toFixed(2)}</td>
            <td>${item.supplier}</td>
            <td>${item.stockStatus}</td>
            <td>${item.popularItem}</td>
            <td>${item.comment || '-'}</td>
        `;
        tableBody.appendChild(row);
    });
}

// 初始化事件监听器
function initEventListeners(): void {
    itemForm.addEventListener('submit', addItem);
    editButton.addEventListener('click', editItem);
    searchButton.addEventListener('click', searchItems);
    clearSearchButton.addEventListener('click', clearSearch);
    displayAllButton.addEventListener('click', displayAllItems);
    displayPopularButton.addEventListener('click', displayPopularItems);
    deleteButton.addEventListener('click', deleteItem);
}

// 初始化应用
function initApp(): void {
    // 添加一些示例数据
    const sampleItems: InventoryItem[] = [
        {
            id: '001',
            name: 'Laptop',
            category: 'Electronics',
            quantity: 10,
            price: 999.99,
            supplier: 'Tech Supplier',
            stockStatus: 'In Stock',
            popularItem: 'Yes',
            comment: 'High performance laptop'
        },
        {
            id: '002',
            name: 'Chair',
            category: 'Furniture',
            quantity: 5,
            price: 149.99,
            supplier: 'Furniture World',
            stockStatus: 'Low Stock',
            popularItem: 'No',
            comment: 'Ergonomic design'
        }
    ];
    
    inventory = sampleItems;
    renderTable(inventory);
    initEventListeners();
    showMessage('Inventory system initialized');
}

// 启动应用
initApp();