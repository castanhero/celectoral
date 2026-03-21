// components/CobijaConcejales.tsx
import { useMemo } from "react";
import { calcularDHondt } from "../utils/dhonst";

interface Totals {
  fsutpc: number;
  libre:  number;
  upp:    number;
  mts:    number;
  sumate: number;
  aupp:   number;
  ngp:    number;
  fri:    number;
  mnr:    number;
  mda:    number;
  blancos: number;
  nulos:   number;
}

interface Props {
  totals:       Totals;
  totalGeneral: number;
}

const TOTAL_ESCANOS = 11;

const PARTIDOS = (totals: Totals) => [
  { nombre: "FSUTPC", votos: totals.fsutpc, color: "#5c9743" },
  { nombre: "LIBRE",  votos: totals.libre,  color: "#E11D48" },
  { nombre: "UPP",    votos: totals.upp,    color: "#025744" },
  { nombre: "MTS",    votos: totals.mts,    color: "#006d36" },
  { nombre: "SUMATE", votos: totals.sumate, color: "#5e2572" },
  { nombre: "AUPP",   votos: totals.aupp,   color: "#663d2b" },
  { nombre: "NGP",    votos: totals.ngp,    color: "#16a7e0" },
  { nombre: "FRI",    votos: totals.fri,    color: "#014995" },
  { nombre: "MNR",    votos: totals.mnr,    color: "#ff84b0" },
  { nombre: "MDA",    votos: totals.mda,    color: "#fcbf28" },
];

export default function CobijaConcejales({ totals, totalGeneral }: Props) {
  // Votos válidos = total sin blancos ni nulos
  const votosValidos = useMemo(
    () => totalGeneral - totals.blancos - totals.nulos,
    [totalGeneral, totals.blancos, totals.nulos],
  );

  const resultados = useMemo(
    () => calcularDHondt(PARTIDOS(totals), TOTAL_ESCANOS),
    [totals],
  );

  const escanosTotales = resultados.reduce((s, r) => s + r.escanos, 0);

  return (
    <div className="bg-white/80 rounded-2xl shadow-lg p-6 mb-4">
      <h3 className="text-2xl font-bold text-[#416972] mb-1 text-center">
        Distribución de Concejales
      </h3>
      <p className="text-center text-sm text-gray-500 mb-6">
        {TOTAL_ESCANOS} escaños ·{" "}
        <strong className="text-[#416972]">
          {votosValidos.toLocaleString()}
        </strong>{" "}
        votos válidos
      </p>

      {/* Escaños visuales tipo parlamento */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {resultados.flatMap((r) =>
          Array.from({ length: r.escanos }, (_, j) => (
            <div
              key={`${r.partido}-${j}`}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold shadow"
              style={{ backgroundColor: r.color }}
              title={`${r.partido}`}
            >
              {r.escanos > 1 && j === 0 ? r.escanos : ""}
            </div>
          )),
        )}
      </div>

      {/* Tabla de resultados */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-center border-collapse">
          <thead>
            <tr className="bg-[#416972]/10 text-[#416972] font-semibold">
              <th className="py-2 px-3 text-left rounded-tl-lg">Partido</th>
              <th className="py-2 px-3">Votos válidos</th>
              <th className="py-2 px-3">%</th>
              <th className="py-2 px-3 rounded-tr-lg">Concejales</th>
            </tr>
          </thead>
          <tbody>
            {resultados.map((r, i) => (
              <tr
                key={r.partido}
                className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="py-2 px-3 text-left">
                  <span className="flex items-center gap-2">
                    <span
                      className="inline-block w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: r.color }}
                    />
                    <span className="font-semibold">{r.partido}</span>
                  </span>
                </td>
                <td className="py-2 px-3">{r.votos.toLocaleString()}</td>
                <td className="py-2 px-3 text-gray-500">{r.porcentaje}%</td>
                <td className="py-2 px-3">
                  <span
                    className="inline-flex items-center justify-center w-8 h-8 rounded-full text-white font-bold text-sm shadow"
                    style={{ backgroundColor: r.color }}
                  >
                    {r.escanos}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-[#416972]/10 font-bold text-[#416972]">
              <td className="py-2 px-3 text-left rounded-bl-lg">TOTAL</td>
              <td className="py-2 px-3">{votosValidos.toLocaleString()}</td>
              <td className="py-2 px-3">100%</td>
              <td className="py-2 px-3 rounded-br-lg">{escanosTotales}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}