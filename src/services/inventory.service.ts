// Inventory Service
// Handles all inventory-related operations with real business logic

import { databaseService, QueryResult } from './database.service';

export interface InventoryItem {
  id: string;
  company_id: number;
  product_id: number;
  location_id: number;
  name: string;
  sku: string;
  category: string;
  current_stock: number;
  min_stock: number;
  max_stock: number;
  unit_price: number;
  cost_price?: number;
  supplier: string;
  location: string;
  last_updated: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'reorder';
}

export interface InventoryMovement {
  id: string;
  inventory_item_id: string;
  movement_type: 'in' | 'out' | 'adjustment' | 'transfer';
  quantity: number;
  reference_type?: string;
  reference_id?: string;
  notes?: string;
  created_by: number;
  created_at: string;
}

export interface StockAlert {
  id: string;
  inventory_item_id: string;
  alert_type: 'low_stock' | 'out_of_stock' | 'overstock';
  threshold: number;
  current_value: number;
  is_acknowledged: boolean;
  created_at: string;
}

class InventoryService {
  private readonly TABLE_INVENTORY = 'inventory_items';
  private readonly TABLE_MOVEMENTS = 'inventory_movements';
  private readonly TABLE_ALERTS = 'stock_alerts';

  constructor() {
    this.initializeMockData();
  }

  // Initialize with mock data for demo
  private async initializeMockData(): Promise<void> {
    const existingItems = await this.getAllItems();
    if (existingItems.data && existingItems.data.length === 0) {
      const mockItems: Partial<InventoryItem>[] = [
        {
          id: 'inv-001',
          company_id: 1,
          product_id: 1,
          location_id: 1,
          name: 'Wireless Bluetooth Headphones',
          sku: 'WBH-001',
          category: 'Electronics',
          current_stock: 45,
          min_stock: 10,
          max_stock: 100,
          unit_price: 89.99,
          cost_price: 45.00,
          supplier: 'TechSupply Co.',
          location: 'Warehouse A',
          last_updated: new Date().toISOString(),
          status: 'in-stock'
        },
        {
          id: 'inv-002',
          company_id: 1,
          product_id: 2,
          location_id: 1,
          name: 'Enterprise Software License',
          sku: 'ESL-002',
          category: 'Software',
          current_stock: 5,
          min_stock: 10,
          max_stock: 50,
          unit_price: 299.99,
          cost_price: 150.00,
          supplier: 'SoftwarePlus Inc.',
          location: 'Online',
          last_updated: new Date().toISOString(),
          status: 'low-stock'
        },
        {
          id: 'inv-003',
          company_id: 1,
          product_id: 3,
          location_id: 2,
          name: 'Professional Consulting Hours',
          sku: 'PCH-003',
          category: 'Services',
          current_stock: 0,
          min_stock: 5,
          max_stock: 100,
          unit_price: 150.00,
          cost_price: 75.00,
          supplier: 'Internal',
          location: 'Online',
          last_updated: new Date().toISOString(),
          status: 'out-of-stock'
        },
        {
          id: 'inv-004',
          company_id: 1,
          product_id: 4,
          location_id: 2,
          name: 'Gaming Laptop Pro',
          sku: 'GLP-004',
          category: 'Electronics',
          current_stock: 8,
          min_stock: 15,
          max_stock: 30,
          unit_price: 1299.99,
          cost_price: 800.00,
          supplier: 'TechWorld Ltd.',
          location: 'Warehouse B',
          last_updated: new Date().toISOString(),
          status: 'reorder'
        },
        {
          id: 'inv-005',
          company_id: 1,
          product_id: 5,
          location_id: 3,
          name: 'USB-C Hub',
          sku: 'UCH-005',
          category: 'Accessories',
          current_stock: 25,
          min_stock: 20,
          max_stock: 80,
          unit_price: 49.99,
          cost_price: 25.00,
          supplier: 'AccessoryWorld',
          location: 'Store Front',
          last_updated: new Date().toISOString(),
          status: 'in-stock'
        }
      ];

      await databaseService.bulkCreate(this.TABLE_INVENTORY, mockItems);
    }
  }

  // Get all inventory items with filtering
  async getAllItems(filters?: {
    category?: string;
    status?: string;
    location?: string;
    search?: string;
  }): Promise<QueryResult<InventoryItem[]>> {
    try {
      const queryFilters: any = {};

      if (filters?.category && filters.category !== 'all') {
        queryFilters.category = filters.category;
      }

      if (filters?.status && filters.status !== 'all') {
        queryFilters.status = filters.status;
      }

      if (filters?.location && filters.location !== 'all') {
        queryFilters.location = filters.location;
      }

      const result = await databaseService.findMany<InventoryItem>(this.TABLE_INVENTORY, {
        filters: queryFilters
      });

      if (result.success && result.data) {
        // Apply search filter if provided
        if (filters?.search) {
          const searchTerm = filters.search.toLowerCase();
          result.data = result.data.filter(item =>
            item.name.toLowerCase().includes(searchTerm) ||
            item.sku.toLowerCase().includes(searchTerm) ||
            item.supplier.toLowerCase().includes(searchTerm)
          );
        }

        // Update status based on current stock
        result.data = result.data.map(item => ({
          ...item,
          status: this.calculateStatus(item)
        }));
      }

      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch inventory items'
      };
    }
  }

  // Get single inventory item
  async getItemById(id: string): Promise<QueryResult<InventoryItem>> {
    try {
      const result = await databaseService.findById<InventoryItem>(this.TABLE_INVENTORY, id);
      
      if (result.success && result.data) {
        result.data.status = this.calculateStatus(result.data);
      }

      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch inventory item'
      };
    }
  }

  // Update stock quantity
  async updateStock(
    itemId: string, 
    newQuantity: number, 
    movementType: 'in' | 'out' | 'adjustment' = 'adjustment',
    notes?: string,
    userId: number = 1
  ): Promise<QueryResult<InventoryItem>> {
    try {
      // Get current item
      const currentItem = await this.getItemById(itemId);
      if (!currentItem.success || !currentItem.data) {
        return {
          success: false,
          error: 'Inventory item not found'
        };
      }

      const oldQuantity = currentItem.data.current_stock;
      const quantityDifference = newQuantity - oldQuantity;

      // Update the inventory item
      const updateResult = await databaseService.update<InventoryItem>(
        this.TABLE_INVENTORY,
        itemId,
        {
          current_stock: newQuantity,
          last_updated: new Date().toISOString(),
          status: this.calculateStatus({ ...currentItem.data, current_stock: newQuantity })
        }
      );

      if (updateResult.success) {
        // Record the movement
        await this.recordMovement({
          inventory_item_id: itemId,
          movement_type: movementType,
          quantity: Math.abs(quantityDifference),
          notes: notes || `Stock ${movementType} - ${oldQuantity} → ${newQuantity}`,
          created_by: userId
        });

        // Check for alerts
        await this.checkStockAlerts(itemId);
      }

      return updateResult;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update stock'
      };
    }
  }

  // Record inventory movement
  async recordMovement(movement: Omit<InventoryMovement, 'id' | 'created_at'>): Promise<QueryResult<InventoryMovement>> {
    try {
      const movementRecord: Partial<InventoryMovement> = {
        ...movement,
        id: `mov-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        created_at: new Date().toISOString()
      };

      return await databaseService.create<InventoryMovement>(this.TABLE_MOVEMENTS, movementRecord);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to record movement'
      };
    }
  }

  // Get movement history for an item
  async getMovementHistory(itemId: string): Promise<QueryResult<InventoryMovement[]>> {
    try {
      return await databaseService.findMany<InventoryMovement>(this.TABLE_MOVEMENTS, {
        filters: { inventory_item_id: itemId },
        pagination: { page: 1, limit: 100, sortBy: 'created_at', sortOrder: 'DESC' }
      });
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch movement history'
      };
    }
  }

  // Get low stock alerts
  async getLowStockAlerts(): Promise<QueryResult<InventoryItem[]>> {
    try {
      const allItems = await this.getAllItems();
      if (!allItems.success || !allItems.data) {
        return allItems;
      }

      const lowStockItems = allItems.data.filter(item => 
        item.status === 'low-stock' || item.status === 'out-of-stock'
      );

      return {
        success: true,
        data: lowStockItems,
        rowCount: lowStockItems.length
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch low stock alerts'
      };
    }
  }

  // Calculate inventory value
  async calculateInventoryValue(): Promise<QueryResult<{
    totalValue: number;
    totalCost: number;
    totalItems: number;
    valueByCategory: { [category: string]: number };
  }>> {
    try {
      const allItems = await this.getAllItems();
      if (!allItems.success || !allItems.data) {
        return {
          success: false,
          error: 'Failed to fetch inventory items'
        };
      }

      const items = allItems.data;
      let totalValue = 0;
      let totalCost = 0;
      let totalItems = 0;
      const valueByCategory: { [category: string]: number } = {};

      items.forEach(item => {
        const itemValue = item.current_stock * item.unit_price;
        const itemCost = item.current_stock * (item.cost_price || 0);

        totalValue += itemValue;
        totalCost += itemCost;
        totalItems += item.current_stock;

        if (!valueByCategory[item.category]) {
          valueByCategory[item.category] = 0;
        }
        valueByCategory[item.category] += itemValue;
      });

      return {
        success: true,
        data: {
          totalValue,
          totalCost,
          totalItems,
          valueByCategory
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to calculate inventory value'
      };
    }
  }

  // Generate reorder suggestions
  async getReorderSuggestions(): Promise<QueryResult<InventoryItem[]>> {
    try {
      const allItems = await this.getAllItems();
      if (!allItems.success || !allItems.data) {
        return allItems;
      }

      const reorderItems = allItems.data.filter(item => 
        item.current_stock <= item.min_stock && item.status !== 'out-of-stock'
      );

      return {
        success: true,
        data: reorderItems,
        rowCount: reorderItems.length
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate reorder suggestions'
      };
    }
  }

  // Private helper methods
  private calculateStatus(item: InventoryItem): 'in-stock' | 'low-stock' | 'out-of-stock' | 'reorder' {
    if (item.current_stock === 0) {
      return 'out-of-stock';
    } else if (item.current_stock < item.min_stock) {
      return 'low-stock';
    } else if (item.current_stock <= item.min_stock * 1.2) {
      return 'reorder';
    } else {
      return 'in-stock';
    }
  }

  private async checkStockAlerts(itemId: string): Promise<void> {
    try {
      const item = await this.getItemById(itemId);
      if (!item.success || !item.data) return;

      const stockItem = item.data;
      
      // Create alert if stock is low or out
      if (stockItem.status === 'low-stock' || stockItem.status === 'out-of-stock') {
        const alert: Partial<StockAlert> = {
          id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          inventory_item_id: itemId,
          alert_type: stockItem.status === 'out-of-stock' ? 'out_of_stock' : 'low_stock',
          threshold: stockItem.min_stock,
          current_value: stockItem.current_stock,
          is_acknowledged: false,
          created_at: new Date().toISOString()
        };

        await databaseService.create(this.TABLE_ALERTS, alert);
      }
    } catch (error) {
      console.error('Failed to check stock alerts:', error);
    }
  }

  // Bulk stock update
  async bulkUpdateStock(updates: Array<{
    itemId: string;
    newQuantity: number;
    notes?: string;
  }>, userId: number = 1): Promise<QueryResult<InventoryItem[]>> {
    try {
      const results: InventoryItem[] = [];
      
      for (const update of updates) {
        const result = await this.updateStock(
          update.itemId,
          update.newQuantity,
          'adjustment',
          update.notes,
          userId
        );
        
        if (result.success && result.data) {
          results.push(result.data);
        }
      }

      return {
        success: true,
        data: results,
        rowCount: results.length
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to bulk update stock'
      };
    }
  }
}

// Export singleton instance
export const inventoryService = new InventoryService();
export default InventoryService;
