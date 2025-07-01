// src/components/TVModel.js
import { useState, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, RoundedBox } from '@react-three/drei'

export default function TVModel({ 
  product, 
  position = [0, 0, 0], 
  rotation = [0, 0, 0],
  scale = 1,
  interactive = true 
}) {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)
  const [selected, setSelected] = useState(false)
  const [floating, setFloating] = useState(false)

  // Animación de flotación cuando está seleccionado
  useFrame((state) => {
    if (meshRef.current && floating) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1
    }
  })

  const handleClick = () => {
    if (!interactive) return
    setSelected(!selected)
    setFloating(!floating)
  }

  const handlePointerOver = () => {
    if (!interactive) return
    setHovered(true)
    document.body.style.cursor = 'pointer'
  }

  const handlePointerOut = () => {
    if (!interactive) return
    setHovered(false)
    document.body.style.cursor = 'auto'
  }

  // Calcular dimensiones basadas en el producto
  const tvWidth = product.dimensions?.width || 2.0
  const tvHeight = product.dimensions?.height || 1.2
  const tvDepth = product.dimensions?.depth || 0.1

  return (
    <group 
      ref={meshRef}
      position={position} 
      rotation={rotation}
      scale={selected ? scale * 1.15 : scale}
    >
      {/* Marco del TV */}
      <RoundedBox
        args={[tvWidth, tvHeight, tvDepth]}
        radius={0.02}
        smoothness={4}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <meshStandardMaterial 
          color={
            hovered ? '#ff6b6b' : 
            selected ? '#4ecdc4' : 
            product.color || '#2c3e50'
          }
          metalness={0.7}
          roughness={0.2}
        />
      </RoundedBox>
      
      {/* Pantalla negra */}
      <RoundedBox 
        args={[tvWidth * 0.9, tvHeight * 0.85, 0.01]} 
        position={[0, 0, tvDepth/2 + 0.005]}
        radius={0.01}
      >
        <meshStandardMaterial color="#000000" />
      </RoundedBox>
      
      {/* Reflejo sutil en la pantalla */}
      <RoundedBox 
        args={[tvWidth * 0.85, tvHeight * 0.8, 0.005]} 
        position={[0, 0, tvDepth/2 + 0.01]}
        radius={0.01}
      >
        <meshStandardMaterial 
          color="#111111" 
          transparent 
          opacity={0.3}
          metalness={0.9}
          roughness={0.1}
        />
      </RoundedBox>

      {/* Base/Soporte del TV */}
      <RoundedBox 
        args={[tvWidth * 0.3, 0.08, 0.25]} 
        position={[0, -tvHeight/2 - 0.08, 0]}
        radius={0.02}
      >
        <meshStandardMaterial 
          color="#333333" 
          metalness={0.8}
          roughness={0.3}
        />
      </RoundedBox>

      {/* Logo LG simulado */}
      <Text
        position={[0, -tvHeight/2 + 0.1, tvDepth/2 + 0.01]}
        fontSize={0.08}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-bold.woff"
      >
        LG
      </Text>

      {/* Información del producto (aparece al hover o select) */}
      {(hovered || selected) && (
        <group position={[0, tvHeight/2 + 0.5, 0]}>
          {/* Panel de información */}
          <RoundedBox 
            args={[2.5, 1, 0.05]} 
            radius={0.05}
          >
            <meshStandardMaterial 
              color="#000000" 
              transparent 
              opacity={0.8}
            />
          </RoundedBox>
          
          {/* Texto principal */}
          <Text
            position={[0, 0.25, 0.03]}
            fontSize={0.15}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            maxWidth={2.2}
          >
            {product.name}
          </Text>
          
          {/* Precio */}
          <Text
            position={[0, 0.05, 0.03]}
            fontSize={0.12}
            color="#4ecdc4"
            anchorX="center"
            anchorY="middle"
          >
            ${product.price?.toLocaleString()}
          </Text>
          
          {/* Características */}
          <Text
            position={[0, -0.15, 0.03]}
            fontSize={0.08}
            color="#cccccc"
            anchorX="center"
            anchorY="middle"
            maxWidth={2.2}
          >
            {product.features?.join(' • ')}
          </Text>
          
          {/* Modelo */}
          <Text
            position={[0, -0.3, 0.03]}
            fontSize={0.07}
            color="#888888"
            anchorX="center"
            anchorY="middle"
          >
            Modelo: {product.model}
          </Text>
        </group>
      )}

      {/* Indicador de selección en el suelo */}
      {selected && (
        <mesh 
          position={[0, -tvHeight/2 - 0.3, 0]} 
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[tvWidth * 0.6, tvWidth * 0.7, 32]} />
          <meshBasicMaterial 
            color="#4ecdc4" 
            transparent 
            opacity={0.6}
            side="DoubleSide"
          />
        </mesh>
      )}

      {/* Partículas flotantes cuando está seleccionado */}
      {selected && (
        <>
          {[...Array(8)].map((_, i) => (
            <mesh
              key={i}
              position={[
                (Math.random() - 0.5) * tvWidth * 2,
                (Math.random() - 0.5) * tvHeight * 2,
                (Math.random() - 0.5) * 2
              ]}
            >
              <sphereGeometry args={[0.02, 8, 8]} />
              <meshBasicMaterial 
                color="#4ecdc4" 
                transparent 
                opacity={0.7}
              />
            </mesh>
          ))}
        </>
      )}
    </group>
  )
}