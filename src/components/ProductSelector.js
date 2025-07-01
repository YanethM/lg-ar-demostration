// src/components/ProductSelector.js
import { useState, useEffect } from 'react'

export default function ProductSelector({ 
  products, 
  selectedProduct, 
  onProductSelect,
  position = 'top-left' 
}) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  // Detectar móvil y ajustar estado inicial
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768
      setIsMobile(mobile)
      // En móvil, colapsar por defecto para ahorrar espacio
      if (mobile && isExpanded) {
        setIsExpanded(false)
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [isExpanded])

  const positionStyles = {
    'top-left': { 
      top: isMobile ? '10px' : '20px', 
      left: isMobile ? '10px' : '20px' 
    },
    'top-right': { 
      top: isMobile ? '10px' : '20px', 
      right: isMobile ? '10px' : '20px' 
    },
    'bottom-left': { 
      bottom: isMobile ? '10px' : '20px', 
      left: isMobile ? '10px' : '20px' 
    },
    'bottom-right': { 
      bottom: isMobile ? '10px' : '20px', 
      right: isMobile ? '10px' : '20px' 
    }
  }

  const containerStyle = {
    position: 'absolute',
    ...positionStyles[position],
    zIndex: 1000,
    background: 'linear-gradient(135deg, rgba(0,0,0,0.95) 0%, rgba(44,62,80,0.95) 100%)',
    backdropFilter: 'blur(15px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: isMobile ? '12px' : '15px',
    padding: isExpanded ? (isMobile ? '12px' : '20px') : (isMobile ? '8px' : '15px'),
    fontFamily: 'Arial, sans-serif',
    minWidth: isMobile ? '200px' : '250px',
    maxWidth: isMobile ? 'calc(100vw - 40px)' : '350px',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
  }

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: isExpanded ? (isMobile ? '10px' : '15px') : '0',
    color: '#ffffff'
  }

  const titleStyle = {
    margin: 0,
    fontSize: isMobile ? '14px' : '16px',
    fontWeight: 'bold',
    background: 'linear-gradient(45deg, #4ecdc4, #44a08d)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  }

  const toggleButtonStyle = {
    background: 'none',
    border: 'none',
    color: '#4ecdc4',
    fontSize: isMobile ? '16px' : '18px',
    cursor: 'pointer',
    padding: '5px',
    borderRadius: '5px',
    transition: 'background-color 0.2s ease',
    minWidth: '30px',
    minHeight: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }

  const getButtonStyle = (product) => ({
    display: 'block',
    width: '100%',
    margin: isMobile ? '6px 0' : '8px 0',
    padding: isMobile ? '10px 12px' : '12px 15px',
    background: selectedProduct?.id === product.id 
      ? 'linear-gradient(135deg, #4ecdc4, #44a08d)' 
      : 'linear-gradient(135deg, rgba(52,73,94,0.8), rgba(44,62,80,0.8))',
    color: 'white',
    border: selectedProduct?.id === product.id 
      ? '2px solid #4ecdc4' 
      : '1px solid rgba(255,255,255,0.1)',
    borderRadius: isMobile ? '8px' : '10px',
    cursor: 'pointer',
    fontSize: isMobile ? '12px' : '13px',
    fontWeight: selectedProduct?.id === product.id ? 'bold' : 'normal',
    transition: 'all 0.3s ease',
    transform: selectedProduct?.id === product.id ? 'translateX(3px)' : 'translateX(0)',
    boxShadow: selectedProduct?.id === product.id 
      ? '0 4px 15px rgba(78, 205, 196, 0.3)' 
      : '0 2px 10px rgba(0,0,0,0.2)',
    // Mejorar touch targets en móvil
    minHeight: isMobile ? '44px' : 'auto',
    touchAction: 'manipulation',
    userSelect: 'none'
  })

  const categoryStyle = {
    fontSize: isMobile ? '9px' : '10px',
    color: '#bdc3c7',
    marginTop: '4px',
    fontWeight: 'normal'
  }

  const priceStyle = {
    fontSize: isMobile ? '12px' : '14px',
    color: '#4ecdc4',
    fontWeight: 'bold',
    marginTop: '4px'
  }

  const currentProductStyle = {
    padding: isMobile ? '8px' : '10px',
    background: 'rgba(78, 205, 196, 0.1)',
    borderRadius: '8px',
    border: '1px solid rgba(78, 205, 196, 0.3)'
  }

  const currentProductName = {
    color: '#4ecdc4',
    fontSize: isMobile ? '12px' : '14px',
    fontWeight: 'bold',
    margin: '0 0 5px 0'
  }

  const currentProductDetails = {
    color: '#bdc3c7',
    fontSize: isMobile ? '10px' : '12px',
    margin: 0
  }

  const instructionStyle = {
    marginBottom: isMobile ? '8px' : '10px',
    color: '#bdc3c7', 
    fontSize: isMobile ? '10px' : '12px',
    fontStyle: 'italic',
    lineHeight: '1.3'
  }

  const statsStyle = {
    marginTop: isMobile ? '12px' : '15px',
    padding: isMobile ? '8px' : '10px',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '8px',
    fontSize: isMobile ? '9px' : '11px',
    color: '#bdc3c7',
    lineHeight: '1.4'
  }

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h3 style={titleStyle}>
          {isExpanded ? (isMobile ? 'LG' : 'Catálogo LG') : 'LG'}
        </h3>
        <button
          style={toggleButtonStyle}
          onClick={() => setIsExpanded(!isExpanded)}
          onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(78, 205, 196, 0.2)'}
          onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
          aria-label={isExpanded ? 'Contraer panel' : 'Expandir panel'}
        >
          {isExpanded ? '−' : '+'}
        </button>
      </div>

      {/* Producto actual (modo colapsado) */}
      {!isExpanded && selectedProduct && (
        <div style={currentProductStyle}>
          <p style={currentProductName}>
            {isMobile ? 
              selectedProduct.name.split(' ').slice(0, 2).join(' ') : 
              selectedProduct.name
            }
          </p>
          <p style={currentProductDetails}>
            {selectedProduct.category} • ${selectedProduct.price?.toLocaleString()}
          </p>
        </div>
      )}

      {/* Lista de productos (modo expandido) */}
      {isExpanded && (
        <div>
          <div style={instructionStyle}>
            Selecciona un modelo{isMobile ? '' : ' para visualizar'}:
          </div>
          
          {/* Lista responsiva con scroll en móvil */}
          <div style={{
            maxHeight: isMobile ? '40vh' : 'none',
            overflowY: isMobile ? 'auto' : 'visible',
            paddingRight: isMobile ? '5px' : '0'
          }}>
            {products.map(product => (
              <button
                key={product.id}
                onClick={() => onProductSelect(product)}
                style={getButtonStyle(product)}
                onMouseOver={(e) => {
                  if (selectedProduct?.id !== product.id) {
                    e.target.style.transform = 'translateX(3px)'
                    e.target.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)'
                  }
                }}
                onMouseOut={(e) => {
                  if (selectedProduct?.id !== product.id) {
                    e.target.style.transform = 'translateX(0)'
                    e.target.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)'
                  }
                }}
                aria-label={`Seleccionar ${product.name}`}
              >
                <div>
                  <div>{isMobile ? 
                    product.name.split(' ').slice(0, 3).join(' ') : 
                    product.name
                  }</div>
                  <div style={categoryStyle}>{product.category}</div>
                  <div style={priceStyle}>${product.price?.toLocaleString()}</div>
                </div>
              </button>
            ))}
          </div>
          
          {/* Estadísticas - Solo mostrar si no es móvil o está expandido */}
          {(!isMobile || isExpanded) && (
            <div style={statsStyle}>
              <strong style={{ color: '#4ecdc4' }}>{products.length}</strong> modelos disponibles
              <br />
              Desde <strong style={{ color: '#4ecdc4' }}>
                ${Math.min(...products.map(p => p.price)).toLocaleString()}
              </strong> hasta <strong style={{ color: '#4ecdc4' }}>
                ${Math.max(...products.map(p => p.price)).toLocaleString()}
              </strong>
            </div>
          )}
        </div>
      )}
    </div>
  )
}