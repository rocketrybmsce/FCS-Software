import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const LeftPanel = ({ telemetryData, telemetryHistory, fullHistory, flightState }) => {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      minWidth: 0,
      minHeight: 0
    }}>
      {/* TOP ROW: 3 GRAPHS (Pressure, Temperature, Distance) */}
      <div style={{ flex: 1, display: 'flex', gap: '10px', minHeight: 0 }}>
        
        {/* Pressure vs Time */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, minWidth: 0, backgroundColor: 'rgba(0, 0, 0, 0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '5px' }}>
          <h3 style={{ margin: '0 0 2px 0', fontSize: '0.85rem', textAlign: 'center', color: '#fff', fontWeight: 'normal' }}>Pressure vs Time</h3>
          <div style={{ flex: 1, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={telemetryHistory} margin={{ top: 0, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="time" stroke="#ccc" tick={{fill: '#ccc', fontSize: 10}} tickFormatter={(t) => typeof t === 'number' ? t.toFixed(1) : t} />
                <YAxis stroke="#ccc" tick={{fill: '#ccc', fontSize: 10}} domain={['auto', 'auto']} width={45} />
                <Tooltip contentStyle={{ backgroundColor: '#282C34', border: '1px solid #555', color: '#fff', fontSize: '12px' }} />
                <Line type="monotone" dataKey="pressure" stroke="#8b5cf6" dot={false} isAnimationActive={false} name="Pressure (Pa)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Temperature vs Time */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, minWidth: 0, backgroundColor: 'rgba(0, 0, 0, 0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '5px' }}>
          <h3 style={{ margin: '0 0 2px 0', fontSize: '0.85rem', textAlign: 'center', color: '#fff', fontWeight: 'normal' }}>Temperature vs Time</h3>
          <div style={{ flex: 1, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={telemetryHistory} margin={{ top: 0, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="time" stroke="#ccc" tick={{fill: '#ccc', fontSize: 10}} tickFormatter={(t) => typeof t === 'number' ? t.toFixed(1) : t} />
                <YAxis stroke="#ccc" tick={{fill: '#ccc', fontSize: 10}} domain={['auto', 'auto']} width={35} />
                <Tooltip contentStyle={{ backgroundColor: '#282C34', border: '1px solid #555', color: '#fff', fontSize: '12px' }} />
                <Legend wrapperStyle={{ color: '#ccc', fontSize: '10px' }} verticalAlign="top" height={15} />
                <Line type="monotone" dataKey="t1" stroke="#ef4444" dot={false} isAnimationActive={false} name="T1 (°C)" />
                <Line type="monotone" dataKey="t2" stroke="#f97316" dot={false} isAnimationActive={false} name="T2 (°C)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distance vs Time */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, minWidth: 0, backgroundColor: 'rgba(0, 0, 0, 0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '5px' }}>
          <h3 style={{ margin: '0 0 2px 0', fontSize: '0.85rem', textAlign: 'center', color: '#fff', fontWeight: 'normal' }}>Distance vs Time</h3>
          <div style={{ flex: 1, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={telemetryHistory} margin={{ top: 0, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="time" stroke="#ccc" tick={{fill: '#ccc', fontSize: 10}} tickFormatter={(t) => typeof t === 'number' ? t.toFixed(1) : t} />
                <YAxis stroke="#ccc" tick={{fill: '#ccc', fontSize: 10}} domain={['auto', 'auto']} width={35} />
                <Tooltip contentStyle={{ backgroundColor: '#282C34', border: '1px solid #555', color: '#fff', fontSize: '12px' }} />
                <Line type="monotone" dataKey="distance" stroke="#10b981" dot={false} isAnimationActive={false} name="Distance (m)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* MIDDLE ROW: Height vs Time (Full Trajectory) */}
      <div style={{ flex: 1.2, display: 'flex', gap: '5px', minHeight: 0, minWidth: 0 }}>
        
        {/* Chart (approx 75%) */}
        <div style={{ flex: 3, display: 'flex', flexDirection: 'column', minHeight: 0, minWidth: 0, backgroundColor: 'rgba(0, 0, 0, 0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '5px' }}>
          <h3 style={{ margin: '0 0 2px 0', fontSize: '0.85rem', textAlign: 'center', color: '#fff', fontWeight: 'normal' }}>Height vs Time</h3>
          <div style={{ flex: 1, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              {/* We use fullHistory here so the X axis doesn't shift and the whole flight is visible */}
              <LineChart data={fullHistory} margin={{ top: 0, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="time" stroke="#ccc" tick={{fill: '#ccc', fontSize: 10}} tickFormatter={(t) => typeof t === 'number' ? t.toFixed(1) : t} label={{ value: 'Time (s)', position: 'insideBottom', offset: -5, fill: '#ccc', fontSize: 10 }} />
                <YAxis stroke="#ccc" tick={{fill: '#ccc', fontSize: 10}} domain={['auto', 'auto']} width={45} label={{ value: 'Height (m)', angle: -90, position: 'insideLeft', fill: '#ccc', fontSize: 10, offset: 0 }} />
                <Tooltip contentStyle={{ backgroundColor: '#282C34', border: '1px solid #555', color: '#fff', fontSize: '12px' }} />
                <Line type="monotone" dataKey="alt" stroke="#3b82f6" dot={false} isAnimationActive={false} name="Height (m)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Checkpoints (approx 25%) */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, minWidth: 0, backgroundColor: 'rgba(0, 0, 0, 0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '5px', overflowY: 'auto' }}>
          <h3 style={{ margin: '0 0 5px 0', fontSize: '0.85rem', textAlign: 'center', color: '#fff', borderBottom: '1px solid #444', paddingBottom: '3px', fontWeight: 'normal' }}>Checkpoints</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.75rem', marginTop: '5px' }}>
            <div style={{ color: flightState?.motorIgnited ? '#10b981' : '#888', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>{flightState?.motorIgnited ? '✅' : '⏳'}</span> 
              <span>Motor Ignited</span>
            </div>
            <div style={{ color: flightState?.motorBurnout ? '#10b981' : '#888', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>{flightState?.motorBurnout ? '✅' : '⏳'}</span> 
              <span>Motor Burnout</span>
            </div>
            <div style={{ color: flightState?.apogeeReached ? '#10b981' : '#888', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>{flightState?.apogeeReached ? '✅' : '⏳'}</span> 
              <span>Apogee Reached</span>
            </div>
            <div style={{ color: flightState?.recoveryTriggered ? '#10b981' : '#888', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>{flightState?.recoveryTriggered ? '✅' : '⏳'}</span> 
              <span>Recovery Triggered</span>
            </div>
            <div style={{ color: flightState?.groundReached ? '#10b981' : '#888', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>{flightState?.groundReached ? '✅' : '⏳'}</span> 
              <span>Ground Reached</span>
            </div>
          </div>
        </div>

      </div>

      {/* BOTTOM ROW: Text Data */}
      <div style={{ flex: 0.8, display: 'flex', flexDirection: 'column', minHeight: 0, backgroundColor: 'rgba(0, 0, 0, 0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '15px', color: '#fff' }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '1rem', borderBottom: '1px solid #444', paddingBottom: '5px' }}>Data</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '1.2rem', flex: 1, alignItems: 'center' }}>
          <div>
            <span style={{ color: '#aaa', display: 'inline-block', width: '90px' }}>Voltage:</span> {telemetryData.vbat ? telemetryData.vbat.toFixed(2) : '0.00'} V
          </div>
          <div>
            <span style={{ color: '#aaa', display: 'inline-block', width: '90px' }}>Pressure:</span> {telemetryData.pressure ? telemetryData.pressure.toFixed(1) : '0'} Pa
          </div>
          <div>
            <span style={{ color: '#aaa', display: 'inline-block', width: '90px' }}>Current:</span> {telemetryData.currentData ? telemetryData.currentData.toFixed(2) : '0.00'} A
          </div>
          <div>
            <span style={{ color: '#aaa', display: 'inline-block', width: '90px' }}>Height:</span> {telemetryData.alt ? telemetryData.alt.toFixed(1) : '0.0'} m
          </div>
          <div>
            <span style={{ color: '#aaa', display: 'inline-block', width: '30px' }}>T1:</span> {telemetryData.t1 ? telemetryData.t1.toFixed(1) : '0'}°C &nbsp;&nbsp;|&nbsp;&nbsp; <span style={{ color: '#aaa' }}>T2:</span> {telemetryData.t2 ? telemetryData.t2.toFixed(1) : '0'}°C
          </div>
          <div>
            <span style={{ color: '#aaa', display: 'inline-block', width: '90px' }}>Distance:</span> {telemetryData.distance ? telemetryData.distance.toFixed(1) : '0.0'} m
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default LeftPanel;
