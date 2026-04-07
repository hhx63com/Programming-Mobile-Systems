import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InventoryService, InventoryItem } from '../inventory.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {
  searchTerm: string = '';
  filteredItems: InventoryItem[] = [];
  allItems: InventoryItem[] = [];
  message: string = '';
  isError: boolean = false;

  constructor(private inventoryService: InventoryService) { }

  ngOnInit(): void {
    this.loadAllItems();
  }

  loadAllItems(): void {
    this.allItems = this.inventoryService.getInventory();
    this.filteredItems = [...this.allItems];
  }

  searchItems(): void {
    if (!this.searchTerm) {
      this.showMessage('Please enter a search term', true);
      return;
    }

    const results = this.inventoryService.searchItems(this.searchTerm);
    this.filteredItems = results;

    if (results.length === 0) {
      this.showMessage('No items found', true);
    } else {
      this.showMessage(`Found ${results.length} item(s)`);
    }
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filteredItems = [...this.allItems];
    this.showMessage('Search cleared');
  }

  displayAllItems(): void {
    this.filteredItems = [...this.allItems];
    this.showMessage('Displaying all items');
  }

  displayPopularItems(): void {
    const popularItems = this.inventoryService.getPopularItems();
    this.filteredItems = popularItems;

    if (popularItems.length === 0) {
      this.showMessage('No popular items found', true);
    } else {
      this.showMessage(`Found ${popularItems.length} popular item(s)`);
    }
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
