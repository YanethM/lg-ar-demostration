// src/components/ARViewer.js
import { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { ARButton, XR } from '@react-three/xr'
import TVModel from './TVModel'

// Detector de soporte AR
function useARSupport() {
  const [isARSupported, setIsARSupported] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkARSupport = async () => {
      try {
        if ('xr' in navigator) {
          const isSupported = await navigator.xr.isSessionSupported('immersive-ar')
          setIsARSupported(isSupported)
        } else {
          setIsARSupported(false)
        }
      } catch (error) {
        console.log('AR not supported:', error)
        setIsARSupported(false)
      } finally {
        setIsChecking(false)
      }
    }

    checkARSupport()
  }, [])

  return { isARSupported, isChecking }
}

// Escena AR específica
function ARScene({ selectedProduct }) {
  return (
    <>
      {/* Iluminación AR optimizada */}
      <ambientLight intensity={0.8} />
      <directionalLight 
        position={[0, 10, 5]} 
        intensity={1}
        castShadow
      />
      
      {/* Modelo del producto en AR */}
      {selectedProduct && (
        <TVModel 
          product={selectedProduct}
          position={[0, 0, -1.5]} // Más cerca del usuario en AR
          scale={0.8} // Más pequeño para AR
          interactive={true}
        />
      )}
    </>
  )
}

// Información AR overlay
function AROverlay({ selectedProduct, onClose }) {
  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      left: '20px',
      right: '20px',
      zIndex: 1000,
      background: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(10px)',
      borderRadius: '15px',
      padding: '15px',
      color: 'white',
      fontSize: '14px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ color: '#4ecdc4', margin: '0 0 5px 0' }}>
            Modo AR Activo
          </h3>
          <p style={{ margin: 0, fontSize: '12px', color: '#bdc3c7' }}>
            {selectedProduct?.name} - ${selectedProduct?.price?.toLocaleString()}
          </p>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'rgba(231, 76, 60, 0.8)',
            border: 'none',
            borderRadius: '50%',
            width: '35px',
            height: '35px',
            color: 'white',
            fontSize: '18px',
            cursor: 'pointer'
          }}
        >
          ×
        </button>
      </div>
      
      {/* Instrucciones AR */}
      <div style={{ 
        marginTop: '10px', 
        padding: '10px', 
        background: 'rgba(78, 205, 196, 0.2)',
        borderRadius: '8px',
        fontSize: '11px'
      }}>
        📱 <strong>Instrucciones AR:</strong>
        <br />• Mueve el teléfono para encontrar una superficie
        <br />• Toca para colocar el TV
        <br />• Pellizca para escalar
        <br />• Arrastra para mover
      </div>
    </div>
  )
}

// Componente principal AR
export default function ARViewer({ selectedProduct, onExit }) {
  const { isARSupported, isChecking } = useARSupport()
  const [isInAR, setIsInAR] = useState(false)

  // Detectar entrada/salida de AR
  useEffect(() => {
    const handleSessionStart = () => setIsInAR(true)
    const handleSessionEnd = () => setIsInAR(false)

    if ('xr' in navigator) {
      navigator.xr?.addEventListener?.('sessionstart', handleSessionStart)
      navigator.xr?.addEventListener?.('sessionend', handleSessionEnd)
    }

    return () => {
      if ('xr' in navigator) {
        navigator.xr?.removeEventListener?.('sessionstart', handleSessionStart)
        navigator.xr?.removeEventListener?.('sessionend', handleSessionEnd)
      }
    }
  }, [])

  // Estado de carga
  if (isChecking) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '200px',
        color: '#4ecdc4'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '3px solid rgba(78, 205, 196, 0.3)',
            borderTop: '3px solid #4ecdc4',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 10px'
          }} />
          Verificando soporte AR...
        </div>
      </div>
    )
  }

  // Si AR no está soportado
  if (!isARSupported) {
    return (
      <div style={{
        background: 'rgba(231, 76, 60, 0.1)',
        border: '1px solid rgba(231, 76, 60, 0.3)',
        borderRadius: '10px',
        padding: '20px',
        textAlign: 'center',
        color: 'white'
      }}>
        <h3 style={{ color: '#e74c3c', margin: '0 0 10px 0' }}>
          AR No Disponible
        </h3>
        <p style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#bdc3c7' }}>
          Este dispositivo no soporta WebXR AR o necesitas:
        </p>
        <ul style={{ textAlign: 'left', color: '#95a5a6', fontSize: '13px' }}>
          <li>Chrome 81+ en Android</li>
          <li>Conectar via HTTPS</li>
          <li>Dispositivo compatible con ARCore</li>
        </ul>
        <button
          onClick={onExit}
          style={{
            marginTop: '15px',
            background: '#3498db',
            border: 'none',
            borderRadius: '20px',
            color: 'white',
            padding: '10px 20px',
            cursor: 'pointer'
          }}
        >
          Volver al Viewer 3D
        </button>
      </div>
    )
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* Overlay de información en AR */}
      {isInAR && (
        <AROverlay 
          selectedProduct={selectedProduct}
          onClose={onExit}
        />
      )}
      
      {/* Botón AR - Solo aparece cuando no está en sesión AR */}
      {!isInAR && (
        <>
          <ARButton
            style={{
              position: 'absolute',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              padding: '15px 30px',
              fontSize: '16px',
              background: 'linear-gradient(135deg, #4ecdc4, #44a08d)',
              color: 'white',
              border: 'none',
              borderRadius: '30px',
              cursor: 'pointer',
              zIndex: 1000,
              boxShadow: '0 8px 25px rgba(78, 205, 196, 0.4)',
              fontWeight: 'bold'
            }}
          />
          
          {/* Información previa al AR */}
          <div style={{
            position: 'absolute',
            bottom: '100px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.8)',
            borderRadius: '15px',
            padding: '15px',
            color: 'white',
            textAlign: 'center',
            maxWidth: '300px',
            zIndex: 1000
          }}>
            <h4 style={{ color: '#4ecdc4', margin: '0 0 8px 0' }}>
              Listo para AR
            </h4>
            <p style={{ margin: '0 0 8px 0', fontSize: '13px' }}>
              Producto: <strong>{selectedProduct?.name}</strong>
            </p>
            <p style={{ margin: 0, fontSize: '12px', color: '#bdc3c7' }}>
              Toca "Iniciar AR" para visualizar en tu espacio
            </p>
          </div>
        </>
      )}

      {/* Canvas AR */}
      <Canvas
        style={{ 
          background: isInAR ? 'transparent' : '#000',
          width: '100%',
          height: '100%'
        }}
      >
        <XR referenceSpace="local-floor">
          <ARScene selectedProduct={selectedProduct} />
        </XR>
      </Canvas>
    </div>
  )
}