import React from 'react'
import ProductViewer from './components/ProductViewer'
import './App.css'

function App() {
  return (
    <div className="App">
      <div className="logo-container">
        <img src="/logo.png" alt="Logo" className="logo" />
      </div>
      <ProductViewer />
    </div>
  )
}

export default App