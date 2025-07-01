// src/components/ARDemo.js - Simulador AR para demostración responsive
import { useState, useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import TVModel from './TVModel'

// Simulador de cámara de fondo
function CameraBackground() {
  const meshRef = useRef()
  
  useFrame((state) => {
    if (meshRef.current) {
      // Simular movimiento de cámara
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.02
      meshRef.current.rotation.y = Math.cos(state.clock.elapsedTime * 0.1) * 0.02
    }
  })
  
  return (
    <mesh ref={meshRef} position={[0, 0, -20]} scale={[40, 30, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial 
        color="#1a1a1a" 
        transparent 
        opacity={0.8}
      />
      {/* Simulación de habitación */}
      <Text
        position={[0, 3, 0.1]}
        fontSize={2}
        color="#333333"
        anchorX="center"
      >
        HABITACIÓN SIMULADA
      </Text>
      <Text
        position={[0, -3, 0.1]}
        fontSize={1}
        color="#555555"
        anchorX="center"
      >
        (En AR real vería el espacio actual)
      </Text>
    </mesh>
  )
}

// Grid de suelo AR
function ARFloor() {
  return (
    <>
      <gridHelper 
        args={[20, 20]} 
        position={[0, -1.5, 0]}
        color="#4ecdc4"
        opacity={0.3}
      />
      <mesh position={[0, -1.51, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshBasicMaterial 
          color="#000000" 
          transparent 
          opacity={0.2}
        />
      </mesh>
    </>
  )
}

// Indicadores AR
function ARIndicators() {
  const [step, setStep] = useState(0)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setStep(s => (s + 1) % 4)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const steps = [
    "Detectando superficie...",
    "Superficie encontrada",
    "Toca para colocar TV",
    "TV colocado en AR"
  ]

  return (
    <Text
      position={[0, 3, 0]}
      fontSize={0.3}
      color="#4ecdc4"
      anchorX="center"
      anchorY="middle"
    >
      {steps[step]}
    </Text>
  )
}

// Controles AR simulados responsive
function ARControls({ onPlaceObject, onScaleObject, isObjectPlaced }) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const containerStyle = {
    position: 'absolute',
    bottom: isMobile ? '15px' : '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: isMobile ? '8px' : '10px',
    zIndex: 1000,
    flexDirection: isMobile ? 'column' : 'row',
    alignItems: 'center'
  }

  const buttonStyle = {
    background: 'linear-gradient(135deg, #4ecdc4, #44a08d)',
    border: 'none',
    borderRadius: isMobile ? '20px' : '25px',
    color: 'white',
    padding: isMobile ? '12px 24px' : '15px 30px',
    fontSize: isMobile ? '14px' : '16px',
    cursor: 'pointer',
    fontWeight: 'bold',
    boxShadow: '0 4px 15px rgba(78, 205, 196, 0.4)',
    touchAction: 'manipulation',
    userSelect: 'none',
    minHeight: isMobile ? '44px' : 'auto'
  }

  const secondaryButtonStyle = {
    background: 'rgba(52, 73, 94, 0.9)',
    border: 'none',
    borderRadius: isMobile ? '15px' : '20px',
    color: 'white',
    padding: isMobile ? '8px 16px' : '10px 20px',
    cursor: 'pointer',
    fontSize: isMobile ? '12px' : '14px',
    touchAction: 'manipulation',
    userSelect: 'none',
    minHeight: isMobile ? '40px' : 'auto'
  }

  return (
    <div style={containerStyle}>
      {!isObjectPlaced ? (
        <button onClick={onPlaceObject} style={buttonStyle}>
          👆 Colocar TV
        </button>
      ) : (
        <div style={{ 
          display: 'flex', 
          gap: isMobile ? '8px' : '10px',
          flexDirection: isMobile ? 'row' : 'row',
          justifyContent: 'center'
        }}>
          <button
            onClick={() => onScaleObject(0.8)}
            style={secondaryButtonStyle}
          >
            🔽 {isMobile ? 'Menor' : 'Más pequeño'}
          </button>
          <button
            onClick={() => onScaleObject(1.2)}
            style={secondaryButtonStyle}
          >
            🔼 {isMobile ? 'Mayor' : 'Más grande'}
          </button>
        </div>
      )}
    </div>
  )
}

// Componente principal del simulador
export default function ARDemo({ selectedProduct, onExit }) {
  const [isObjectPlaced, setIsObjectPlaced] = useState(false)
  const [objectScale, setObjectScale] = useState(1)
  const [cameraMovement, setCameraMovement] = useState(true)

  const handlePlaceObject = () => {
    setIsObjectPlaced(true)
    setCameraMovement(false)
  }

  const handleScaleObject = (scaleFactor) => {
    setObjectScale(prev => Math.max(0.5, Math.min(2, prev * scaleFactor)))
  }

  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      position: 'relative',
      background: '#000000'
    }}>
      {/* Header AR Demo */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        right: '20px',
        zIndex: 1000,
        background: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(10px)',
        borderRadius: '15px',
        padding: '15px',
        color: 'white',
        textAlign: 'center'
      }}>
        <h3 style={{ color: '#4ecdc4', margin: '0 0 5px 0' }}>
          📱 DEMO AR - Simulación
        </h3>
        <p style={{ margin: '0 0 8px 0', fontSize: '13px' }}>
          {selectedProduct?.name} - ${selectedProduct?.price?.toLocaleString()}
        </p>
        <p style={{ margin: 0, fontSize: '11px', color: '#bdc3c7' }}>
          Simula la experiencia AR real en cualquier dispositivo
        </p>
        
        <button
          onClick={onExit}
          style={{
            position: 'absolute',
            top: '10px',
            right: '15px',
            background: 'rgba(231, 76, 60, 0.8)',
            border: 'none',
            borderRadius: '50%',
            width: '30px',
            height: '30px',
            color: 'white',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          ×
        </button>
      </div>

      {/* Canvas AR Simulado */}
      <Canvas
        camera={{ position: cameraMovement ? [2, 1, 3] : [0, 1.5, 3], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        {/* Fondo simulado de cámara */}
        <CameraBackground />
        
        {/* Iluminación AR */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 5]} intensity={0.8} />
        <spotLight 
          position={[0, 15, 0]} 
          intensity={0.5} 
          angle={0.3} 
          penumbra={1}
        />
        
        {/* Suelo AR */}
        <ARFloor />
        
        {/* Indicadores de estado */}
        <ARIndicators />
        
        {/* Producto en AR */}
        {selectedProduct && isObjectPlaced && (
          <group position={[0, 0, -2]} scale={objectScale}>
            <TVModel 
              product={selectedProduct}
              position={[0, 0, 0]}
              scale={1}
              interactive={true}
            />
            
            {/* Indicador de que está en AR */}
            <Text
              position={[0, -2, 0]}
              fontSize={0.2}
              color="#4ecdc4"
              anchorX="center"
            >
              ↑ TV en tu espacio (AR simulado) ↑
            </Text>
          </group>
        )}
        
        {/* Mensaje antes de colocar */}
        {!isObjectPlaced && (
          <Text
            position={[0, 0, -2]}
            fontSize={0.4}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            transparent
            opacity={0.8}
          >
            Toca "Colocar TV" para simular AR
          </Text>
        )}
      </Canvas>
      
      {/* Controles AR */}
      <ARControls 
        onPlaceObject={handlePlaceObject}
        onScaleObject={handleScaleObject}
        isObjectPlaced={isObjectPlaced}
      />
      
      {/* Información de la demo */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        background: 'rgba(0,0,0,0.7)',
        borderRadius: '10px',
        padding: '10px',
        color: 'white',
        fontSize: '11px',
        maxWidth: '200px'
      }}>
        <strong style={{ color: '#4ecdc4' }}>Modo Demo AR:</strong>
        <br />• Simula experiencia AR real
        <br />• Funciona en cualquier dispositivo
        <br />• Para testing y presentaciones
        <br />• En AR real vería su habitación
      </div>
    </div>
  )
}