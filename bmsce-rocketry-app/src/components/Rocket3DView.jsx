import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import RocketModel from './RocketModel';

const Rocket3DView = ({ pitch, yaw, roll }) => {
  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'rgba(0, 0, 0, 0.2)', // Matches new dashboard panel styling
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '8px', 
      overflow: 'hidden' 
    }}>
      <div style={{ flex: 1, minHeight: 0 }}>
        <Canvas camera={{ position: [0, 2, 7], fov: 60 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <directionalLight position={[-5, 5, -5]} intensity={0.5} />
          
          <RocketModel roll={roll} pitch={pitch} yaw={yaw} />
          <OrbitControls />
          
          <Grid args={[10, 10]} position={[0, -2.5, 0]} infiniteGrid fadeDistance={20} cellColor="#6f6f6f" sectionColor="#eb4034" />
          <axesHelper args={[5]} />
        </Canvas>
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        padding: '10px',
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        fontSize: '1.1rem',
        color: '#ccc'
      }}>
        <span>Yaw: {(yaw * (180/Math.PI)).toFixed(1)}°</span>
        <span>Pitch: {(pitch * (180/Math.PI)).toFixed(1)}°</span>
        <span>Roll: {(roll * (180/Math.PI)).toFixed(1)}°</span>
      </div>
    </div>
  );
};

export default Rocket3DView;