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
import ADPoblacionReporte from './components/ADPoblacionReporte'
import ADTerritorioReporte from './components/ADTerritorioReporte'
import CobijaReporteMapa from './components/CobijaReporteMapa'

import Footer from './components/Footer'
import './App.css'

function App() {
  const [seccion, setSeccion] = useState("alcalde");
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <Nav onSelect={setSeccion} active={seccion} />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {seccion === "alcalde"  && <CobijaReporteMapa />}
        {seccion === "concejal" && <ConcejalReporte />}
        {/*
        {seccion === "gobernacion" && <GobiernacionReporte />}
        {seccion === "asambleistasterritorio" && <ADTerritorioReporte />}
        {seccion === "asambleistaspoblacion" && <ADPoblacionReporte />}
        */}


      </main>

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