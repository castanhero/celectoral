import { Facebook } from 'lucide-react';

export default function SocialSection() {
  return (
    <section className="py-6" style={{ background: "linear-gradient(90deg, #fdad02 0%, #018d2d 50%, #eccb02 100%)" }}>
      {/* #fdad02 #eccb02 #018d2d */}
      {/* #FF7F50 0%, #FF8C00 50%, #FFA500 100% */}
      <div className="container mx-auto px-2">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
          Síguenos en Redes Sociales
        </h2>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-2xl mx-auto">
          <a
            href="https://www.tiktok.com/@ajerhy"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-8 py-4 bg-white text-gray-900 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 w-full sm:w-auto justify-center"
          >
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
            </svg>
            <span className="text-xl font-bold">TikTok</span>
          </a>

          <a
            href="https://www.facebook.com/AjerhyInc/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-8 py-4 bg-white text-[#416972] rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 w-full sm:w-auto justify-center"
          >
            <Facebook className="w-8 h-8" />
            <span className="text-xl font-bold">Facebook</span>
          </a>
        </div>

        <p className="text-center text-white text-lg mt-8">
          Mantente siempre informado sobre nuestras actividades
        </p>
      </div>
    </section>
  );
}