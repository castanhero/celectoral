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
  aupp: number;
  libre: number;
  mnr: number;
  fsutpc: number;
  fri: number;
  sumate: number;
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

    var apiUrl = `https://opensheet.elk.sh/1g-q6SWvak405UbTO7nr8cokwRQF0EjvU9M7ao1kuRSE/ADT`;
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
          aupp: Number(row.AUPP) || 0,
          libre: Number(row.LIBRE) || 0,
          mnr: Number(row.MNR) || 0,
          fsutpc: Number(row.FSUTPC) || 0,
          fri: Number(row.FRI) || 0,
          sumate: Number(row.SUMATE) || 0,
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
          municipio: "Madre de Dios",
          upp: 25,
          mda: 250,
          mts: 50,
          ngp: 50,
          aupp: 50,
          libre: 350,
          mnr: 50,
          fsutpc: 400,
          fri: 50,
          sumate: 50,
          blancos: 20,
          nulos: 10,
          porcentaje: 35,
        },
        {
          municipio: "Nicolás Suárez",
          upp: 25,
          mda: 250,
          mts: 60,
          ngp: 60,
          aupp: 60,
          libre: 350,
          mnr: 40,
          fsutpc: 400,
          fri: 20,
          sumate: 50,
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
          acc.aupp += Number(curr.aupp) || 0;
          acc.libre += Number(curr.libre) || 0;
          acc.mnr += Number(curr.mnr) || 0;
          acc.fsutpc += Number(curr.fsutpc) || 0;
          acc.fri += Number(curr.fri) || 0;
          acc.sumate += Number(curr.sumate) || 0;
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
          aupp: 0,
          libre: 0,
          mnr: 0,
          fsutpc: 0,
          fri: 0,
          sumate: 0,
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
              Control de la Asambleístas Departamentales por Población
            </h4>
          </div>
          {/* text-lg md:text-xl text-gray-600 mb-8 font-medium */}
          <p className="text-lg md:text-xl text-gray-600 mb-2 font-medium">
            Resultados — Asambleístas Departamentales por Población Pando
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
            {/* Asambleístas Departamentales por Población */}
            <h3 className="text-2xl font-bold text-[#416972] mb-8 text-center">
              Asambleístas Departamentales por Población
            </h3>
            <div className="grid grid-cols-1 gap-8 mb-12">
              {data.map((prov, i) => {
                const totalProv =
                  prov.upp +
                  prov.mda +
                  prov.mts +
                  prov.ngp +
                  prov.aupp +
                  prov.libre +
                  prov.mnr +
                  prov.fsutpc +
                  prov.fri +
                  prov.sumate +
                  prov.blancos +
                  prov.nulos;
                const values = showPercent
                  ? [
                      toPercent(prov.upp, totalProv),
                      toPercent(prov.mda, totalProv),
                      toPercent(prov.mts, totalProv),
                      toPercent(prov.ngp, totalProv),
                      toPercent(prov.aupp, totalProv),
                      toPercent(prov.libre, totalProv),
                      toPercent(prov.mnr, totalProv),
                      toPercent(prov.fsutpc, totalProv),
                      toPercent(prov.fri, totalProv),
                      toPercent(prov.sumate, totalProv),
                      toPercent(prov.blancos, totalProv),
                      toPercent(prov.nulos, totalProv),
                    ]
                  : [
                      prov.upp,
                      prov.mda,
                      prov.mts,
                      prov.ngp,
                      prov.aupp,
                      prov.libre,
                      prov.mnr,
                      prov.fsutpc,
                      prov.fri,
                      prov.sumate,
                      prov.blancos,
                      prov.nulos,
                    ];
                const barData = {
                  labels: [
                    "UPP",
                    "MDA",
                    "MTS",
                    "NGP",
                    "AUPP",
                    "LIBRE",
                    "MNR",
                    "FSUTPC",
                    "FRI",
                    "SUMATE",
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
                        "#663d2b",
                        "#E11D48",
                        "#ff84b0",
                        "#5c9743",
                        "#014995",
                        "#5e2572",
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
