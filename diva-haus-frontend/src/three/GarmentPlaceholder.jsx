import React from 'react';
import { Box, Text } from '@react-three/drei';

/**
 * A visual placeholder for where a garment will be draped on a model.
 * Renders a semi-transparent box with an optional label.
 *
 * @param {Object} props
 * @param {Array<number>} [props.position=[0, 0, 0]] - The position of the placeholder.
 * @param {string} [props.color='rgba(255, 215, 0, 0.5)'] - The color of the placeholder mesh.
 * @param {string} [props.label] - An optional text label to display on the placeholder.
 * @param {Array<number>} [props.size=[1, 1, 0.1]] - The size of the placeholder box.
 */
function GarmentPlaceholder({ position = [0, 0, 0], color = '#FFD700', label, size = [1, 1, 0.1] }) {
  return (
    <group position={position}>
      <Box args={size}>
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.5}
          metalness={0.2}
          roughness={0.8}
        />
      </Box>
      {label && (
        <Text
          position={[0, 0, size[2] / 2 + 0.01]}
          fontSize={0.1}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      )}
    </group>
  );
}

export default GarmentPlaceholder;
