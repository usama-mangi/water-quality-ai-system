import React, { useEffect } from 'react';
import StationMap from '../components/StationMap';
import QualityChart from '../components/QualityChart';
import { connectSocket, disconnectSocket, socket } from '../services/socket';

const Dashboard = () => {
  useEffect(() => {
    connectSocket();

    socket.on('water_quality_update', (data) => {
      console.log('Real-time update received:', data);
      // Here we would update local state or Redux store
    });

    return () => {
      socket.off('water_quality_update');
      disconnectSocket();
    };
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Metric Cards Placeholders */}
        {[
          { label: 'Avg pH', value: '7.2' },
          { label: 'Dissolved Oxygen', value: '8.1 mg/L' },
          { label: 'Turbidity', value: '2.4 NTU' },
          { label: 'Alerts', value: '0', color: 'text-green-600' }
        ].map((metric, i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium">{metric.label}</h3>
            <p className={`text-3xl font-bold mt-2 ${metric.color || 'text-gray-900'}`}>{metric.value}</p>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-96">
          <h3 className="font-semibold mb-4">Water Quality Trends</h3>
          <div className="h-full pb-8">
            <QualityChart />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-96">
          <h3 className="font-semibold mb-4">Station Map</h3>
          <div className="h-full pb-8">
            <StationMap />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
