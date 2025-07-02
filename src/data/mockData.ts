import { InventoryItem, Order, WarehouseMetrics, LocationData } from '../types/wms';

export const mockInventory: InventoryItem[] = [
  {
    id: '1',
    sku: 'WDG-001',
    name: 'Premium Widget A',
    category: 'Widgets',
    currentStock: 450,
    minStock: 100,
    maxStock: 1000,
    location: 'A-01-R1-S3',
    lastUpdated: new Date('2025-01-15T10:30:00'),
    unitCost: 12.50,
    supplier: 'TechCorp Industries'
  },
  {
    id: '2',
    sku: 'GDG-002',
    name: 'Standard Gadget B',
    category: 'Gadgets',
    currentStock: 85,
    minStock: 150,
    maxStock: 800,
    location: 'B-03-R2-S1',
    lastUpdated: new Date('2025-01-15T09:15:00'),
    unitCost: 8.75,
    supplier: 'Global Supplies'
  },
  {
    id: '3',
    sku: 'TOL-003',
    name: 'Professional Tool C',
    category: 'Tools',
    currentStock: 230,
    minStock: 50,
    maxStock: 500,
    location: 'C-02-R1-S2',
    lastUpdated: new Date('2025-01-15T11:45:00'),
    unitCost: 25.00,
    supplier: 'ProTech Solutions'
  },
  {
    id: '4',
    sku: 'ELC-004',
    name: 'Electronic Component D',
    category: 'Electronics',
    currentStock: 1250,
    minStock: 200,
    maxStock: 2000,
    location: 'D-01-R3-S1',
    lastUpdated: new Date('2025-01-15T08:20:00'),
    unitCost: 5.25,
    supplier: 'ElectroMax'
  },
  {
    id: '5',
    sku: 'MAT-005',
    name: 'Raw Material E',
    category: 'Materials',
    currentStock: 45,
    minStock: 100,
    maxStock: 600,
    location: 'E-04-R1-S4',
    lastUpdated: new Date('2025-01-15T07:30:00'),
    unitCost: 15.80,
    supplier: 'MaterialCorp'
  }
];

export const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2025-001',
    customer: 'Alpha Manufacturing',
    status: 'processing',
    priority: 'high',
    orderDate: new Date('2025-01-15T09:00:00'),
    items: [
      { sku: 'WDG-001', name: 'Premium Widget A', quantity: 50, pickedQuantity: 35, unitPrice: 15.00 },
      { sku: 'TOL-003', name: 'Professional Tool C', quantity: 20, pickedQuantity: 20, unitPrice: 30.00 }
    ],
    totalValue: 1350.00
  },
  {
    id: '2',
    orderNumber: 'ORD-2025-002',
    customer: 'Beta Solutions',
    status: 'packed',
    priority: 'medium',
    orderDate: new Date('2025-01-15T10:30:00'),
    items: [
      { sku: 'ELC-004', name: 'Electronic Component D', quantity: 100, pickedQuantity: 100, unitPrice: 6.50 }
    ],
    totalValue: 650.00
  },
  {
    id: '3',
    orderNumber: 'ORD-2025-003',
    customer: 'Gamma Industries',
    status: 'urgent',
    priority: 'urgent',
    orderDate: new Date('2025-01-15T11:15:00'),
    items: [
      { sku: 'GDG-002', name: 'Standard Gadget B', quantity: 75, pickedQuantity: 0, unitPrice: 10.00 },
      { sku: 'MAT-005', name: 'Raw Material E', quantity: 30, pickedQuantity: 0, unitPrice: 18.00 }
    ],
    totalValue: 1290.00
  }
];

export const mockMetrics: WarehouseMetrics = {
  totalOrders: 847,
  ordersProcessed: 623,
  ordersShipped: 598,
  inventoryValue: 2845600,
  lowStockItems: 23,
  utilizationRate: 78.5,
  pickingEfficiency: 94.2,
  onTimeDelivery: 96.8
};

export const mockLocations: LocationData[] = [
  { zone: 'A', aisle: '01', rack: 'R1', shelf: 'S1', capacity: 100, occupied: 85, utilizationRate: 85 },
  { zone: 'A', aisle: '01', rack: 'R1', shelf: 'S2', capacity: 100, occupied: 92, utilizationRate: 92 },
  { zone: 'A', aisle: '01', rack: 'R1', shelf: 'S3', capacity: 100, occupied: 78, utilizationRate: 78 },
  { zone: 'B', aisle: '02', rack: 'R1', shelf: 'S1', capacity: 150, occupied: 134, utilizationRate: 89 },
  { zone: 'B', aisle: '03', rack: 'R2', shelf: 'S1', capacity: 120, occupied: 45, utilizationRate: 38 },
  { zone: 'C', aisle: '02', rack: 'R1', shelf: 'S2', capacity: 80, occupied: 67, utilizationRate: 84 },
  { zone: 'D', aisle: '01', rack: 'R3', shelf: 'S1', capacity: 200, occupied: 175, utilizationRate: 88 },
  { zone: 'E', aisle: '04', rack: 'R1', shelf: 'S4', capacity: 90, occupied: 23, utilizationRate: 26 }
];