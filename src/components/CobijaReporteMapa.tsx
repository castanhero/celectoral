import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import type { ChartOptions } from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import { BarChart3, RefreshCw, Percent, Hash } from "lucide-react";

import CobijaPie from "./CobijaPie";
import CobijaBarra from "./CobijaBarra";
import MapaVotosCobija from "./MapaVotosCobija";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

interface ElectoralData {
  recinto: string;
  fsutpc: number;
  libre: number;
  upp: number;
  mts: number;
  sumate: number;
  aupp: number;
  ngp: number;
  fri: number;
  mnr: number;
  mda: number;
  blancos: number;
  nulos: number;
  porcentaje: number;
  mesa: string;
  lat: number;
  lng: number;
  habilitados: number;
  validos: number;
}

export default function ChartsSectionCobija() {
  const [data, setData] = useState<ElectoralData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPercent, setShowPercent] = useState(false);
  const [chartKey, setChartKey] = useState(0);
  const [porTotal, setPorTotal] = useState<number>(0);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [countdown, setCountdown] = useState(300);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const apiUrl =
      "https://opensheet.elk.sh/1h1LWh_BTFy129-U5yog02HRXPC9sfOnGJEKM600cX-8/ALCALDIA";

    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        mode: "cors",
      });

      if (!response.ok) throw new Error("Error al cargar datos ALCALDIA");

      const jsonData = await response.json();

      // Fila TOTAL para porcentaje global
      const totalRow = jsonData.find((row: any) => row.Recinto === "TOTAL");
      if (totalRow) {
        setPorTotal(Number(totalRow.POR) || 0);
      }

      const formattedData: ElectoralData[] = jsonData
        .filter((row: any) => row.Recinto && row.Recinto !== "TOTAL")
        .map((row: any, index: number) => ({
          recinto: row.Recinto,
          mesa: row.Mesa?.toString() ?? `${index + 1}`,
          fsutpc: Number(row.FSUTPC) || 0,
          libre: Number(row.LIBRE) || 0,
          upp: Number(row.UPP) || 0,
          mts: Number(row.MTS) || 0,
          sumate: Number(row.SUMATE) || 0,
          aupp: Number(row.AUPP) || 0,
          ngp: Number(row.NGP) || 0,
          fri: Number(row.FRI) || 0,
          mnr: Number(row.MNR) || 0,
          mda: Number(row.MDA) || 0,
          blancos: Number(row.BLANCOS) || 0,
          nulos: Number(row.NULOS) || 0,
          porcentaje: Number(row.POR) || 0,
          lat: parseFloat(String(row.latitud).replace(",", ".")),
          lng: parseFloat(String(row.longitud).replace(",", ".")),
          habilitados: Number(row.Habilitados) || 0,
          validos: Number(row.VALIDOS) || 0,
        }))
        .filter((p) => !Number.isNaN(p.lat) && !Number.isNaN(p.lng));

      if (formattedData.length === 0)
        throw new Error("No se encontraron recintos.");

      setData(formattedData);
      setLastUpdate(new Date());
      setCountdown(300);
    } catch (err: any) {
      console.error(err);
      setError(
        "Error cargando datos desde Google Sheets (ALCALDIA). Usando datos de ejemplo.",
      );
      // aquí podrías poner datos de ejemplo si quieres
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    const intervalId = window.setInterval(() => fetchData(), 5 * 60 * 1000);
    const timerId = window.setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 300));
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
      window.clearInterval(timerId);
    };
  }, [fetchData]);

  const totals = useMemo(
    () =>
      data.reduce(
        (acc, curr) => {
          acc.fsutpc += curr.fsutpc;
          acc.libre += curr.libre;
          acc.upp += curr.upp;
          acc.mts += curr.mts;
          acc.sumate += curr.sumate;
          acc.aupp += curr.aupp;
          acc.ngp += curr.ngp;
          acc.fri += curr.fri;
          acc.mnr += curr.mnr;
          acc.mda += curr.mda;
          acc.blancos += curr.blancos;
          acc.nulos += curr.nulos;
          return acc;
        },
        {
          fsutpc: 0,
          libre: 0,
          upp: 0,
          mts: 0,
          sumate: 0,
          aupp: 0,
          ngp: 0,
          fri: 0,
          mnr: 0,
          mda: 0,
          blancos: 0,
          nulos: 0,
        },
      ),
    [data],
  );

  const totalGeneral = useMemo(
    () =>
      totals.fsutpc +
      totals.libre +
      totals.upp +
      totals.mts +
      totals.sumate +
      totals.aupp +
      totals.ngp +
      totals.fri +
      totals.mnr +
      totals.mda +
      totals.blancos +
      totals.nulos,
    [totals],
  );

  const toPercent = (value: number, total: number) =>
    total > 0 ? parseFloat(((value / total) * 100).toFixed(2)) : 0;

  const displayValue = (value: number, total?: number) =>
    showPercent && total && total > 0
      ? `${toPercent(value, total).toFixed(2)}%`
      : value.toLocaleString();

  const chartOptions = useMemo<ChartOptions<"bar">>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        datalabels: {
          anchor: "end",
          align: "end",
          offset: 2,
          font: { size: 9, weight: "bold" },
          color: "#333",
          formatter: (value: number) =>
            value > 0
              ? showPercent
                ? `${value.toFixed(2)}%`
                : `${value}`
              : "",
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grace: "15%",
          ticks: {
            callback: (val) => (showPercent ? `${val}%` : val),
          },
        },
      },
    }),
    [showPercent],
  );

  const pieGeneralData = {
    labels: [
      "FSUTPC",
      "LIBRE",
      "UPP",
      "MTS",
      "SUMATE",
      "AUPP",
      "NGP",
      "FRI",
      "MNR",
      "MDA",
      "BLANCOS",
      "NULOS",
    ],
    datasets: [
      {
        data: showPercent
          ? [
              toPercent(totals.fsutpc, totalGeneral),
              toPercent(totals.libre, totalGeneral),
              toPercent(totals.upp, totalGeneral),
              toPercent(totals.mts, totalGeneral),
              toPercent(totals.sumate, totalGeneral),
              toPercent(totals.aupp, totalGeneral),
              toPercent(totals.ngp, totalGeneral),
              toPercent(totals.fri, totalGeneral),
              toPercent(totals.mnr, totalGeneral),
              toPercent(totals.mda, totalGeneral),
              toPercent(totals.blancos, totalGeneral),
              toPercent(totals.nulos, totalGeneral),
            ]
          : [
              totals.fsutpc,
              totals.libre,
              totals.upp,
              totals.mts,
              totals.sumate,
              totals.aupp,
              totals.ngp,
              totals.fri,
              totals.mnr,
              totals.mda,
              totals.blancos,
              totals.nulos,
            ],
        backgroundColor: [
          "#5c9743",
          "#E11D48",
          "#025744",
          "#006d36",
          "#5e2572",
          "#663d2b",
          "#16a7e0",
          "#014995",
          "#ff84b0",
          "#fcbf28",
          "#ffffff",
          "#777777",
        ],
        borderWidth: 3,
        borderColor: "#F9FAFB",
      },
    ],
  };

  const handleTogglePercent = () => {
    setShowPercent(!showPercent);
    setChartKey((prev) => prev + 1);
  };

  return (
    <section className="py-8 bg-gradient-to-b from-gray-50 via-white to-gray-100">
      <div className="container mx-auto px-3 md:px-8">
        <div className="text-center mb-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 mb-2">
            <BarChart3 className="w-10 h-10 text-[#416972] drop-shadow-sm" />
            <h4 className="text-3xl md:text-5xl font-extrabold text-[#416972] tracking-tight">
              Control Alcaldía Municipal
            </h4>
          </div>
          <p className="text-lg md:text-xl text-gray-600 mb-2 font-medium">
            Resultados — Alcaldía Municipal de Cobija
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={fetchData}
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#416972] to-[#5f8a8d] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition disabled:opacity-50"
            >
              <RefreshCw
                className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
              />
              Actualizar Datos
            </button>
            <button
              onClick={handleTogglePercent}
              className="inline-flex items-center gap-2 px-6 py-2.5 border-2 border-[#416972] text-[#416972] font-semibold rounded-lg hover:bg-[#416972]/10 transition"
            >
              {showPercent ? (
                <Hash className="w-5 h-5" />
              ) : (
                <Percent className="w-5 h-5" />
              )}
              {showPercent ? "Ver Totales" : "Ver Porcentajes"}
            </button>
          </div>



          {error && (
            <p className="mt-4 text-amber-600 font-semibold">{error}</p>
          )}
        </div>

        {loading ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-[#416972]"></div>
            <p className="mt-3 text-gray-600">Cargando datos...</p>
          </div>
        ) : (
          <>
            {/* Resumen general */}
            <div className="bg-white/80 rounded-2xl shadow-lg p-6 mb-4">
              <h3 className="text-2xl font-bold text-[#416972] mb-2 text-center">
                Resumen General{" "}
                <span className="text-base font-medium text-gray-500">
                  — Actas computadas:{" "}
                  <strong className="text-[#416972]">
                    {porTotal.toFixed(2)}%
                  </strong>
                </span>
              </h3>
              {/* tarjetas por partido (mismo diseño que ya usabas) */}
              {/* ... aquí dejas tus tarjetas FSUTPC, LIBRE, etc. usando totals y displayValue ... */}
            </div>

            {/* BARRA */}
            <CobijaBarra
              totals={totals}
              totalGeneral={totalGeneral}
              showPercent={showPercent}
              chartKey={chartKey}
            />

            {/* Mapa de recintos */}
            <h3 className="text-2xl font-bold text-[#416972] mb-4 text-center">
              Mapa de votos por recintos — Cobija
            </h3>
            <MapaVotosCobija
              puntos={data.map((d) => ({
                id: `${d.recinto}-${d.mesa}`,
                recinto: d.recinto,
                mesa: d.mesa,
                lat: d.lat,
                lng: d.lng,
                habilitados: d.habilitados,
                validos: d.validos,
                blancos: d.blancos,
                nulos: d.nulos,
                votos: {
                  LIBRE: d.libre,
                  UPP: d.upp,
                  MTS: d.mts,
                  SUMATE: d.sumate,
                  AUPP: d.aupp,
                  NGP: d.ngp,
                  FRI: d.fri,
                  MNR: d.mnr,
                  MDA: d.mda,
                },
              }))}
            />
          </>
        )}
      </div>
    </section>
  );
}