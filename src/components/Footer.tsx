import { MapPin, Mail, Phone } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    
  
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">


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