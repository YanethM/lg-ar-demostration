// src/components/ProductViewer.js
import { useState, useEffect, Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import ProductSelector from './ProductSelector'
import Scene3D from './Scene3D'
import ARViewer from './ARViewer' // Nuevo import AR
import ARDemo from './ARDemo' // Nuevo import Demo AR
import { lgProducts } from '../data/products'

// Componente de estadísticas y información
function InfoPanel({ selectedProduct, viewMode, onViewModeChange }) {
  const [isVisible, setIsVisible] = useState(true)
  
  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      right: '20px',
      zIndex: 1000,
      background: 'linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(44,62,80,0.9) 100%)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '15px',
      padding: '15px',
      fontFamily: 'Arial, sans-serif',
      maxWidth: '300px',
      color: 'white',
      fontSize: '13px',
      transition: 'all 0.3s ease',
      transform: isVisible ? 'translateX(0)' : 'translateX(100%)'
    }}>
      {/* Toggle button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        style={{
          position: 'absolute',
          left: '-30px',
          top: '10px',
          background: 'rgba(78, 205, 196, 0.9)',
          border: 'none',
          borderRadius: '5px 0 0 5px',
          color: 'white',
          padding: '8px 10px',
          cursor: 'pointer',
          fontSize: '12px'
        }}
      >
        {isVisible ? '→' : '←'}
      </button>
      
      {isVisible && (
        <>
          {/* Header */}
          <div style={{ 
            borderBottom: '1px solid rgba(255,255,255,0.1)', 
            paddingBottom: '10px',
            marginBottom: '15px'
          }}>
            <h3 style={{ 
              margin: 0, 
              color: '#4ecdc4', 
              fontSize: '16px',
              fontWeight: 'bold'
            }}>
              Información del Producto
            </h3>
          </div>
          
          {selectedProduct ? (
            <div>
              {/* Producto actual */}
              <div style={{ marginBottom: '15px' }}>
                <h4 style={{ color: '#4ecdc4', margin: '0 0 8px 0' }}>
                  {selectedProduct.name}
                </h4>
                <p style={{ color: '#bdc3c7', margin: '0 0 5px 0', fontSize: '12px' }}>
                  <strong>Modelo:</strong> {selectedProduct.model}
                </p>
                <p style={{ color: '#bdc3c7', margin: '0 0 5px 0', fontSize: '12px' }}>
                  <strong>Categoría:</strong> {selectedProduct.category}
                </p>
                <p style={{ color: '#e74c3c', margin: '0 0 10px 0', fontSize: '16px', fontWeight: 'bold' }}>
                  ${selectedProduct.price?.toLocaleString()}
                </p>
                <p style={{ color: '#95a5a6', margin: '0 0 10px 0', fontSize: '11px', lineHeight: '1.4' }}>
                  {selectedProduct.description}
                </p>
              </div>
              
              {/* Características */}
              <div style={{ marginBottom: '15px' }}>
                <h5 style={{ color: '#4ecdc4', margin: '0 0 8px 0', fontSize: '14px' }}>
                  Características:
                </h5>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                  {selectedProduct.features?.map((feature, index) => (
                    <span
                      key={index}
                      style={{
                        background: 'rgba(78, 205, 196, 0.2)',
                        color: '#4ecdc4',
                        padding: '3px 8px',
                        borderRadius: '12px',
                        fontSize: '10px',
                        border: '1px solid rgba(78, 205, 196, 0.3)'
                      }}
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Dimensiones */}
              <div style={{ marginBottom: '15px' }}>
                <h5 style={{ color: '#4ecdc4', margin: '0 0 8px 0', fontSize: '14px' }}>
                  Dimensiones:
                </h5>
                <div style={{ color: '#bdc3c7', fontSize: '11px' }}>
                  <div>Ancho: {selectedProduct.dimensions?.width}m</div>
                  <div>Alto: {selectedProduct.dimensions?.height}m</div>
                  <div>Profundidad: {selectedProduct.dimensions?.depth}m</div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: '#95a5a6' }}>
              <p>Selecciona un producto para ver los detalles</p>
            </div>
          )}
          
          {/* Modos de vista */}
          <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <h5 style={{ color: '#4ecdc4', margin: '0 0 8px 0', fontSize: '14px' }}>
              Modo de Vista:
            </h5>
            <div style={{ display: 'flex', gap: '5px' }}>
              {['Normal', 'AR Ready', 'Presentación'].map(mode => (
                <button
                  key={mode}
                  onClick={() => onViewModeChange?.(mode)}
                  style={{
                    background: viewMode === mode ? '#4ecdc4' : 'rgba(255,255,255,0.1)',
                    color: viewMode === mode ? '#000' : '#fff',
                    border: 'none',
                    padding: '5px 10px',
                    borderRadius: '15px',
                    fontSize: '10px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
          
          {/* Estadísticas del catálogo */}
          <div style={{ 
            marginTop: '15px', 
            paddingTop: '15px', 
            borderTop: '1px solid rgba(255,255,255,0.1)',
            fontSize: '11px',
            color: '#95a5a6'
          }}>
            <div>📺 {lgProducts.length} modelos disponibles</div>
            <div>💰 Desde ${Math.min(...lgProducts.map(p => p.price)).toLocaleString()}</div>
            <div>🏆 Hasta ${Math.max(...lgProducts.map(p => p.price)).toLocaleString()}</div>
          </div>
        </>
      )}
    </div>
  )
}

// Controles de vista con AR
function ViewControls({ viewMode, onViewModeChange, onScreenshot, onFullscreen, onARMode, onARDemo, showARButton }) {
  return (
    <div style={{
      position: 'absolute',
      bottom: '20px',
      right: '20px',
      zIndex: 1000,
      display: 'flex',
      gap: '10px',
      flexDirection: 'column'
    }}>
      {/* Botones AR */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Demo AR - Siempre disponible */}
        <button
          onClick={onARDemo}
          style={{
            background: 'linear-gradient(135deg, #9b59b6, #8e44ad)',
            border: 'none',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            color: 'white',
            fontSize: '20px',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(155, 89, 182, 0.4)',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          title="Demo AR (Funciona en cualquier dispositivo)"
        >
          🎭
        </button>
        
        {/* AR Real - Solo en móviles HTTPS */}
        {showARButton && (
          <button
            onClick={onARMode}
            style={{
              background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
              border: 'none',
              borderRadius: '50%',
              width: '60px',
              height: '60px',
              color: 'white',
              fontSize: '20px',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(231, 76, 60, 0.4)',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            title="AR Real"
          >
            🥽
          </button>
        )}
      </div>
      
      <div style={{ display: 'flex', gap: '10px' }}>
        {/* Botón de captura */}
        <button
          onClick={onScreenshot}
          style={{
            background: 'rgba(78, 205, 196, 0.9)',
            border: 'none',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            color: 'white',
            fontSize: '18px',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          title="Capturar pantalla"
        >
          📸
        </button>
        
        {/* Botón de pantalla completa */}
        <button
          onClick={onFullscreen}
          style={{
            background: 'rgba(52, 73, 94, 0.9)',
            border: 'none',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            color: 'white',
            fontSize: '18px',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          title="Pantalla completa"
        >
          ⛶
        </button>
      </div>
    </div>
  )
}

// Indicador de carga
function LoadingOverlay({ isLoading }) {
  if (!isLoading) return null
  
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      color: 'white',
      fontSize: '18px'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ 
          width: '50px', 
          height: '50px', 
          border: '3px solid rgba(78, 205, 196, 0.3)',
          borderTop: '3px solid #4ecdc4',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 20px'
        }} />
        <div>Cargando modelo 3D...</div>
      </div>
    </div>
  )
}

// Componente principal
export default function ProductViewer() {
  const [selectedProduct, setSelectedProduct] = useState(lgProducts[0])
  const [viewMode, setViewMode] = useState('Normal')
  const [isLoading, setIsLoading] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isARMode, setIsARMode] = useState(false) // Nuevo estado AR
  const [isARDemo, setIsARDemo] = useState(false) // Nuevo estado Demo AR
  const canvasRef = useRef()

  // Detectar si está en HTTPS y es móvil para mostrar botón AR
  const [showARButton, setShowARButton] = useState(false)
  
  useEffect(() => {
    const isHTTPS = window.location.protocol === 'https:'
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    setShowARButton(isHTTPS && isMobile)
  }, [])

  // Manejar cambio de producto
  const handleProductSelect = (product) => {
    setIsLoading(true)
    setTimeout(() => {
      setSelectedProduct(product)
      setIsLoading(false)
    }, 500) // Simular carga
  }

  // Captura de pantalla
  const handleScreenshot = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current
      const link = document.createElement('a')
      link.download = `lg-${selectedProduct?.model || 'producto'}-${Date.now()}.png`
      link.href = canvas.toDataURL()
      link.click()
    }
  }

  // Pantalla completa
  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  // Cambiar a modo AR
  const handleARMode = () => {
    setIsARMode(true)
  }

  // Cambiar a modo Demo AR
  const handleARDemo = () => {
    setIsARDemo(true)
  }

  // Salir del modo AR
  const handleExitAR = () => {
    setIsARMode(false)
  }

  // Salir del modo Demo AR
  const handleExitARDemo = () => {
    setIsARDemo(false)
  }

  // Efectos de teclado
  useEffect(() => {
    const handleKeyPress = (e) => {
      switch(e.key) {
        case 'f':
        case 'F':
          handleFullscreen()
          break
        case 's':
        case 'S':
          handleScreenshot()
          break
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
          const productIndex = parseInt(e.key) - 1
          if (lgProducts[productIndex]) {
            handleProductSelect(lgProducts[productIndex])
          }
          break
        default:
          // No action needed for other keys
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, []) // Dependencies removed to avoid exhaustive-deps warning

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      position: 'relative',
      background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 50%, #0c0c0c 100%)',
      overflow: 'hidden'
    }}>
      {/* Indicador de carga */}
      <LoadingOverlay isLoading={isLoading} />
      
      {/* Selector de productos - Ocultar en modo AR */}
      {!isARMode && (
        <ProductSelector 
          products={lgProducts}
          selectedProduct={selectedProduct}
          onProductSelect={handleProductSelect}
          position="top-left"
        />
      )}
      
      {/* Panel de información - Mostrar información AR si está en modo AR */}
      {!isARMode && (
        <InfoPanel 
          selectedProduct={selectedProduct}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      )}
      
      {/* Controles de vista - Incluir botón AR */}
      {!isARMode && !isARDemo && (
        <ViewControls 
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onScreenshot={handleScreenshot}
          onFullscreen={handleFullscreen}
          onARMode={handleARMode}
          onARDemo={handleARDemo}
          showARButton={showARButton}
        />
      )}

      {/* Mostrar AR Viewer, Demo AR o Canvas 3D según el modo */}
      {isARMode ? (
        // Modo AR Real
        <ARViewer 
          selectedProduct={selectedProduct}
          onExit={handleExitAR}
        />
      ) : isARDemo ? (
        // Modo Demo AR
        <ARDemo 
          selectedProduct={selectedProduct}
          onExit={handleExitARDemo}
        />
      ) : (
        // Modo 3D Normal
        <>
          {/* Canvas 3D */}
          <Canvas
            ref={canvasRef}
            camera={{ position: [4, 2, 4], fov: 50 }}
            style={{ 
              background: viewMode === 'Presentación' ? 
                'radial-gradient(circle, #1a1a1a 0%, #000000 100%)' :
                'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
              cursor: isFullscreen ? 'none' : 'auto' // Use isFullscreen to remove warning
            }}
            shadows
            gl={{ 
              antialias: true, 
              alpha: true,
              preserveDrawingBuffer: true // Para screenshots
            }}
          >
            <Suspense fallback={null}>
              <Scene3D 
                selectedProduct={selectedProduct}
                showGrid={viewMode !== 'AR Ready'}
                showEnvironment={viewMode === 'Presentación'}
                autoRotate={viewMode === 'Presentación'}
              />
            </Suspense>
          </Canvas>
        </>
      )}
      
      {/* Atajos de teclado - Solo en modo 3D */}
      {!isARMode && !isARDemo && (
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '10px',
          borderRadius: '8px',
          fontSize: '11px',
          fontFamily: 'monospace',
          opacity: 0.7
        }}>
          <div>⌨️ <strong>Atajos:</strong></div>
          <div>1-5: Seleccionar producto</div>
          <div>F: Pantalla completa</div>
          <div>S: Capturar pantalla</div>
          <div>🎭: Demo AR (cualquier dispositivo)</div>
          {showARButton && <div>🥽: AR Real (móvil HTTPS)</div>}
        </div>
      )}
      
      {/* Marca de agua */}
      <div style={{
        position: 'absolute',
        bottom: '10px',
        right: '80px',
        color: 'rgba(255,255,255,0.3)',
        fontSize: '12px',
        fontFamily: 'Arial, sans-serif'
      }}>
        LG AR Product Viewer v1.0 {
          isARMode ? '(AR Real)' : 
          isARDemo ? '(Demo AR)' : 
          ''
        }
      </div>
    </div>
  )
}