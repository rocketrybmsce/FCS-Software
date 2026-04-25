import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TelemetryGraphs = ({ data }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', height: '100%', minWidth: 0 }}>
      {/* Velocity Graph */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, minWidth: 0, backgroundColor: 'rgba(0, 0, 0, 0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '5px' }}>
        <h3 style={{ margin: '0 0 2px 0', fontSize: '0.85rem', textAlign: 'center', color: '#fff', fontWeight: 'normal' }}>Velocity vs Time</h3>
        <div style={{ flex: 1, minHeight: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 0, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="time" stroke="#ccc" tick={{fill: '#ccc', fontSize: 10}} tickFormatter={(t) => typeof t === 'number' ? t.toFixed(1) : t} label={{ value: 'Time (s)', position: 'insideBottom', offset: -5, fill: '#ccc', fontSize: 10 }} />
              <YAxis stroke="#ccc" tick={{fill: '#ccc', fontSize: 10}} domain={['auto', 'auto']} width={45} label={{ value: 'Velocity (m/s)', angle: -90, position: 'insideLeft', fill: '#ccc', fontSize: 10, offset: 0 }} />
              <Tooltip contentStyle={{ backgroundColor: '#282C34', border: '1px solid #555', color: '#fff', fontSize: '12px' }} />
              <Legend wrapperStyle={{ color: '#ccc', fontSize: '11px' }} verticalAlign="top" height={24} />
              
              <Line type="monotone" dataKey="vx" stroke="#22c55e" dot={false} isAnimationActive={false} name="Vx (m/s)" />
              <Line type="monotone" dataKey="vy" stroke="#3b82f6" dot={false} isAnimationActive={false} name="Vy (m/s)" />
              <Line type="monotone" dataKey="vz" stroke="#ef4444" dot={false} isAnimationActive={false} name="Vz (m/s)" />
              <Line type="monotone" dataKey="v" stroke="#eab308" dot={false} isAnimationActive={false} name="V (m/s)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Acceleration Graph */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, minWidth: 0, backgroundColor: 'rgba(0, 0, 0, 0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '5px' }}>
        <h3 style={{ margin: '0 0 2px 0', fontSize: '0.85rem', textAlign: 'center', color: '#fff', fontWeight: 'normal' }}>Acceleration vs Time</h3>
        <div style={{ flex: 1, minHeight: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 0, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="time" stroke="#ccc" tick={{fill: '#ccc', fontSize: 10}} tickFormatter={(t) => typeof t === 'number' ? t.toFixed(1) : t} label={{ value: 'Time (s)', position: 'insideBottom', offset: -5, fill: '#ccc', fontSize: 10 }} />
              <YAxis stroke="#ccc" tick={{fill: '#ccc', fontSize: 10}} domain={['auto', 'auto']} width={45} label={{ value: 'Accel (m/s²)', angle: -90, position: 'insideLeft', fill: '#ccc', fontSize: 10, offset: 0 }} />
              <Tooltip contentStyle={{ backgroundColor: '#282C34', border: '1px solid #555', color: '#fff', fontSize: '12px' }} />
              <Legend wrapperStyle={{ color: '#ccc', fontSize: '11px' }} verticalAlign="top" height={24} />
              
              <Line type="monotone" dataKey="ax" stroke="#22c55e" dot={false} isAnimationActive={false} name="Ax (m/s²)" />
              <Line type="monotone" dataKey="ay" stroke="#3b82f6" dot={false} isAnimationActive={false} name="Ay (m/s²)" />
              <Line type="monotone" dataKey="az" stroke="#ef4444" dot={false} isAnimationActive={false} name="Az (m/s²)" />
              <Line type="monotone" dataKey="a" stroke="#eab308" dot={false} isAnimationActive={false} name="A (m/s²)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default TelemetryGraphs;
