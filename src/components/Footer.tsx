import { MapPin, Mail, Phone } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-6">
          <div>
            <h3 className="text-xl font-bold" style={{ color: "#416972" }}>
              Contacto
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-1 flex-shrink-0" style={{ color: "#416972" }} />
                <p className="text-gray-300">
                  Cobija, Bolivia<br />
                  Departamento de La Pando
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 flex-shrink-0" style={{ color: "#416972" }} />
                <a
                  href="mailto:ajerhy@gmail.com"
                  className="text-gray-300 hover:text-[#416972] transition-colors"
                >
                  ajerhy@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 flex-shrink-0" style={{ color: "#416972" }} />
                <a
                  href="tel:+59100000000"
                  className="text-gray-300 hover:text-[#416972] transition-colors"
                >
                  +591 (7) 3666701
                </a>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4" style={{ color: "#416972" }}>
              Sobre Nosotros
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Seguimiento de 29 Recintos en los 
              6 Distritos Municipales y 12 Catastrales en el municipio de cobija
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4" style={{ color: "#416972" }}>
              6 Distritos Municipales y 12 Catastrales
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-300">
              <p>Barrios</p>
              <p>Urbanizacion</p>
              <p>Area Rural y Urbana</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 text-center">
          <p className="text-gray-400">
            © {currentYear} Departamento La Pando - Municipio de Cobija.
            Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}