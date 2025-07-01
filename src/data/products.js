export const lgProducts = [
    {
      id: 1,
      name: 'LG OLED C3 55"',
      model: 'OLED55C3PSA',
      price: 1299,
      category: 'OLED',
      dimensions: { width: 2.0, height: 1.2, depth: 0.1 },
      color: '#2c3e50',
      features: ['4K', 'HDR10', 'Dolby Vision', 'webOS'],
      description: 'TV OLED 4K con procesador α9 Gen6 AI'
    },
    {
      id: 2,
      name: 'LG QNED 65"',
      model: 'QNED65MR7550PSA',
      price: 899,
      category: 'QNED',
      dimensions: { width: 2.4, height: 1.4, depth: 0.12 },
      color: '#e74c3c',
      features: ['4K', 'HDR', 'Quantum Dot', 'NanoCell'],
      description: 'TV QNED con tecnología Quantum Dot y NanoCell'
    },
    {
      id: 3,
      name: 'LG UltraHD 75"',
      model: 'UP75UN7300PSC',
      price: 1599,
      category: 'UltraHD',
      dimensions: { width: 2.8, height: 1.6, depth: 0.15 },
      color: '#3498db',
      features: ['4K', 'UltraHD', 'Smart TV', 'ThinQ AI'],
      description: 'TV UltraHD 4K con inteligencia artificial ThinQ'
    },
    {
      id: 4,
      name: 'LG NanoCell 43"',
      model: 'NANO43UP7750PSB',
      price: 499,
      category: 'NanoCell',
      dimensions: { width: 1.6, height: 0.9, depth: 0.08 },
      color: '#9b59b6',
      features: ['4K', 'NanoCell', 'Real 4K', 'webOS'],
      description: 'TV NanoCell compacto con tecnología de pureza de color'
    },
    {
      id: 5,
      name: 'LG OLED Gallery 83"',
      model: 'OLED83G3PSA',
      price: 3299,
      category: 'OLED Gallery',
      dimensions: { width: 3.2, height: 1.8, depth: 0.04 },
      color: '#1abc9c',
      features: ['8K', 'Gallery Design', 'Ultra Slim', 'α9 Gen6'],
      description: 'TV OLED Gallery Design ultra delgado de 83 pulgadas'
    }
  ]
  
  export const getProductById = (id) => {
    return lgProducts.find(product => product.id === id)
  }
  
  export const getProductsByCategory = (category) => {
    return lgProducts.filter(product => product.category === category)
  }