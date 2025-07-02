import React, { useState } from 'react';
import { Clock, CheckCircle, Package, AlertCircle, User, Calendar } from 'lucide-react';
import { mockOrders } from '../data/mockData';
import { Order } from '../types/wms';

const OrderManagement: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredOrders = selectedStatus === 'all' 
    ? mockOrders 
    : mockOrders.filter(order => order.status === selectedStatus);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'processing':
        return <Package className="w-4 h-4" />;
      case 'packed':
        return <CheckCircle className="w-4 h-4" />;
      case 'shipped':
        return <CheckCircle className="w-4 h-4" />;
      case 'urgent':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-400 bg-yellow-900/20';
      case 'processing':
        return 'text-blue-400 bg-blue-900/20';
      case 'packed':
        return 'text-green-400 bg-green-900/20';
      case 'shipped':
        return 'text-green-400 bg-green-900/20';
      case 'urgent':
        return 'text-red-400 bg-red-900/20';
      default:
        return 'text-gray-400 bg-gray-900/20';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-400 bg-red-900/20';
      case 'high':
        return 'text-orange-400 bg-orange-900/20';
      case 'medium':
        return 'text-yellow-400 bg-yellow-900/20';
      case 'low':
        return 'text-green-400 bg-green-900/20';
      default:
        return 'text-gray-400 bg-gray-900/20';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const getOrderProgress = (order: Order) => {
    const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
    const pickedItems = order.items.reduce((sum, item) => sum + item.pickedQuantity, 0);
    return (pickedItems / totalItems) * 100;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Order Management</h1>
        <div className="text-sm text-gray-400">
          {filteredOrders.length} orders shown
        </div>
      </div>

      {/* Status Filter */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedStatus === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            onClick={() => setSelectedStatus('all')}
          >
            All Orders
          </button>
          {['pending', 'processing', 'packed', 'shipped', 'urgent'].map(status => (
            <button
              key={status}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                selectedStatus === status 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              onClick={() => setSelectedStatus(status)}
            >
              {getStatusIcon(status)}
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">{order.orderNumber}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">{order.customer}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  {order.status.toUpperCase()}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor(order.priority)}`}>
                  {order.priority.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-gray-300 text-sm">
                {order.orderDate.toLocaleDateString()} at {order.orderDate.toLocaleTimeString()}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <h4 className="text-sm font-semibold text-gray-300">Order Items:</h4>
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-700 rounded-lg p-3">
                  <div>
                    <p className="text-white font-medium">{item.name}</p>
                    <p className="text-gray-400 text-sm">SKU: {item.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white">
                      {item.pickedQuantity}/{item.quantity}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {formatCurrency(item.unitPrice)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Progress</span>
                <span className="text-white font-semibold">
                  {getOrderProgress(order).toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getOrderProgress(order)}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-gray-400">Total Value</span>
                <span className="text-white font-bold text-lg">
                  {formatCurrency(order.totalValue)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderManagement;