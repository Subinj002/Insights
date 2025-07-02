export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  location: string;
  lastUpdated: Date;
  unitCost: number;
  supplier: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  status: 'pending' | 'processing' | 'picking' | 'packed' | 'shipped' | 'delivered';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  orderDate: Date;
  items: OrderItem[];
  totalValue: number;
}

export interface OrderItem {
  sku: string;
  name: string;
  quantity: number;
  pickedQuantity: number;
  unitPrice: number;
}

export interface WarehouseMetrics {
  totalOrders: number;
  ordersProcessed: number;
  ordersShipped: number;
  inventoryValue: number;
  lowStockItems: number;
  utilizationRate: number;
  pickingEfficiency: number;
  onTimeDelivery: number;
}

export interface LocationData {
  zone: string;
  aisle: string;
  rack: string;
  shelf: string;
  capacity: number;
  occupied: number;
  utilizationRate: number;
}