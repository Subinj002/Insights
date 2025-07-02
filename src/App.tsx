import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import InventoryView from './components/InventoryView';
import OrderManagement from './components/OrderManagement';
import LocationHeatmap from './components/LocationHeatmap';
import DataIntegration from './components/DataIntegration';

function App() {
  const [activeView, setActiveView] = useState('dashboard');

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'inventory':
        return <InventoryView />;
      case 'orders':
        return <OrderManagement />;
      case 'locations':
        return <LocationHeatmap />;
      case 'integration':
        return <DataIntegration />;
      case 'analytics':
        return <div className="text-white">Analytics view coming soon...</div>;
      case 'users':
        return <div className="text-white">User management view coming soon...</div>;
      case 'settings':
        return <div className="text-white">Settings view coming soon...</div>;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {renderActiveView()}
        </div>
      </main>
    </div>
  );
}

export default App;