import React from 'react';
import { MapPin, TrendingUp } from 'lucide-react';
import { mockLocations } from '../data/mockData';

const LocationHeatmap: React.FC = () => {
  const getUtilizationColor = (rate: number) => {
    if (rate >= 90) return 'bg-red-500';
    if (rate >= 75) return 'bg-orange-500';
    if (rate >= 50) return 'bg-yellow-500';
    if (rate >= 25) return 'bg-green-500';
    return 'bg-blue-500';
  };

  const zones = ['A', 'B', 'C', 'D', 'E'];
  const maxAisles = 4;
  const maxRacks = 3;
  const maxShelves = 4;

  const getLocationData = (zone: string, aisle: number, rack: number, shelf: number) => {
    return mockLocations.find(loc => 
      loc.zone === zone && 
      loc.aisle === aisle.toString().padStart(2, '0') &&
      loc.rack === `R${rack}` &&
      loc.shelf === `S${shelf}`
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Location Management</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-gray-400" />
            <span className="text-gray-400">Warehouse Layout</span>
          </div>
        </div>
      </div>

      {/* Utilization Legend */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Utilization Rate Legend</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-gray-300">90-100%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
            <span className="text-gray-300">75-89%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span className="text-gray-300">50-74%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-gray-300">25-49%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-gray-300">0-24%</span>
          </div>
        </div>
      </div>

      {/* Warehouse Heatmap */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-6">Warehouse Floor Plan</h3>
        <div className="grid grid-cols-5 gap-8">
          {zones.map((zone) => (
            <div key={zone} className="space-y-4">
              <h4 className="text-center text-white font-semibold bg-gray-700 rounded-lg py-2">
                Zone {zone}
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {Array.from({ length: maxAisles }, (_, aisle) =>
                  Array.from({ length: maxRacks }, (_, rack) =>
                    Array.from({ length: maxShelves }, (_, shelf) => {
                      const locationData = getLocationData(zone, aisle + 1, rack + 1, shelf + 1);
                      if (!locationData) {
                        return (
                          <div
                            key={`${zone}-${aisle}-${rack}-${shelf}`}
                            className="w-6 h-6 bg-gray-600 rounded border border-gray-500"
                            title="Empty Location"
                          ></div>
                        );
                      }
                      return (
                        <div
                          key={`${zone}-${aisle}-${rack}-${shelf}`}
                          className={`w-6 h-6 rounded border border-gray-500 cursor-pointer hover:border-white transition-colors ${getUtilizationColor(locationData.utilizationRate)}`}
                          title={`${locationData.zone}-${locationData.aisle}-${locationData.rack}-${locationData.shelf}\n${locationData.occupied}/${locationData.capacity} (${locationData.utilizationRate}%)`}
                        ></div>
                      );
                    })
                  )
                ).flat()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Location Details Table */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">Location Details</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="text-left px-6 py-3 text-gray-300 font-semibold">Location</th>
                <th className="text-left px-6 py-3 text-gray-300 font-semibold">Zone</th>
                <th className="text-left px-6 py-3 text-gray-300 font-semibold">Capacity</th>
                <th className="text-left px-6 py-3 text-gray-300 font-semibold">Occupied</th>
                <th className="text-left px-6 py-3 text-gray-300 font-semibold">Available</th>
                <th className="text-left px-6 py-3 text-gray-300 font-semibold">Utilization</th>
                <th className="text-left px-6 py-3 text-gray-300 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockLocations.map((location, index) => (
                <tr key={index} className="border-t border-gray-700 hover:bg-gray-750 transition-colors">
                  <td className="px-6 py-4 text-white font-mono">
                    {location.zone}-{location.aisle}-{location.rack}-{location.shelf}
                  </td>
                  <td className="px-6 py-4 text-gray-300">{location.zone}</td>
                  <td className="px-6 py-4 text-white">{location.capacity}</td>
                  <td className="px-6 py-4 text-white">{location.occupied}</td>
                  <td className="px-6 py-4 text-gray-300">{location.capacity - location.occupied}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-gray-700 rounded-full h-2 max-w-20">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${getUtilizationColor(location.utilizationRate)}`}
                          style={{ width: `${location.utilizationRate}%` }}
                        ></div>
                      </div>
                      <span className="text-white font-semibold min-w-12">
                        {location.utilizationRate}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      location.utilizationRate >= 90 ? 'text-red-400 bg-red-900/20' :
                      location.utilizationRate >= 75 ? 'text-orange-400 bg-orange-900/20' :
                      location.utilizationRate >= 50 ? 'text-yellow-400 bg-yellow-900/20' :
                      'text-green-400 bg-green-900/20'
                    }`}>
                      {location.utilizationRate >= 90 ? 'CRITICAL' :
                       location.utilizationRate >= 75 ? 'HIGH' :
                       location.utilizationRate >= 50 ? 'MODERATE' : 'OPTIMAL'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LocationHeatmap;