// src/components/ProductViewer.js
import { useState, useEffect, Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import ProductSelector from './ProductSelector'
import Scene3D from './Scene3D'
import ARViewer from './ARViewer' // Nuevo import AR
import ARDemo from './ARDemo' // Nuevo import Demo AR
import { lgProducts } from '../data/products'

// Componente de estadísticas y información responsive
function InfoPanel({ selectedProduct, viewMode, onViewModeChange }) {
  const [isVisible, setIsVisible] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768
      setIsMobile(mobile)
      // En móvil, ocultar por defecto para ahorrar espacio
      if (mobile && isVisible) {
        setIsVisible(false)
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [isVisible])

  const containerStyle = {
    position: 'absolute',
    top: isMobile ? '10px' : '20px',
    right: isMobile ? '10px' : '20px',
    zIndex: 1000,
    background: 'linear-gradient(135deg, rgba(0,0,0,0.95) 0%, rgba(44,62,80,0.95) 100%)',
    backdropFilter: 'blur(15px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: isMobile ? '12px' : '15px',
    padding: isMobile ? '12px' : '15px',
    fontFamily: 'Arial, sans-serif',
    maxWidth: isMobile ? 'calc(100vw - 40px)' : '320px',
    minWidth: isMobile ? '200px' : '280px',
    color: 'white',
    fontSize: isMobile ? '12px' : '13px',
    transition: 'all 0.3s ease',
    transform: isVisible ? 'translateX(0)' : `translateX(${isMobile ? '100%' : '100%'})`
  }

  const toggleButtonStyle = {
    position: 'absolute',
    left: isMobile ? '-35px' : '-30px',
    top: '10px',
    background: 'rgba(78, 205, 196, 0.9)',
    border: 'none',
    borderRadius: '5px 0 0 5px',
    color: 'white',
    padding: isMobile ? '6px 8px' : '8px 10px',
    cursor: 'pointer',
    fontSize: isMobile ? '10px' : '12px',
    fontWeight: 'bold',
    touchAction: 'manipulation',
    userSelect: 'none',
    minHeight: isMobile ? '36px' : '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }

  const headerStyle = {
    borderBottom: '1px solid rgba(255,255,255,0.1)', 
    paddingBottom: isMobile ? '8px' : '10px',
    marginBottom: isMobile ? '12px' : '15px'
  }

  const titleStyle = {
    margin: 0, 
    color: '#4ecdc4', 
    fontSize: isMobile ? '14px' : '16px',
    fontWeight: 'bold'
  }

  const productSectionStyle = {
    marginBottom: isMobile ? '12px' : '15px'
  }

  const productNameStyle = {
    color: '#4ecdc4', 
    margin: '0 0 6px 0',
    fontSize: isMobile ? '13px' : '14px',
    fontWeight: 'bold',
    lineHeight: '1.2'
  }

  const productDetailStyle = {
    color: '#bdc3c7', 
    margin: '0 0 4px 0', 
    fontSize: isMobile ? '10px' : '11px',
    lineHeight: '1.3'
  }

  const priceStyle = {
    color: '#e74c3c', 
    margin: '0 0 8px 0', 
    fontSize: isMobile ? '14px' : '16px', 
    fontWeight: 'bold'
  }

  const descriptionStyle = {
    color: '#95a5a6', 
    margin: '0 0 8px 0', 
    fontSize: isMobile ? '9px' : '10px', 
    lineHeight: '1.4'
  }

  const sectionTitleStyle = {
    color: '#4ecdc4', 
    margin: '0 0 6px 0', 
    fontSize: isMobile ? '12px' : '14px',
    fontWeight: 'bold'
  }

  const featureTagStyle = {
    background: 'rgba(78, 205, 196, 0.2)',
    color: '#4ecdc4',
    padding: isMobile ? '2px 6px' : '3px 8px',
    borderRadius: '10px',
    fontSize: isMobile ? '8px' : '9px',
    border: '1px solid rgba(78, 205, 196, 0.3)',
    display: 'inline-block',
    margin: '2px'
  }

  const dimensionsStyle = {
    color: '#bdc3c7', 
    fontSize: isMobile ? '9px' : '10px',
    lineHeight: '1.3'
  }

  const viewModeButtonStyle = (mode) => ({
    background: viewMode === mode ? '#4ecdc4' : 'rgba(255,255,255,0.1)',
    color: viewMode === mode ? '#000' : '#fff',
    border: 'none',
    padding: isMobile ? '4px 8px' : '5px 10px',
    borderRadius: '12px',
    fontSize: isMobile ? '8px' : '9px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    margin: '2px',
    touchAction: 'manipulation',
    userSelect: 'none'
  })

  const statsStyle = {
    marginTop: isMobile ? '12px' : '15px', 
    paddingTop: isMobile ? '12px' : '15px', 
    borderTop: '1px solid rgba(255,255,255,0.1)',
    fontSize: isMobile ? '9px' : '10px',
    color: '#95a5a6',
    lineHeight: '1.4'
  }

  return (
    <div style={containerStyle}>
      {/* Toggle button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        style={toggleButtonStyle}
        aria-label={isVisible ? 'Ocultar panel' : 'Mostrar panel'}
      >
        {isVisible ? (isMobile ? '→' : '→') : (isMobile ? '←' : '←')}
      </button>
      
      {isVisible && (
        <>
          {/* Header */}
          <div style={headerStyle}>
            <h3 style={titleStyle}>
              {isMobile ? 'Info Producto' : 'Información del Producto'}
            </h3>
          </div>
          
          {selectedProduct ? (
            <div>
              {/* Producto actual */}
              <div style={productSectionStyle}>
                <h4 style={productNameStyle}>
                  {isMobile ? 
                    selectedProduct.name.split(' ').slice(0, 3).join(' ') : 
                    selectedProduct.name
                  }
                </h4>
                <p style={productDetailStyle}>
                  <strong>Modelo:</strong> {selectedProduct.model}
                </p>
                <p style={productDetailStyle}>
                  <strong>Categoría:</strong> {selectedProduct.category}
                </p>
                <p style={priceStyle}>
                  ${selectedProduct.price?.toLocaleString()}
                </p>
                {!isMobile && (
                  <p style={descriptionStyle}>
                    {selectedProduct.description}
                  </p>
                )}
              </div>
              
              {/* Características */}
              <div style={{ marginBottom: isMobile ? '12px' : '15px' }}>
                <h5 style={sectionTitleStyle}>
                  Características:
                </h5>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
                  {selectedProduct.features?.slice(0, isMobile ? 4 : 6).map((feature, index) => (
                    <span key={index} style={featureTagStyle}>
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Dimensiones - Solo mostrar si no es móvil */}
              {!isMobile && (
                <div style={{ marginBottom: '15px' }}>
                  <h5 style={sectionTitleStyle}>
                    Dimensiones:
                  </h5>
                  <div style={dimensionsStyle}>
                    <div>Ancho: {selectedProduct.dimensions?.width}m</div>
                    <div>Alto: {selectedProduct.dimensions?.height}m</div>
                    <div>Profundidad: {selectedProduct.dimensions?.depth}m</div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: '#95a5a6' }}>
              <p>Selecciona un producto para ver los detalles</p>
            </div>
          )}
          
          {/* Modos de vista - Solo mostrar si no es móvil */}
          {!isMobile && (
            <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <h5 style={sectionTitleStyle}>
                Modo de Vista:
              </h5>
              <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap' }}>
                {['Normal', 'AR Ready', 'Presentación'].map(mode => (
                  <button
                    key={mode}
                    onClick={() => onViewModeChange?.(mode)}
                    style={viewModeButtonStyle(mode)}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Estadísticas del catálogo - Simplificadas en móvil */}
          <div style={statsStyle}>
            <div>{lgProducts.length} modelos disponibles</div>
            {!isMobile && (
              <>
                <div>Desde ${Math.min(...lgProducts.map(p => p.price)).toLocaleString()}</div>
                <div>Hasta ${Math.max(...lgProducts.map(p => p.price)).toLocaleString()}</div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}

// Controles de vista con AR responsive
function ViewControls({ viewMode, onViewModeChange, onScreenshot, onFullscreen, onARMode, onARDemo, showARButton }) {
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
    right: isMobile ? '15px' : '20px',
    zIndex: 1000,
    display: 'flex',
    gap: isMobile ? '8px' : '10px',
    flexDirection: 'column',
    alignItems: 'flex-end'
  }

  const arGroupStyle = {
    display: 'flex', 
    flexDirection: isMobile ? 'row' : 'column', 
    gap: isMobile ? '8px' : '10px'
  }

  const controlGroupStyle = {
    display: 'flex', 
    gap: isMobile ? '8px' : '10px',
    flexDirection: isMobile ? 'row' : 'row'
  }

  const baseButtonStyle = {
    border: 'none',
    borderRadius: '50%',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: isMobile ? '16px' : '18px',
    fontWeight: 'bold',
    userSelect: 'none',
    touchAction: 'manipulation',
    // Mejorar touch targets en móvil
    minWidth: isMobile ? '50px' : '60px',
    minHeight: isMobile ? '50px' : '60px'
  }

  const demoARButtonStyle = {
    ...baseButtonStyle,
    background: 'linear-gradient(135deg, #9b59b6, #8e44ad)',
    width: isMobile ? '50px' : '60px',
    height: isMobile ? '50px' : '60px',
    boxShadow: '0 4px 15px rgba(155, 89, 182, 0.4)',
    position: 'relative'
  }

  const realARButtonStyle = {
    ...baseButtonStyle,
    background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
    width: isMobile ? '50px' : '60px',
    height: isMobile ? '50px' : '60px',
    boxShadow: '0 4px 15px rgba(231, 76, 60, 0.4)',
    position: 'relative'
  }

  const screenshotButtonStyle = {
    ...baseButtonStyle,
    background: 'rgba(78, 205, 196, 0.9)',
    width: isMobile ? '45px' : '50px',
    height: isMobile ? '45px' : '50px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
    fontSize: isMobile ? '14px' : '16px'
  }

  const fullscreenButtonStyle = {
    ...baseButtonStyle,
    background: 'rgba(52, 73, 94, 0.9)',
    width: isMobile ? '45px' : '50px',
    height: isMobile ? '45px' : '50px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
    fontSize: isMobile ? '14px' : '16px'
  }

  const badgeStyle = {
    position: 'absolute',
    top: '-6px',
    right: '-6px',
    borderRadius: '50%',
    width: isMobile ? '16px' : '20px',
    height: isMobile ? '16px' : '20px',
    fontSize: isMobile ? '8px' : '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold'
  }

  return (
    <div style={containerStyle}>
      {/* Botones AR */}
      <div style={arGroupStyle}>
        {/* Demo AR - Siempre disponible */}
        <button
          onClick={onARDemo}
          style={demoARButtonStyle}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          title={isMobile ? "Demo AR" : "🎭 DEMO AR - Funciona en cualquier dispositivo (recomendado)"}
          aria-label="Activar Demo AR"
        >
          🎭
          <div style={{
            ...badgeStyle,
            background: '#27ae60'
          }}>
            ✓
          </div>
        </button>
        
        {/* AR Real - Solo en móviles HTTPS */}
        {showARButton && (
          <button
            onClick={onARMode}
            style={realARButtonStyle}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            title={isMobile ? "AR Real" : "🥽 AR REAL - Requiere configuración especial"}
            aria-label="Activar AR Real"
          >
            🥽
            <div style={{
              ...badgeStyle,
              background: '#f39c12'
            }}>
              ⚠️
            </div>
          </button>
        )}
      </div>
      
      {/* Controles secundarios */}
      <div style={controlGroupStyle}>
        {/* Botón de captura */}
        <button
          onClick={onScreenshot}
          style={screenshotButtonStyle}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          title="Capturar pantalla"
          aria-label="Capturar pantalla"
        >
          📸
        </button>
        
        {/* Botón de pantalla completa */}
        <button
          onClick={onFullscreen}
          style={fullscreenButtonStyle}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          title="Pantalla completa"
          aria-label="Pantalla completa"
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

// Componente principal responsive
export default function ProductViewer() {
  const [selectedProduct, setSelectedProduct] = useState(lgProducts[0])
  const [viewMode, setViewMode] = useState('Normal')
  const [isLoading, setIsLoading] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isARMode, setIsARMode] = useState(false) // Nuevo estado AR
  const [isARDemo, setIsARDemo] = useState(false) // Nuevo estado Demo AR
  const [isMobile, setIsMobile] = useState(false) // Estado móvil
  const canvasRef = useRef()

  // Detectar si está en HTTPS y es móvil para mostrar botón AR
  const [showARButton, setShowARButton] = useState(false)
  
  useEffect(() => {
    const checkDevice = () => {
      const mobile = window.innerWidth <= 768
      const isHTTPS = window.location.protocol === 'https:'
      const isMobileDevice = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      
      setIsMobile(mobile)
      setShowARButton(isHTTPS && isMobileDevice)
    }
    
    checkDevice()
    window.addEventListener('resize', checkDevice)
    return () => window.removeEventListener('resize', checkDevice)
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
      {!isARMode && !isARDemo && (
        <ProductSelector 
          products={lgProducts}
          selectedProduct={selectedProduct}
          onProductSelect={handleProductSelect}
          position="top-left"
        />
      )}
      
      {/* Panel de información - Mostrar información AR si está en modo AR */}
      {!isARMode && !isARDemo && (
        <InfoPanel 
          selectedProduct={selectedProduct}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      )}

      {/* Indicador de modo actual - Responsive */}
      {(isARMode || isARDemo) && (
        <div style={{
          position: 'absolute',
          top: isMobile ? '15px' : '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.9)',
          color: 'white',
          padding: isMobile ? '8px 16px' : '10px 20px',
          borderRadius: isMobile ? '15px' : '20px',
          fontSize: isMobile ? '12px' : '14px',
          fontWeight: 'bold',
          zIndex: 1000,
          textAlign: 'center',
          maxWidth: isMobile ? 'calc(100vw - 40px)' : 'auto',
          boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
        }}>
          {isARMode ? '🥽 AR REAL ACTIVO' : '🎭 DEMO AR ACTIVO'}
          <br />
          <span style={{ 
            fontSize: isMobile ? '10px' : '12px', 
            opacity: 0.8,
            display: isMobile ? 'block' : 'inline'
          }}>
            {isMobile ? 
              selectedProduct?.name?.split(' ').slice(0, 3).join(' ') : 
              selectedProduct?.name
            }
          </span>
        </div>
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

      {/* Explicación de botones AR - Responsive */}
      {!isARMode && !isARDemo && !isMobile && (
        <div style={{
          position: 'absolute',
          bottom: '130px',
          right: '20px',
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '12px',
          borderRadius: '10px',
          fontSize: '11px',
          maxWidth: '200px',
          zIndex: 999,
          opacity: 0.9
        }}>
          <div style={{ color: '#4ecdc4', fontWeight: 'bold', marginBottom: '8px' }}>
            Opciones AR:
          </div>
          <div style={{ marginBottom: '6px' }}>
            <span style={{ color: '#9b59b6' }}>🎭</span> <strong>Demo AR</strong> - Funciona siempre
          </div>
          {showARButton && (
            <div>
              <span style={{ color: '#e74c3c' }}>🥽</span> <strong>AR Real</strong> - Necesita configuración
            </div>
          )}
          {!showARButton && (
            <div style={{ color: '#95a5a6', fontSize: '10px' }}>
              AR Real no disponible en este dispositivo
            </div>
          )}
        </div>
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
      
      {/* Atajos de teclado - Solo en desktop */}
      {!isARMode && !isARDemo && !isMobile && (
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
          opacity: 0.7,
          maxWidth: '200px'
        }}>
          <div>⌨️ <strong>Atajos:</strong></div>
          <div>1-5: Seleccionar producto</div>
          <div>F: Pantalla completa</div>
          <div>S: Capturar pantalla</div>
          <div>🎭: Demo AR (cualquier dispositivo)</div>
          {showARButton && <div>🥽: AR Real (móvil HTTPS)</div>}
        </div>
      )}

      {/* Instrucciones touch para móvil */}
      {!isARMode && !isARDemo && isMobile && (
        <div style={{
          position: 'absolute',
          bottom: '85px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '15px',
          fontSize: '10px',
          textAlign: 'center',
          opacity: 0.8,
          maxWidth: 'calc(100vw - 40px)'
        }}>
          👆 Arrastra para rotar • 🤏 Pellizca para zoom
        </div>
      )}
      
      {/* Marca de agua - Responsive */}
      <div style={{
        position: 'absolute',
        bottom: isMobile ? '5px' : '10px',
        right: isMobile ? '10px' : '80px',
        color: 'rgba(255,255,255,0.3)',
        fontSize: isMobile ? '10px' : '12px',
        fontFamily: 'Arial, sans-serif',
        textAlign: 'right'
      }}>
        LG AR Product Viewer v1.0
        {isMobile && <br />}
        {!isMobile && ' '}
        {isARMode ? '(AR Real)' : 
         isARDemo ? '(Demo AR)' : 
         ''}
      </div>
    </div>
  )
}