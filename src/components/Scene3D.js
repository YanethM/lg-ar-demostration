// src/components/Scene3D.js
import { Suspense, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { 
  OrbitControls, 
  Environment, 
  ContactShadows, 
  PresentationControls,
  Grid,
  Text,
  Float
} from '@react-three/drei'
import TVModel from './TVModel'

// Componente de carga
function LoadingSpinner() {
  const meshRef = useRef()
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.elapsedTime * 2
    }
  })
  
  return (
    <group>
      <mesh ref={meshRef}>
        <torusGeometry args={[0.5, 0.2, 16, 100]} />
        <meshBasicMaterial color="#4ecdc4" />
      </mesh>
      <Text
        position={[0, -1.5, 0]}
        fontSize={0.3}
        color="#4ecdc4"
        anchorX="center"
        anchorY="middle"
      >
        Cargando modelo 3D...
      </Text>
    </group>
  )
}

// Componente de fondo animado
function AnimatedBackground() {
  const meshRef = useRef()
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.1
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
    }
  })
  
  return (
    <mesh ref={meshRef} position={[0, 0, -10]} scale={[20, 20, 1]}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <meshBasicMaterial 
        color="#0a0a0a" 
        transparent 
        opacity={0.3}
        wireframe
      />
    </mesh>
  )
}

// Iluminación personalizada
function SceneLighting() {
  return (
    <>
      {/* Luz ambiente suave */}
      <ambientLight intensity={0.4} color="#ffffff" />
      
      {/* Luz principal */}
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1}
        color="#ffffff"
        castShadow
        shadow-mapSize={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Luz de relleno */}
      <directionalLight 
        position={[-5, 5, 5]} 
        intensity={0.3}
        color="#4ecdc4"
      />
      
      {/* Luz de fondo */}
      <pointLight 
        position={[0, -5, -5]} 
        intensity={0.5}
        color="#ff6b6b"
      />
      
      {/* Luz cenital */}
      <spotLight
        position={[0, 15, 0]}
        angle={0.3}
        penumbra={1}
        intensity={0.5}
        color="#ffffff"
        castShadow
      />
    </>
  )
}

// Componente principal de la escena
export default function Scene3D({ 
  selectedProduct, 
  cameraPosition = [4, 2, 4],
  showGrid = true,
  showEnvironment = true,
  autoRotate = false 
}) {
  return (
    <>
      {/* Fondo animado */}
      <AnimatedBackground />
      
      {/* Iluminación */}
      <SceneLighting />
      
      {/* Entorno */}
      {showEnvironment && (
        <Environment 
          preset="studio" 
          background={false}
          blur={0.8}
        />
      )}
      
      {/* Grid del suelo */}
      {showGrid && (
        <>
          <Grid 
            renderOrder={-1}
            position={[0, -2, 0]} 
            infiniteGrid 
            cellSize={0.6} 
            cellThickness={0.6} 
            sectionSize={3.3} 
            sectionThickness={1.5} 
            sectionColor={'#4ecdc4'} 
            cellColor={'#6a6a6a'} 
            fadeDistance={30} 
            fadeStrength={1}
          />
          
          {/* Sombras de contacto */}
          <ContactShadows
            position={[0, -1.99, 0]}
            opacity={0.4}
            scale={10}
            blur={2.5}
            far={4}
          />
        </>
      )}
      
      {/* Modelo del TV con suspense */}
      <Suspense fallback={<LoadingSpinner />}>
        {selectedProduct ? (
          <PresentationControls
            enabled={true}
            global={false}
            cursor={true}
            snap={false}
            speed={1}
            zoom={1}
            rotation={[0, 0, 0]}
            polar={[-Math.PI / 3, Math.PI / 3]}
            azimuth={[-Math.PI / 1.4, Math.PI / 1.4]}
          >
            <Float
              speed={1.5}
              rotationIntensity={0.2}
              floatIntensity={0.2}
              floatingRange={[0, 0.1]}
            >
              <TVModel 
                product={selectedProduct}
                position={[0, 0, 0]}
                scale={1}
                interactive={true}
              />
            </Float>
          </PresentationControls>
        ) : (
          // Mensaje cuando no hay producto seleccionado
          <group>
            <Text
              position={[0, 0, 0]}
              fontSize={0.5}
              color="#666666"
              anchorX="center"
              anchorY="middle"
            >
              Selecciona un producto
              {'\n'}para visualizar
            </Text>
            
            {/* Logo LG animado */}
            <Float
              speed={2}
              rotationIntensity={0.5}
              floatIntensity={0.5}
            >
              <Text
                position={[0, -1.5, 0]}
                fontSize={1}
                color="#4ecdc4"
                anchorX="center"
                anchorY="middle"
                font="/fonts/inter-bold.woff"
              >
                LG
              </Text>
            </Float>
          </group>
        )}
      </Suspense>
      
      {/* Controles de cámara */}
      <OrbitControls
        makeDefault
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI - Math.PI / 6}
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
        enableDamping={true}
        dampingFactor={0.05}
        minDistance={2}
        maxDistance={20}
        target={[0, 0, 0]}
        autoRotate={autoRotate}
        autoRotateSpeed={0.5}
      />
      
      {/* Información de ayuda flotante */}
      <Float
        speed={1}
        rotationIntensity={0.1}
        floatIntensity={0.1}
        position={[0, 3, 0]}
      >
        <Text
          fontSize={0.1}
          color="#888888"
          anchorX="center"
          anchorY="middle"
          transparent
          opacity={0.7}
        >
          🖱️ Arrastra para rotar • 🔍 Scroll para zoom • 👆 Click en el TV
        </Text>
      </Float>
    </>
  )
}