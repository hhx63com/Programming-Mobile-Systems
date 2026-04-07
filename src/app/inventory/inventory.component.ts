import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InventoryService, InventoryItem } from '../inventory.service';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css'
})
export class InventoryComponent implements OnInit {
  inventory: InventoryItem[] = [];
  item: InventoryItem = {
    id: '',
    name: '',
    category: 'Electronics',
    quantity: 0,
    price: 0,
    supplier: '',
    stockStatus: 'In Stock',
    popularItem: 'No',
    comment: ''
  };
  deleteName: string = '';
  message: string = '';
  isError: boolean = false;

  constructor(private inventoryService: InventoryService) { }

  ngOnInit(): void {
    this.loadInventory();
  }

  loadInventory(): void {
    this.inventory = this.inventoryService.getInventory();
  }

  onSubmit(): void {
    if (this.validateInput()) {
      if (this.inventoryService.addItem({ ...this.item })) {
        this.showMessage('Item added successfully');
        this.resetForm();
        this.loadInventory();
      } else {
        this.showMessage('Item ID must be unique', true);
      }
    }
  }

  editItem(): void {
    if (!this.item.name) {
      this.showMessage('Item Name is required for editing', true);
      return;
    }

    if (this.validateInput()) {
      if (this.inventoryService.updateItem(this.item.name, { ...this.item })) {
        this.showMessage('Item updated successfully');
        this.resetForm();
        this.loadInventory();
      } else {
        this.showMessage('Item not found or ID already exists', true);
      }
    }
  }

  deleteItem(): void {
    if (!this.deleteName) {
      this.showMessage('Please enter item name to delete', true);
      return;
    }

    if (confirm(`Are you sure you want to delete ${this.deleteName}?`)) {
      if (this.inventoryService.deleteItem(this.deleteName)) {
        this.showMessage('Item deleted successfully');
        this.deleteName = '';
        this.loadInventory();
      } else {
        this.showMessage('Item not found', true);
      }
    }
  }

  resetForm(): void {
    this.item = {
      id: '',
      name: '',
      category: 'Electronics',
      quantity: 0,
      price: 0,
      supplier: '',
      stockStatus: 'In Stock',
      popularItem: 'No',
      comment: ''
    };
  }

  validateInput(): boolean {
    if (!this.item.id) {
      this.showMessage('Item ID is required', true);
      return false;
    }

    if (!this.item.name) {
      this.showMessage('Item Name is required', true);
      return false;
    }

    if (this.item.quantity < 0) {
      this.showMessage('Quantity must be a non-negative number', true);
      return false;
    }

    if (this.item.price < 0) {
      this.showMessage('Price must be a non-negative number', true);
      return false;
    }

    if (!this.item.supplier) {
      this.showMessage('Supplier Name is required', true);
      return false;
    }

    return true;
  }

  showMessage(message: string, isError: boolean = false): void {
    this.message = message;
    this.isError = isError;

    setTimeout(() => {
      this.message = '';
      this.isError = false;
    }, 3000);
  }
}
