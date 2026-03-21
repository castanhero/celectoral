import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Header from './components/Header'
import Nav from './components/Nav'
import ChartsReporte from './components/ChartsReporte'
import SocialSection from './components/SocialSection'
import ConcejalReporte from './components/ConcejalReporte'
import AlcaldeReporte from './components/AlcaldeReporte'
import GobiernacionReporte from './components/GobiernacionReporte'

import Footer from './components/Footer'
import './App.css'

/*
function App() {
  const [count, setCount] = useState(0)
  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}
*/

function App() {
  const [seccion, setSeccion] = useState("alcalde");
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <Nav onSelect={setSeccion} active={seccion} />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {seccion === "alcalde"  && <AlcaldeReporte />}   {/* ✅ */}
        {seccion === "concejal" && <ConcejalReporte />}  {/* ✅ */}
        {seccion === "gobernacion" && <GobiernacionReporte />}  {/* ✅ */}


      </main>

      <SocialSection />
      <Footer />
    </div>
  );
}
export default App
/*
function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Nav />
      <ChartsReporte />
      <SocialSection />
      <Footer />
    </div>
  );
}
export default App
*/

/*
export default function App() {
  const [seccion, setSeccion] = useState("resumen");

  return (
    <>
      <Header />
      <Nav onSelect={setSeccion} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {seccion === "resumen"   && <SeccionResumen />}
        {seccion === "recintos"  && <SeccionRecintos />}
        {seccion === "partidos"  && <SeccionPartidos />}
        {seccion === "tendencia" && <SeccionTendencia />}
      </main>
    </>
  );
}
*/