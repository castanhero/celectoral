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

import PandoBarra from "./PandoBarra";
import CobijaPie from "./CobijaPie";
import CobijaBarra from "./CobijaBarra";

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
  municipio: string;
  upp: number;
  mda: number;
  mts: number;
  ngp: number;
  libre: number;
  mnr: number;
  fsutpc: number;
  fri: number;
  blancos: number;
  nulos: number;
  porcentaje: number;
}

export default function ChartsSection() {
  const [data, setData] = useState<ElectoralData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecinto, setSelectedRecinto] = useState<string | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [showPercent, setShowPercent] = useState(false);
  const [chartKey, setChartKey] = useState(0);
  const [porTotal, setPorTotal] = useState<number>(0);

  /*const fetchData = async (*/
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    var apiUrl = `https://opensheet.elk.sh/1-XblYY56wt4VtFnUy0AAKes2jpe7XY2ZWIWhy1wo_oI/RESULTADO`;
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error("Error al cargar datos");

      const jsonData = await response.json();

      const totalRow = jsonData.find((row: any) => row.Municipio === "TOTAL");
      if (totalRow) {
        setPorTotal(Number(totalRow.POR) || 0);
      }

      const formattedData: ElectoralData[] = jsonData
        .filter((row: any) => row.Municipio && row.Municipio !== "TOTAL")
        .map((row: any) => ({
          municipio: row.Municipio,
          upp: Number(row.UPP) || 0,
          mda: Number(row.MDA) || 0,
          mts: Number(row.MTS) || 0,
          ngp: Number(row.NGP) || 0,
          libre: Number(row.LIBRE) || 0,
          mnr: Number(row.MNR) || 0,
          fsutpc: Number(row.FSUTPC) || 0,
          fri: Number(row.FRI) || 0,
          blancos: Number(row.BLANCOS) || 0,
          nulos: Number(row.NULOS) || 0,
          porcentaje: Number(row.POR) || 0,
        }));

      if (formattedData.length === 0)
        throw new Error("No se encontraron recintos.");
      setData(formattedData);
    } catch (err: any) {
      console.error(err);
      setError(
        "Error cargando datos desde Google Sheets. Usando datos de ejemplo.",
      );
      setData([
        {
          municipio: "Cobija",
          upp: 25,
          mda: 250,
          mts: 50,
          ngp: 50,
          libre: 350,
          mnr: 50,
          fsutpc: 400,
          fri: 50,
          blancos: 20,
          nulos: 10,
          porcentaje: 35,
        },
        {
          municipio: "Sena",
          upp: 25,
          mda: 250,
          mts: 60,
          ngp: 60,
          libre: 350,
          mnr: 40,
          fsutpc: 400,
          fri: 20,
          blancos: 20,
          nulos: 10,
          porcentaje: 35,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const totals = useMemo(
    () =>
      data.reduce(
        (acc, curr) => {
          acc.upp += Number(curr.upp) || 0;
          acc.mda += Number(curr.mda) || 0;
          acc.mts += Number(curr.mts) || 0;
          acc.ngp += Number(curr.ngp) || 0;
          acc.libre += Number(curr.libre) || 0;
          acc.mnr += Number(curr.mnr) || 0;
          acc.fsutpc += Number(curr.fsutpc) || 0;
          acc.fri += Number(curr.fri) || 0;
          acc.blancos += Number(curr.blancos) || 0;
          acc.nulos += Number(curr.nulos) || 0;
          acc.porcentaje += Number(curr.porcentaje) || 0;
          return acc;
        },
        {
          upp: 0,
          mda: 0,
          mts: 0,
          ngp: 0,
          libre: 0,
          mnr: 0,
          fsutpc: 0,
          fri: 0,
          blancos: 0,
          nulos: 0,
          porcentaje: 0,
        },
      ),
    [data],
  );

  console.log("Totales calculados:", totals);
  /*
  const totalGeneral = totals.fsutpc + totals.libre + totals.upp + totals.mts + totals.sumate + totals.aupp + totals.ngp + totals.fri + totals.mnr + totals.mda + totals.blancos + totals.nulos;
  */
  /*
  const totalGeneral = useMemo(
    () => Object.values(totals).reduce((a, b) => a + b, 0),
    [totals],
  );*/

  const totalGeneral = useMemo(
    () =>
      totals.upp +
      totals.mda +
      totals.mts +
      totals.ngp +
      totals.libre +
      totals.mnr +
      totals.fsutpc +
      totals.fri +
      totals.blancos +
      totals.nulos,
    [totals],
  );

  /*
  const toPercent = (value: number, total: number) =>
    total > 0 ? Math.round((value / total) * 100) : 0;

  const displayValue = (value: number, total?: number) =>
    showPercent && total && total > 0
      ? `${toPercent(value, total)}%`
      : value.toLocaleString();
*/
  const toPercent = (value: number, total: number) =>
    total > 0 ? parseFloat(((value / total) * 100).toFixed(2)) : 0;

  const displayValue = (value: number, total?: number) =>
    showPercent && total && total > 0
      ? `${toPercent(value, total).toFixed(2)}%`
      : value.toLocaleString();

  const tooltipCallback = {
    callbacks: {
      label: function (context: any) {
        const value = context.raw;
        return showPercent ? `${Math.round(value)}%` : value.toLocaleString();
      },
    },
  };

  /*
  const chartOption = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" as const },
      tooltip: tooltipCallback,
    },
  };
*/

  const pieOption = useMemo<ChartOptions<"pie">>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true, position: "bottom" },
        datalabels: {
          color: "#000000",
          font: { size: 11, weight: "bold" },
          formatter: (value: number, ctx) => {
            // Calcular el total sumando todos los valores del dataset
            const dataArr = ctx.chart.data.datasets[0].data as number[];
            const total = dataArr.reduce((acc, val) => acc + val, 0);
            if (total === 0 || value === 0) return ""; // ocultar ceros
            const percentage = ((value * 100) / total).toFixed(2) + "%";
            return showPercent
              ? percentage // solo porcentaje
              : `${value}\n${percentage}`; // votos + porcentaje
          },
        },
      },
    }),
    [showPercent],
  );
  /*
const pieOption: ChartOptions<"pie"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: true, position: "bottom" },
    datalabels: {
      color: "#000000",
      font: { size: 11, weight: "bold" },
      formatter: (value: number, ctx) => {
        // Calcular el total sumando todos los valores del dataset
        const dataArr = ctx.chart.data.datasets[0].data as number[];
        const total = dataArr.reduce((acc, val) => acc + val, 0);
        if (total === 0 || value === 0) return "";  // ocultar ceros
        const percentage = ((value * 100) / total).toFixed(2) + "%";
        return showPercent
          ? percentage                   // solo porcentaje
          : `${value}\n${percentage}`;   // votos + porcentaje
      },
    },
  },
};
*/
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

  /*
  const chartOptions: ChartOptions<"bar"> = {
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
};
*/

  const pieGeneralData = {
    labels: [
      "UPP",
      "MDA",
      "MTS",
      "NGP",
      "LIBRE",
      "MNR",
      "FSUTPC",
      "FRI",
      "BLANCO",
      "NULO",
    ],
    datasets: [
      {
        data: showPercent
          ? [
              toPercent(totals.upp, totalGeneral),
              toPercent(totals.mda, totalGeneral),
              toPercent(totals.mts, totalGeneral),
              toPercent(totals.ngp, totalGeneral),
              toPercent(totals.libre, totalGeneral),
              toPercent(totals.mnr, totalGeneral),
              toPercent(totals.fsutpc, totalGeneral),
              toPercent(totals.fri, totalGeneral),
              toPercent(totals.blancos, totalGeneral),
              toPercent(totals.nulos, totalGeneral),
            ]
          : [
              totals.upp,
              totals.mda,
              totals.mts,
              totals.ngp,
              totals.libre,
              totals.mnr,
              totals.fsutpc,
              totals.fri,
              totals.blancos,
              totals.nulos,
            ],
        backgroundColor: [
          "#025744",
          "#fcbf28",
          "#006d36",
          "#16a7e0",
          "#E11D48",
          "#ff84b0",
          "#5c9743",
          "#014995",
          "#dbd2d2",
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

  const provinceData = selectedProvince
    ? data.find((d) => d.municipio === selectedProvince)
    : null;

  return (
    /* className="py-12 bg-gradient-to-b from-gray-50 via-white to-gray-100 */
    <section className="py-8 bg-gradient-to-b from-gray-50 via-white to-gray-100">
      <div className="container mx-auto px-3 md:px-8">
        {/* Encabezado text-center mb-12 */}
        <div className="text-center mb-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 mb-2">
            <BarChart3 className="w-10 h-10 text-[#416972] drop-shadow-sm" />
            <h4 className="text-3xl md:text-5xl font-extrabold text-[#416972] tracking-tight">
              Control de la Gobernacion
            </h4>
          </div>
          {/* text-lg md:text-xl text-gray-600 mb-8 font-medium */}
          <p className="text-lg md:text-xl text-gray-600 mb-2 font-medium">
            Resultados — Gobernacion Pando
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
            {/*
            <div className="bg-white/80 rounded-2xl shadow-lg p-8 mb-12">
              <h3 className="text-2xl font-bold text-[#416972] mb-6 text-center">
            */}
            <div className="bg-white/80 rounded-2xl shadow-lg p-6 mb-4">
              <h3 className="text-2xl font-bold text-[#416972] mb-2 text-center">
                Resumen General
                <span className="text-base font-medium text-gray-500">
                  - Actas computadas:{" "}
                  <strong className="text-[#416972]">
                    {porTotal.toFixed(2)}%
                  </strong>
                </span>
              </h3>
              {/* FSUTPC,LIBRE,UPP,MTS,APB-SUMATE,AUPP,NGP,FRI,MNR,MDA */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-5 text-center">
                <div className="p-6 bg-[#025744]/10 rounded-xl min-w-0 overflow-hidden">
                  <h4 className="text-base md:text-lg font-semibold text-[#025744]">
                    UPP
                  </h4>
                  <p className="mt-1 text-xl sm:text-2xl md:text-3xl font-bold text-[#025744] break-all leading-tight">
                    {displayValue(totals.upp, totalGeneral)}
                  </p>
                </div>
                <div className="p-6 bg-[#fcbf28]/10 rounded-xl min-w-0 overflow-hidden">
                  <h4 className="text-base md:text-lg font-semibold text-[#fcbf28]">
                    MDA
                  </h4>
                  <p className="mt-1 text-xl sm:text-2xl md:text-3xl font-bold text-[#fcbf28] break-all leading-tight">
                    {displayValue(totals.mda, totalGeneral)}
                  </p>
                </div>
                <div className="p-6 bg-[#006d36]/10 rounded-xl min-w-0 overflow-hidden">
                  <h4 className="text-base md:text-lg font-semibold text-[#006d36]">
                    MTS
                  </h4>
                  <p className="mt-1 text-xl sm:text-2xl md:text-3xl font-bold text-[#006d36] break-all leading-tight">
                    {displayValue(totals.mts, totalGeneral)}
                  </p>
                </div>
                <div className="p-6 bg-[#16a7e0]/10 rounded-xl min-w-0 overflow-hidden">
                  <h4 className="text-base md:text-lg font-semibold text-[#16a7e0]">
                    NGP
                  </h4>
                  <p className="mt-1 text-xl sm:text-2xl md:text-3xl font-bold text-[#16a7e0] break-all leading-tight">
                    {displayValue(totals.ngp, totalGeneral)}
                  </p>
                </div>
                <div className="p-4 bg-red-100 rounded-xl min-w-0 overflow-hidden">
                  <h4 className="text-base md:text-lg font-semibold text-red-800">
                    LIBRE
                  </h4>
                  <p className="mt-1 text-xl sm:text-2xl md:text-3xl font-bold text-red-800 break-all leading-tight">
                    {displayValue(totals.libre, totalGeneral)}
                  </p>
                </div>
                <div className="p-6 bg-[#ff84b0]/10 rounded-xl min-w-0 overflow-hidden">
                  <h4 className="text-base md:text-lg font-semibold text-[#ff84b0]">
                    MNR
                  </h4>
                  <p className="mt-1 text-xl sm:text-2xl md:text-3xl font-bold text-[#ff84b0] break-all leading-tight">
                    {displayValue(totals.mnr, totalGeneral)}
                  </p>
                </div>
                <div className="p-4 bg-[#5c9743]/10 rounded-xl min-w-0 overflow-hidden">
                  <h4 className="text-base md:text-lg font-semibold text-[#5c9743]">
                    FSUTPC
                  </h4>
                  <p className="mt-1 text-xl sm:text-2xl md:text-3xl font-bold text-[#5c9743] break-all leading-tight">
                    {displayValue(totals.fsutpc, totalGeneral)}
                  </p>
                </div>
                <div className="p-6 bg-[#014995]/10 rounded-xl min-w-0 overflow-hidden">
                  <h4 className="text-base md:text-lg font-semibold text-[#014995]">
                    FRI
                  </h4>
                  <p className="mt-1 text-xl sm:text-2xl md:text-3xl font-bold text-[#014995] break-all leading-tight">
                    {displayValue(totals.fri, totalGeneral)}
                  </p>
                </div>
                <div className="p-4 bg-[#000000]/10 rounded-xl min-w-0 overflow-hidden">
                  <h4 className="text-base md:text-lg font-semibold text-[#000000]">
                    BLANCO
                  </h4>
                  <p className="mt-1 text-xl sm:text-2xl md:text-3xl font-bold text-[#000000] break-all leading-tight">
                    {displayValue(totals.blancos, totalGeneral)}
                  </p>
                </div>

                <div className="p-4 bg-[#7f7c7c]/10 rounded-xl min-w-0 overflow-hidden">
                  <h4 className="text-base md:text-lg font-semibold text-gray-800">
                    NULO
                  </h4>
                  <p className="mt-1 text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 break-all leading-tight">
                    {displayValue(totals.nulos, totalGeneral)}
                  </p>
                </div>
              </div>
            </div>

            {/* TORTA 
            <CobijaPie
              totals={totals}
              totalGeneral={totalGeneral}
              showPercent={showPercent}
              chartKey={chartKey}
            />*/}
            {/* BARRA */}
            <PandoBarra
              totals={totals}
              totalGeneral={totalGeneral}
              showPercent={showPercent}
              chartKey={chartKey}
            />

            {/* Comparación por provincia */}
            <h3 className="text-2xl font-bold text-[#416972] mb-8 text-center">
              Distribucion por Municipios
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {data.map((prov, i) => {
                const totalProv =
                  prov.upp +
                  prov.mda +
                  prov.mts +
                  prov.ngp +
                  prov.libre +
                  prov.mnr +
                  prov.fsutpc +
                  prov.fri +
                  prov.blancos +
                  prov.nulos;
                const values = showPercent
                  ? [
                      toPercent(prov.upp, totalProv),
                      toPercent(prov.mda, totalProv),
                      toPercent(prov.mts, totalProv),
                      toPercent(prov.ngp, totalProv),
                      toPercent(prov.libre, totalProv),
                      toPercent(prov.mnr, totalProv),
                      toPercent(prov.fsutpc, totalProv),
                      toPercent(prov.fri, totalProv),
                      toPercent(prov.blancos, totalProv),
                      toPercent(prov.nulos, totalProv),
                    ]
                  : [
                      prov.upp,
                      prov.mda,
                      prov.mts,
                      prov.ngp,
                      prov.libre,
                      prov.mnr,
                      prov.fsutpc,
                      prov.fri,
                      prov.blancos,
                      prov.nulos,
                    ];
                const barData = {
                  labels: [
                    "UPP",
                    "MDA",
                    "MTS",
                    "NGP",
                    "LIBRE",
                    "MNR",
                    "FSUTPC",
                    "FRI",
                    "BLANCO",
                    "NULO",
                  ],
                  datasets: [
                    {
                      label: prov.municipio,
                      data: values,
                      backgroundColor: [
                        "#025744",
                        "#fcbf28",
                        "#006d36",
                        "#16a7e0",
                        "#E11D48",
                        "#ff84b0",
                        "#5c9743",
                        "#014995",
                        "#dbd2d2",
                        "#777777",
                      ],
                    },
                  ],
                };

                return (
                  <div
                    key={`${i}-${showPercent}`}
                    className="bg-white/80 rounded-xl shadow-md hover:shadow-lg transition p-5"
                  >
                    <h4 className="text-lg md:text-xl font-bold text-center text-gray-800 mb-4">
                      {prov.municipio}{" "}
                      <span className="text-sm font-medium text-[#416972]">
                        ({prov.porcentaje}%)
                      </span>
                    </h4>
                    <div className="h-[300px] md:h-72">
                      <Bar
                        data={barData}
                        options={chartOptions}
                        plugins={[ChartDataLabels]}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
