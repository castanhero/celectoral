export default function Header() {
  return (
    <header
      className="text-white py-2 shadow-lg"
      style={{ background: "linear-gradient(90deg, #fdad02 0%, #018d2d 50%, #eccb02 100%)" }}>
      <div className="container mx-auto px-3 flex flex-col md:flex-row items-center md:items-start justify-between">
        {/* #fdad02 #eccb02 #018d2d */}
        {/* #FF7F50 #FF8C00 #FFA500 */}
        {/* Logo grande a la izquierda */}
        {/* Logos centrales */}
      </div>
      {/* Texto centrado y responsivo */}
      <div className="flex flex-col items-center justify-center text-center mt-2 container mx-auto px-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3">
          Gobierno Autónomo Municipal de Cobija
        </h1>

        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold mb-2" style={{ color: "white" }}>
          Gestion 2026-2031
        </h2>

        {/*<p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 italic max-w-3xl">
          Gestion 2026-2031
        </p>*/}
      </div>
    </header>
  );
}