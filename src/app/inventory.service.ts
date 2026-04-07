import { Injectable } from '@angular/core';

export interface InventoryItem {
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

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private inventory: InventoryItem[] = [];

  constructor() {
    this.initializeInventory();
  }

  private initializeInventory(): void {
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
    this.inventory = sampleItems;
  }

  getInventory(): InventoryItem[] {
    return this.inventory;
  }

  addItem(item: InventoryItem): boolean {
    if (this.isIdUnique(item.id)) {
      this.inventory.push(item);
      return true;
    }
    return false;
  }

  updateItem(name: string, updatedItem: InventoryItem): boolean {
    const index = this.inventory.findIndex(item => item.name === name);
    if (index !== -1) {
      if (updatedItem.id === this.inventory[index].id || this.isIdUnique(updatedItem.id)) {
        this.inventory[index] = updatedItem;
        return true;
      }
    }
    return false;
  }

  deleteItem(name: string): boolean {
    const index = this.inventory.findIndex(item => item.name === name);
    if (index !== -1) {
      this.inventory.splice(index, 1);
      return true;
    }
    return false;
  }

  searchItems(searchTerm: string): InventoryItem[] {
    return this.inventory.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  getPopularItems(): InventoryItem[] {
    return this.inventory.filter(item => item.popularItem === 'Yes');
  }

  private isIdUnique(id: string, excludeId: string = ''): boolean {
    return !this.inventory.some(item => item.id === id && item.id !== excludeId);
  }

  getItemByName(name: string): InventoryItem | undefined {
    return this.inventory.find(item => item.name === name);
  }
}
