import React, { useState, useEffect } from 'react';
import './App.css';
import rocketImg from './assets/rocket.png';
import logoImg from './assets/logo.png';
import Dashboard from './components/Dashboard';

// Utility to calculate 2D distance between ground station and current lat/lon using Haversine
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0; // if no GPS
  
  const R = 6371e3; // Earth radius in metres
  const phi1 = lat1 * Math.PI/180; // phi, lambda in radians
  const phi2 = lat2 * Math.PI/180;
  const deltaPhi = (lat2-lat1) * Math.PI/180;
  const deltaLambda = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(deltaPhi/2) * Math.sin(deltaPhi/2) +
            Math.cos(phi1) * Math.cos(phi2) *
            Math.sin(deltaLambda/2) * Math.sin(deltaLambda/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  const surfaceDistance = R * c; // in metres

  // Return only the 2D surface (GPS) distance
  return surfaceDistance;
};

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [baudRate, setBaudRate] = useState("115200");
  
  // State to hold current telemetry values
  const [telemetryData, setTelemetryData] = useState({
    pitch: 0, yaw: 0, roll: 0,
    vx: 0, vy: 0, vz: 0, v: 0,
    ax: 0, ay: 0, az: 0, a: 0,
    alt: 0, pressure: 101325, 
    distance: 0,
    t1: 25, t2: 25,
    vbat: 12.4, currentData: 0,
    lat: 12.9410, // BMSCE Default coordinates
    lon: 77.5655
  });

  // State to hold history for the graphs
  const [telemetryHistory, setTelemetryHistory] = useState([]);
  
  // State to hold full trajectory for the Height vs Time graph
  const [fullHistory, setFullHistory] = useState([]);
  
  // Flight state checkpoints
  const [flightState, setFlightState] = useState({
    motorIgnited: false,
    motorBurnout: false,
    apogeeReached: false,
    recoveryTriggered: false,
    groundReached: false
  });

  // Launchpad coordinates set by user clicking "Ready to Launch"
  const [launchpadCoords, setLaunchpadCoords] = useState(null);

  // Calculate distance from launchpad if set
  const launchpadDistance = launchpadCoords
    ? calculateDistance(launchpadCoords.lat, launchpadCoords.lon, telemetryData.lat, telemetryData.lon)
    : 0;

  const handleReadyToLaunch = () => {
    if (telemetryData.lat && telemetryData.lon) {
      setLaunchpadCoords({
        lat: telemetryData.lat,
        lon: telemetryData.lon
      });
    }
  };

  // Monitor telemetry to update flight checkpoints
  useEffect(() => {
    setFlightState(fs => {
      const newState = { ...fs };
      const { a, vz, v } = telemetryData;
      
      // Motor Ignited: a > 15 (acceleration spike)
      if (!fs.motorIgnited && a > 15) newState.motorIgnited = true;
      
      // Motor Burnout: Ignited, but acceleration drops below 5 (coasting)
      if (fs.motorIgnited && !fs.motorBurnout && a < 5) newState.motorBurnout = true;
      
      // Apogee Reached: Burnout, and vertical velocity becomes negative
      if (fs.motorBurnout && !fs.apogeeReached && vz < 0) newState.apogeeReached = true;
      
      // Recovery System Triggered: Apogee reached, and a sudden acceleration spike (parachute opening shock > 10)
      if (fs.apogeeReached && !fs.recoveryTriggered && a > 10) newState.recoveryTriggered = true;
      
      // Ground Reached: Recovery triggered, and total velocity is near zero (< 1 m/s)
      if (fs.recoveryTriggered && !fs.groundReached && v < 1) newState.groundReached = true;
      
      // Return new state only if something changed
      if (newState.motorIgnited !== fs.motorIgnited ||
          newState.motorBurnout !== fs.motorBurnout ||
          newState.apogeeReached !== fs.apogeeReached ||
          newState.recoveryTriggered !== fs.recoveryTriggered ||
          newState.groundReached !== fs.groundReached) {
        return newState;
      }
      return fs;
    });
  }, [telemetryData]);

  // Generate some dummy data for visualization purposes
  useEffect(() => {
    if (isConnected) return; // Stop dummy data once connected

    const startTime = Date.now();

    const timer = setInterval(() => {
      const elapsedMs = Date.now() - startTime;
      const elapsedSec = elapsedMs / 1000;
      
      const ax = Math.sin(elapsedSec) * 5;
      const ay = Math.cos(elapsedSec) * 5;
      const az = 9.8 + Math.sin(elapsedSec * 2);
      
      const vx = 10 + Math.sin(elapsedSec) * 2;
      const vy = 5 + Math.cos(elapsedSec);
      const vz = 50 + elapsedSec; // Realistic linear growth instead of massive numbers
      const v = Math.sqrt(vx*vx + vy*vy + vz*vz);
      
      // Simulate trajectory (launching up and then gravity takes over)
      const alt = Math.max(0, 50 * elapsedSec - 0.5 * 9.8 * elapsedSec * elapsedSec);

      // Read ground station from env, otherwise default to BMSCE
      const groundLat = parseFloat(import.meta.env.VITE_GROUND_STATION_LAT) || 12.9410;
      const groundLon = parseFloat(import.meta.env.VITE_GROUND_STATION_LON) || 77.5655;
      
      // Simulate some slight movement in lat/lon
      const simulatedLat = 12.9410 + (elapsedSec * 0.00001);
      const simulatedLon = 77.5655 + (elapsedSec * 0.00001);

      const calculatedDistance = calculateDistance(groundLat, groundLon, simulatedLat, simulatedLon);

      const newData = {
        time: elapsedSec, // Shows nicely on X-axis as seconds (1, 2, 3...)
        pitch: Math.sin(elapsedSec / 2) * 0.5,
        yaw: Math.cos(elapsedSec / 3) * 0.5,
        roll: elapsedSec % (Math.PI * 2),
        vx: vx,
        vy: vy,
        vz: vz,
        v: v,
        ax: ax,
        ay: ay,
        az: az,
        a: Math.sqrt(ax*ax + ay*ay + az*az),
        alt: alt,
        pressure: 101325 - (alt * 12),
        distance: calculatedDistance,
        lat: simulatedLat,
        lon: simulatedLon,
        t1: 25 + (elapsedSec * 0.1),
        t2: 24 + (elapsedSec * 0.15),
        vbat: 12.4 - (elapsedSec * 0.001),
        currentData: 2.1 + Math.sin(elapsedSec) * 0.5
      };

      setTelemetryData(prev => ({...prev, ...newData}));
      
      setTelemetryHistory(prev => {
        const newHistory = [...prev, newData];
        if (newHistory.length > 50) newHistory.shift(); // Keep last 50 points
        return newHistory;
      });

      setFullHistory(prev => {
        // Sample every ~5th point (2Hz) to keep memory manageable for full trajectory
        if (prev.length === 0 || elapsedSec - prev[prev.length - 1].time >= 0.5) {
          return [...prev, newData];
        }
        return prev;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [isConnected]);

  const handleStart = async () => {
    try {
      if (!('serial' in navigator)) {
        alert("Web Serial API is not supported in your browser. Please use Chrome or Edge.");
        // Proceeding anyway just to show dashboard for demo
        setIsConnected(true);
        return;
      }

      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: parseInt(baudRate) });
      setIsConnected(true);
      alert(`Successfully connected to the serial port at ${baudRate} bps!`);
      
      // Start reading from the serial port
      readSerialData(port);

    } catch (error) {
      console.error("Error opening serial port:", error);
      // For development: connect anyway if they cancel port selection (Simulator)
      setIsConnected(true); 
    }
  };

  const readSerialData = async (port) => {
    const textDecoder = new TextDecoderStream();
    port.readable.pipeTo(textDecoder.writable);
    const reader = textDecoder.readable.getReader();
    
    let buffer = '';
    const sessionStartTime = Date.now(); // Track session start for clean X-axis

    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        buffer += value;
        const lines = buffer.split('\n');
        
        // Process all complete lines
        for (let i = 0; i < lines.length - 1; i++) {
          const line = lines[i].trim();
          if (!line) continue;

          // Push raw data to memory & file
          const currentTimestamp = new Date().toLocaleString();
          const csvLine = `${currentTimestamp},${line}\n`;

          // Send to local Vite backend to write to file
          try {
            fetch('/api/log', {
              method: 'POST',
              body: csvLine
            }).catch(() => {});
          } catch(e) {
            console.error(e);
          }

          try {
            // Expected format depends on packet. Example placeholder parsing:
            // "1,vx,vy,vz,ax,ay,az,roll,pitch,yaw,alt,pressure"
            // "2,lat,lon,vbat,current,t1,t2"
            const parts = line.split(',');
            const packetId = parseInt(parts[0]);
            
            if (packetId === 1 && parts.length >= 10) {
              const elapsedSec = (Date.now() - sessionStartTime) / 1000;
              
              const newData = {
                time: elapsedSec, // Clean seconds format instead of full Date.now() timestamp
                vx: parseFloat(parts[1]) || 0,
                vy: parseFloat(parts[2]) || 0,
                vz: parseFloat(parts[3]) || 0,
                v: Math.sqrt(Math.pow(parseFloat(parts[1])||0, 2) + Math.pow(parseFloat(parts[2])||0, 2) + Math.pow(parseFloat(parts[3])||0, 2)),
                ax: parseFloat(parts[4]) || 0,
                ay: parseFloat(parts[5]) || 0,
                az: parseFloat(parts[6]) || 0,
                a: Math.sqrt(Math.pow(parseFloat(parts[4])||0, 2) + Math.pow(parseFloat(parts[5])||0, 2) + Math.pow(parseFloat(parts[6])||0, 2)),
                // Assuming gyro is sent in degrees, converting to radians for 3D model
                roll: (parseFloat(parts[7]) || 0) * (Math.PI / 180),
                pitch: (parseFloat(parts[8]) || 0) * (Math.PI / 180),
                yaw: (parseFloat(parts[9]) || 0) * (Math.PI / 180),
                alt: parseFloat(parts[10]) || 0,
                pressure: parseFloat(parts[11]) || 0
              };

              setTelemetryData(prev => {
                const groundLat = parseFloat(import.meta.env.VITE_GROUND_STATION_LAT) || 12.9410;
                const groundLon = parseFloat(import.meta.env.VITE_GROUND_STATION_LON) || 77.5655;
                const dist = calculateDistance(groundLat, groundLon, prev.lat || groundLat, prev.lon || groundLon);
                
                const updatedData = { ...newData, distance: dist };
                const combinedData = { ...prev, ...updatedData };

                setTelemetryHistory(histPrev => {
                  const newHistory = [...histPrev, combinedData];
                  if (newHistory.length > 50) newHistory.shift(); 
                  return newHistory;
                });

                setFullHistory(fullPrev => {
                  if (fullPrev.length === 0 || elapsedSec - fullPrev[fullPrev.length - 1].time >= 0.5) {
                    return [...fullPrev, combinedData];
                  }
                  return fullPrev;
                });

                return combinedData;
              });
            } else if (packetId === 2 && parts.length >= 7) {
              // Parse Set 2 data: "2,lat,lon,vbat,current,t1,t2"
              setTelemetryData(prev => {
                const newLat = parseFloat(parts[1]) || prev.lat;
                const newLon = parseFloat(parts[2]) || prev.lon;
                
                const groundLat = parseFloat(import.meta.env.VITE_GROUND_STATION_LAT) || 12.9410;
                const groundLon = parseFloat(import.meta.env.VITE_GROUND_STATION_LON) || 77.5655;
                const dist = calculateDistance(groundLat, groundLon, newLat, newLon);

                return {
                  ...prev,
                  lat: newLat,
                  lon: newLon,
                  // We'll capture battery and temp data too for when you're ready
                  vbat: parseFloat(parts[3]),
                  currentData: parseFloat(parts[4]),
                  t1: parseFloat(parts[5]),
                  t2: parseFloat(parts[6]),
                  distance: dist
                };
              });
            }
          } catch (e) {
            console.error("Error parsing serial line:", e, line);
          }
        }
        
        // Keep the incomplete line for the next chunk
        buffer = lines[lines.length - 1]; 
      }
    } catch (error) {
      console.error("Error reading serial stream:", error);
    } finally {
      reader.releaseLock();
    }
  };

  if (isConnected) {
    return <Dashboard 
      telemetryData={telemetryData} 
      telemetryHistory={telemetryHistory} 
      fullHistory={fullHistory} 
      flightState={flightState} 
      launchpadDistance={launchpadDistance}
      launchpadCoords={launchpadCoords}
      onReadyToLaunch={handleReadyToLaunch}
    />;
  }

  return (
    <div className="loading-screen">
      <div className="rocket-wrapper">
        <img 
          src={rocketImg}
          alt="Rocket" 
          className="rocket" 
        />
        <div className="fire"></div>
        <div className="smoke-trail"></div>
      </div>
      
      <div className="logo-container">
        {/* Replace the placeholder div with the actual logo image */}
        <img 
          src={logoImg} 
          alt="BMSCE Rocketry Logo" 
          className="logo" 
        />
        <h1 className="title">ROCKETRY</h1>
        
        <div className="controls">
          {/* Replaced COM port list with Baud Rate list, because the Web Serial API uses a secure native popup to select the COM port */}
          <select 
            className="port-select" 
            value={baudRate} 
            onChange={(e) => setBaudRate(e.target.value)}
            disabled={isConnected}
          >
            <option value="9600">9600 bps</option>
            <option value="38400">38400 bps</option>
            <option value="57600">57600 bps</option>
            <option value="115200">115200 bps</option>
          </select>
          <button 
            className="start-btn" 
            onClick={handleStart}
            disabled={isConnected}
          >
            {isConnected ? 'LIVE' : 'START'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
