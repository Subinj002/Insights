import React, { useState } from 'react';
import { Database, RefreshCw, CheckCircle, AlertCircle, Clock, Settings } from 'lucide-react';

const DataIntegration: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshData = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };

  const integrationSources = [
    {
      name: 'MS SQL Database',
      type: 'Primary Database',
      status: 'connected',
      lastSync: new Date('2025-01-15T11:45:00'),
      tables: ['inventory', 'orders', 'locations', 'users'],
      recordCount: 15847
    },
    {
      name: 'C WMS Application',
      type: 'Legacy System',
      status: 'connected',
      lastSync: new Date('2025-01-15T11:30:00'),
      tables: ['transactions', 'receipts', 'shipments'],
      recordCount: 8963
    },
    {
      name: 'Flask API Service',
      type: 'Data Processor',
      status: 'running',
      lastSync: new Date('2025-01-15T11:45:00'),
      tables: ['processed_data', 'analytics'],
      recordCount: 2341
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'running':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'text-green-400 bg-green-900/20';
      case 'running':
        return 'text-blue-400 bg-blue-900/20';
      case 'error':
        return 'text-red-400 bg-red-900/20';
      default:
        return 'text-yellow-400 bg-yellow-900/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Data Integration</h1>
        <button
          onClick={handleRefreshData}
          disabled={isRefreshing}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>

      {/* Integration Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-8 h-8 text-blue-500" />
            <div>
              <h3 className="text-white font-semibold">Active Connections</h3>
              <p className="text-gray-400 text-sm">Data Sources</p>
            </div>
          </div>
          <p className="text-3xl font-bold text-white">3</p>
          <p className="text-green-400 text-sm mt-2">All systems operational</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <RefreshCw className="w-8 h-8 text-green-500" />
            <div>
              <h3 className="text-white font-semibold">Last Sync</h3>
              <p className="text-gray-400 text-sm">Data Refresh</p>
            </div>
          </div>
          <p className="text-xl font-bold text-white">2 min ago</p>
          <p className="text-gray-400 text-sm mt-2">Auto-sync enabled</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="w-8 h-8 text-yellow-500" />
            <div>
              <h3 className="text-white font-semibold">Total Records</h3>
              <p className="text-gray-400 text-sm">Processed Data</p>
            </div>
          </div>
          <p className="text-3xl font-bold text-white">27,151</p>
          <p className="text-blue-400 text-sm mt-2">+342 today</p>
        </div>
      </div>

      {/* Data Source Details */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Data Sources</h2>
        {integrationSources.map((source, index) => (
          <div key={index} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gray-700 rounded-lg">
                  <Database className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{source.name}</h3>
                  <p className="text-gray-400">{source.type}</p>
                  <p className="text-gray-500 text-sm mt-1">
                    Last sync: {source.lastSync.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2 ${getStatusColor(source.status)}`}>
                  {getStatusIcon(source.status)}
                  {source.status.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-white font-medium mb-2">Tables</h4>
                  <div className="flex flex-wrap gap-2">
                    {source.tables.map((table, tableIndex) => (
                      <span
                        key={tableIndex}
                        className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-sm font-mono"
                      >
                        {table}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-2">Records</h4>
                  <p className="text-2xl font-bold text-blue-400">
                    {source.recordCount.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* API Configuration */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Flask API Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-white font-medium mb-3">Connection Settings</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Server URL:</span>
                <span className="text-white font-mono">http://localhost:5000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Database:</span>
                <span className="text-white font-mono">warehouse_management</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Connection Pool:</span>
                <span className="text-green-400">Active (5/10)</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-white font-medium mb-3">Performance Metrics</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Avg Response Time:</span>
                <span className="text-white">145ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Requests/min:</span>
                <span className="text-white">1,247</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Error Rate:</span>
                <span className="text-green-400">0.02%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataIntegration;