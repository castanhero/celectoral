const concejales = [
  { num: 1, partido: "LIBRE", nombre: "PAULA PAXI SUXO" },
  { num: 2, partido: "LIBRE", nombre: "HERBERT SALVATIERRA BECERRA" },
  { num: 3, partido: "LIBRE", nombre: "SANDRA INES MENACHO SORIA" },
  { num: 4, partido: "LIBRE", nombre: "HERNAN MARCELO ALVAREZ CARCAMO" },
  { num: 5, partido: "LIBRE", nombre: "NATALY KIMBERLING CHOCLO MENACHO" },
  { num: 6, partido: "MDA", nombre: "VICTOR SALIM VARGAS KERDY" },
  { num: 7, partido: "MDA", nombre: "ALISON JUDITH RAMALLO MONTES" },
  { num: 8, partido: "MDA", nombre: "HOWER RICARDO LUNA SEMO" },
  { num: 9, partido: "AB-SÚMATE", nombre: "YERKO OJOPI SOSA" },
  { num: 10, partido: "AB-SÚMATE", nombre: "NORBERTHA MAMANI CALLISAYA" },
  { num: 11, partido: "A-UPP", nombre: "YASSER PESSOA AZAD" },
];

const coloresPartido: Record<string, string> = {
  "LIBRE": "#E11D48",
  "MDA": "#fcbf28",
  "AB-SÚMATE": "#5e2572",
  "A-UPP": "#663d2b",
};

export default function ListaConcejalesColores() {
  return (
    <div className="bg-white border-gray-100 max-w-2xl mx-auto">
      <h3 className="text-2xl font-bold text-[#416972] mb-6 text-center">
        <div className="text-sm font-normal text-gray-600 mt-1">(11 escaños)</div>
      </h3>
      
      <ol className="space-y-3">
        {concejales.map((c) => (
          <li 
            key={c.num}
            className="flex items-center gap-3 py-3 px-4 bg-gradient-to-r rounded-xl hover:shadow-md transition-all border"
            style={{ 
              borderColor: coloresPartido[c.partido] + "20",
              background: `linear-gradient(90deg, ${coloresPartido[c.partido]}10 0%, white 50%)`
            }}
          >
            <span className="font-bold text-xl text-gray-800 w-8 flex-shrink-0">
              {c.num}.
            </span>
            
            <div 
              className="w-3 h-3 rounded-full shadow-sm flex-shrink-0"
              style={{ backgroundColor: coloresPartido[c.partido] }}
            />
            
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm text-gray-800">
                {c.partido}
              </div>
              <div className="font-bold text-base leading-tight">
                {c.nombre}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}