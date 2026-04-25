import React from 'react';
import Rocket3DView from './Rocket3DView';
import TelemetryGraphs from './TelemetryGraphs';
import MapViewer from './MapViewer';
import LeftPanel from './LeftPanel';

const Dashboard = ({ telemetryData, telemetryHistory, fullHistory, flightState }) => {
  return (
    <div style={{
      display: 'flex',
      width: '100vw',
      height: '100vh',
      backgroundColor: '#282C34', // Matches the loading screen color
      color: 'white',
      padding: '10px',
      boxSizing: 'border-box',
      gap: '10px'
    }}>
      {/* LEFT HALF */}
      <div style={{
        flex: 1,
        display: 'flex',
        minWidth: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.2)', // Subtle darker panel
        borderRadius: '8px',
        padding: '10px'
      }}>
        <LeftPanel 
          telemetryData={telemetryData} 
          telemetryHistory={telemetryHistory} 
          fullHistory={fullHistory} 
          flightState={flightState}
        />
      </div>

      {/* RIGHT HALF */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        minWidth: 0 // Prevents wide expanding
      }}>
        {/* RIGHT TOP HALF (Graphs + 3D Model) */}
        <div style={{
          flex: 1,
          display: 'flex',
          gap: '10px',
          minHeight: 0, // Prevents flex children from infinitely expanding
          minWidth: 0
        }}>
          {/* GRAPHS */}
          <div style={{ flex: '0 0 40%', minHeight: 0, minWidth: 0 }}>
            <TelemetryGraphs data={telemetryHistory} />
          </div>

          {/* 3D MODEL */}
          <div style={{ flex: 1, minHeight: 0, minWidth: 0 }}>
            <Rocket3DView 
              pitch={telemetryData.pitch} 
              yaw={telemetryData.yaw} 
              roll={telemetryData.roll} 
            />
          </div>
        </div>

        {/* RIGHT BOTTOM HALF (Map) */}
        <div style={{
          flex: 1,
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '8px',
          display: 'flex',
          backgroundColor: 'rgba(0, 0, 0, 0.2)', // Subtle darker panel
          position: 'relative',
          overflow: 'hidden' // Important for Leaflet
        }}>
          <MapViewer lat={telemetryData.lat} lon={telemetryData.lon} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
