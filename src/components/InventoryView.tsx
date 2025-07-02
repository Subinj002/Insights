import React, { useState } from 'react';
import { Search, AlertTriangle, Package, Download } from 'lucide-react';
import { mockInventory } from '../data/mockData';
import { InventoryItem } from '../types/wms';

const InventoryView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<keyof InventoryItem>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const filteredInventory = mockInventory
    .filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  const getStockStatus = (item: InventoryItem) => {
    if (item.currentStock <= item.minStock) {
      return { status: 'low', color: 'text-red-400', bgColor: 'bg-red-900/20' };
    } else if (item.currentStock >= item.maxStock * 0.8) {
      return { status: 'high', color: 'text-yellow-400', bgColor: 'bg-yellow-900/20' };
    } else {
      return { status: 'normal', color: 'text-green-400', bgColor: 'bg-green-900/20' };
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Inventory Management</h1>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Items</p>
              <p className="text-2xl font-bold text-white">{mockInventory.length}</p>
            </div>
            <Package className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Low Stock Items</p>
              <p className="text-2xl font-bold text-red-400">
                {mockInventory.filter(item => item.currentStock <= item.minStock).length}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Value</p>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(mockInventory.reduce((sum, item) => sum + (item.currentStock * item.unitCost), 0))}
              </p>
            </div>
            <Package className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name, SKU, or category..."
              className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as keyof InventoryItem)}
            >
              <option value="name">Sort by Name</option>
              <option value="sku">Sort by SKU</option>
              <option value="currentStock">Sort by Stock</option>
              <option value="unitCost">Sort by Cost</option>
            </select>
            <button
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white hover:bg-gray-600 transition-colors"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="text-left px-6 py-3 text-gray-300 font-semibold">SKU</th>
                <th className="text-left px-6 py-3 text-gray-300 font-semibold">Product Name</th>
                <th className="text-left px-6 py-3 text-gray-300 font-semibold">Category</th>
                <th className="text-left px-6 py-3 text-gray-300 font-semibold">Current Stock</th>
                <th className="text-left px-6 py-3 text-gray-300 font-semibold">Min Stock</th>
                <th className="text-left px-6 py-3 text-gray-300 font-semibold">Location</th>
                <th className="text-left px-6 py-3 text-gray-300 font-semibold">Unit Cost</th>
                <th className="text-left px-6 py-3 text-gray-300 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map((item) => {
                const stockStatus = getStockStatus(item);
                return (
                  <tr key={item.id} className="border-t border-gray-700 hover:bg-gray-750 transition-colors">
                    <td className="px-6 py-4 text-white font-mono">{item.sku}</td>
                    <td className="px-6 py-4 text-white">{item.name}</td>
                    <td className="px-6 py-4 text-gray-300">{item.category}</td>
                    <td className="px-6 py-4 text-white font-semibold">{item.currentStock.toLocaleString()}</td>
                    <td className="px-6 py-4 text-gray-300">{item.minStock.toLocaleString()}</td>
                    <td className="px-6 py-4 text-gray-300 font-mono">{item.location}</td>
                    <td className="px-6 py-4 text-white">{formatCurrency(item.unitCost)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${stockStatus.color} ${stockStatus.bgColor}`}>
                        {stockStatus.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryView;