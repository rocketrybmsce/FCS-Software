import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';

// Colors matching the custom rocket design
const blueColor = "#2b6cb0";
const whiteColor = "#f8f9fa";
const darkBlueColor = "#1a365d";

// Reusable Chevron Component (Pointing up / V-shape)
const Chevron = () => (
  <group>
    {/* Left line of the chevron */}
    <mesh position={[-0.14, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
      <boxGeometry args={[0.4, 0.08, 0.05]} />
      <meshStandardMaterial color={blueColor} />
    </mesh>
    {/* Right line of the chevron */}
    <mesh position={[0.14, 0, 0]} rotation={[0, 0, -Math.PI / 4]}>
      <boxGeometry args={[0.4, 0.08, 0.05]} />
      <meshStandardMaterial color={blueColor} />
    </mesh>
  </group>
);

const RocketModel = ({ pitch = 0, yaw = 0, roll = 0 }) => {
  const groupRef = useRef();

  // Create a proper fin shape (clipped delta shape)
  const finShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0); // root bottom
    shape.lineTo(0.8, -0.4); // tip bottom (swept back)
    shape.lineTo(0.8, 0.2); // tip top
    shape.lineTo(0, 1.0); // root top
    shape.lineTo(0, 0); // close
    return shape;
  }, []);

  const extrudeSettings = {
    steps: 1,
    depth: 0.04, // thickness of the fin
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.02,
    bevelSegments: 2
  };

  return (
    <group ref={groupRef} rotation={[pitch, yaw, roll]} scale={[0.7, 0.7, 0.7]}>
      {/* Lower Body (Blue) */}
      <mesh position={[0, -1, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 3, 32]} />
        <meshStandardMaterial color={blueColor} roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Upper Body (White) */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 2, 32]} />
        <meshStandardMaterial color={whiteColor} roughness={0.3} metalness={0.3} />
      </mesh>

      {/* Nose cone (White - Ogive like shape using a cylinder with topRadius=0) */}
      <mesh position={[0, 3.5, 0]}>
        <cylinderGeometry args={[0, 0.3, 2, 32, 1]} />
        <meshStandardMaterial color={whiteColor} roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Chevrons around the white body section */}
      <group position={[0, 0, 0]}>
        {/* Front */}
        <group position={[0, 1.4, 0.31]}>
          <Chevron />
        </group>
        <group position={[0, 1.0, 0.31]}>
          <Chevron />
        </group>
        {/* Back */}
        <group position={[0, 1.4, -0.31]} rotation={[0, Math.PI, 0]}>
          <Chevron />
        </group>
        <group position={[0, 1.0, -0.31]} rotation={[0, Math.PI, 0]}>
          <Chevron />
        </group>
        {/* Right */}
        <group position={[0.31, 1.4, 0]} rotation={[0, Math.PI / 2, 0]}>
          <Chevron />
        </group>
        <group position={[0.31, 1.0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <Chevron />
        </group>
        {/* Left */}
        <group position={[-0.31, 1.4, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <Chevron />
        </group>
        <group position={[-0.31, 1.0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <Chevron />
        </group>
      </group>

      {/* Realistic Fins (Blue) setup in a cross config at bottom */}
      {/* 1 - Right */}
      <mesh position={[0.3, -2.4, -0.02]}>
        <extrudeGeometry args={[finShape, extrudeSettings]} />
        <meshStandardMaterial color={blueColor} roughness={0.5} metalness={0.4} />
      </mesh>
      
      {/* 2 - Left */}
      <mesh position={[-0.3, -2.4, 0.02]} rotation={[0, Math.PI, 0]}>
        <extrudeGeometry args={[finShape, extrudeSettings]} />
        <meshStandardMaterial color={blueColor} roughness={0.5} metalness={0.4} />
      </mesh>

      {/* 3 - Front */}
      <mesh position={[0.02, -2.4, 0.3]} rotation={[0, -Math.PI / 2, 0]}>
        <extrudeGeometry args={[finShape, extrudeSettings]} />
        <meshStandardMaterial color={blueColor} roughness={0.5} metalness={0.4} />
      </mesh>

      {/* 4 - Back */}
      <mesh position={[-0.02, -2.4, -0.3]} rotation={[0, Math.PI / 2, 0]}>
        <extrudeGeometry args={[finShape, extrudeSettings]} />
        <meshStandardMaterial color={blueColor} roughness={0.5} metalness={0.4} />
      </mesh>

      {/* Small engine nozzle at bottom */}
      <mesh position={[0, -2.6, 0]}>
        <cylinderGeometry args={[0.2, 0.25, 0.4, 32]} />
        <meshStandardMaterial color={darkBlueColor} roughness={0.2} metalness={0.8} />
      </mesh>
    </group>
  );
};

export default RocketModel;
