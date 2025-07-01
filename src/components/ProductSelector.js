// src/components/ProductSelector.js
import { useState } from 'react'

export default function ProductSelector({ 
  products, 
  selectedProduct, 
  onProductSelect,
  position = 'top-left' 
}) {
  const [isExpanded, setIsExpanded] = useState(true)

  const positionStyles = {
    'top-left': { top: '20px', left: '20px' },
    'top-right': { top: '20px', right: '20px' },
    'bottom-left': { bottom: '20px', left: '20px' },
    'bottom-right': { bottom: '20px', right: '20px' }
  }

  const containerStyle = {
    position: 'absolute',
    ...positionStyles[position],
    zIndex: 1000,
    background: 'linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(44,62,80,0.9) 100%)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '15px',
    padding: isExpanded ? '20px' : '15px',
    fontFamily: 'Arial, sans-serif',
    minWidth: '250px',
    maxWidth: '300px',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
  }

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: isExpanded ? '15px' : '0',
    color: '#ffffff'
  }

  const titleStyle = {
    margin: 0,
    fontSize: '16px',
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
    fontSize: '18px',
    cursor: 'pointer',
    padding: '5px',
    borderRadius: '5px',
    transition: 'background-color 0.2s ease'
  }

  const getButtonStyle = (product) => ({
    display: 'block',
    width: '100%',
    margin: '8px 0',
    padding: '12px 15px',
    background: selectedProduct?.id === product.id 
      ? 'linear-gradient(135deg, #4ecdc4, #44a08d)' 
      : 'linear-gradient(135deg, rgba(52,73,94,0.8), rgba(44,62,80,0.8))',
    color: 'white',
    border: selectedProduct?.id === product.id 
      ? '2px solid #4ecdc4' 
      : '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: selectedProduct?.id === product.id ? 'bold' : 'normal',
    transition: 'all 0.3s ease',
    transform: selectedProduct?.id === product.id ? 'translateX(5px)' : 'translateX(0)',
    boxShadow: selectedProduct?.id === product.id 
      ? '0 4px 15px rgba(78, 205, 196, 0.3)' 
      : '0 2px 10px rgba(0,0,0,0.2)'
  })

  const categoryStyle = {
    fontSize: '10px',
    color: '#bdc3c7',
    marginTop: '4px',
    fontWeight: 'normal'
  }

  const priceStyle = {
    fontSize: '14px',
    color: '#4ecdc4',
    fontWeight: 'bold',
    marginTop: '4px'
  }

  const currentProductStyle = {
    padding: '10px',
    background: 'rgba(78, 205, 196, 0.1)',
    borderRadius: '8px',
    border: '1px solid rgba(78, 205, 196, 0.3)'
  }

  const currentProductName = {
    color: '#4ecdc4',
    fontSize: '14px',
    fontWeight: 'bold',
    margin: '0 0 5px 0'
  }

  const currentProductDetails = {
    color: '#bdc3c7',
    fontSize: '12px',
    margin: 0
  }

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h3 style={titleStyle}>
          {isExpanded ? 'Catálogo LG' : 'LG'}
        </h3>
        <button
          style={toggleButtonStyle}
          onClick={() => setIsExpanded(!isExpanded)}
          onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(78, 205, 196, 0.2)'}
          onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          {isExpanded ? '−' : '+'}
        </button>
      </div>

      {/* Producto actual (modo colapsado) */}
      {!isExpanded && selectedProduct && (
        <div style={currentProductStyle}>
          <p style={currentProductName}>{selectedProduct.name}</p>
          <p style={currentProductDetails}>{selectedProduct.category} • ${selectedProduct.price?.toLocaleString()}</p>
        </div>
      )}

      {/* Lista de productos (modo expandido) */}
      {isExpanded && (
        <div>
          <div style={{ marginBottom: '10px' }}>
            <span style={{ 
              color: '#bdc3c7', 
              fontSize: '12px',
              fontStyle: 'italic' 
            }}>
              Selecciona un modelo para visualizar:
            </span>
          </div>
          
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
            >
              <div>
                <div>{product.name}</div>
                <div style={categoryStyle}>{product.category}</div>
                <div style={priceStyle}>${product.price?.toLocaleString()}</div>
              </div>
            </button>
          ))}
          
          {/* Estadísticas */}
          <div style={{
            marginTop: '15px',
            padding: '10px',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '8px',
            fontSize: '11px',
            color: '#bdc3c7'
          }}>
            <strong style={{ color: '#4ecdc4' }}>{products.length}</strong> modelos disponibles
            <br />
            Desde <strong style={{ color: '#4ecdc4' }}>
              ${Math.min(...products.map(p => p.price)).toLocaleString()}
            </strong> hasta <strong style={{ color: '#4ecdc4' }}>
              ${Math.max(...products.map(p => p.price)).toLocaleString()}
            </strong>
          </div>
        </div>
      )}
    </div>
  )
}