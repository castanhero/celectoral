import { useEffect, useState } from "react";
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
}

export default function ChartsSection() {
  const [data, setData] = useState<ElectoralData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecinto, setSelectedRecinto] = useState<string | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [showPercent, setShowPercent] = useState(false);
  const [chartKey, setChartKey] = useState(0);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    var apiUrl: string = `https://opensheet.elk.sh/1knAESA0L-1BPvAR-pAXpVtnWacv6LiLeI4_Gbz2Czr4/RESULTADO`;
    try {
      const response = await fetch(
        apiUrl
      );
      if (!response.ok) throw new Error("Error al cargar datos");

      const jsonData = await response.json();
      const formattedData: ElectoralData[] = jsonData
        .filter((row: any) => row.Recinto && row.Recinto !== "TOTAL")
        .map((row: any) => ({
          recinto: row.Recinto,
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
        }));

        console.log("Datos formateados:", formattedData);

      if (formattedData.length === 0)
        throw new Error("No se encontraron recintos.");

      setData(formattedData);
    } catch (err: any) {
      console.error(err);
      setError("Error cargando datos desde Google Sheets. Usando datos de ejemplo.",);
      setData([
        { recinto: "U. E. Manuela Rojas", fsutpc: 400, libre: 350, upp: 25, mts: 50, sumate: 35, aupp: 50, ngp: 50, fri: 50, mnr: 50, mda: 250, blancos: 20, nulos: 10},
        { recinto: "U. E. Simon Bolivar", fsutpc: 400, libre: 350, upp: 25, mts: 50, sumate: 35, aupp: 50, ngp: 50, fri: 50, mnr: 50, mda: 250, blancos: 20, nulos: 10},
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Totales seguros
  const totals = data.reduce(
    (acc, curr) => {
      acc.fsutpc += Number(curr.fsutpc) || 0;
      acc.libre += Number(curr.libre) || 0;
      acc.upp += Number(curr.upp) || 0;
      acc.mts += Number(curr.mts) || 0;
      acc.sumate += Number(curr.sumate) || 0;
      acc.aupp += Number(curr.aupp) || 0;
      acc.ngp += Number(curr.ngp) || 0;
      acc.fri += Number(curr.fri) || 0;
      acc.mnr += Number(curr.mnr) || 0;
      acc.mda += Number(curr.mda) || 0;
      acc.blancos += Number(curr.blancos) || 0;
      acc.nulos += Number(curr.nulos) || 0;
      return acc;
    },
    {fsutpc:0 ,libre:0 ,upp:0 ,mts:0 ,sumate:0 ,aupp:0 ,ngp:0 ,fri:0 ,mnr:0 ,mda:0 ,blancos:0 ,nulos:0},
  );

  const totalGeneral = totals.fsutpc + totals.libre + totals.upp + totals.mts + totals.sumate + totals.aupp + totals.ngp + totals.fri + totals.mnr + totals.mda + totals.blancos + totals.nulos;

  const toPercent = (value: number, total: number) =>
    total > 0 ? Math.round((value / total) * 100) : 0;

  const displayValue = (value: number, total?: number) =>
    showPercent && total && total > 0
      ? `${toPercent(value, total)}%`
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
        const percentage = ((value * 100) / total).toFixed(1) + "%";
        return showPercent
          ? percentage                   // solo porcentaje
          : `${value}\n${percentage}`;   // votos + porcentaje
      },
    },
  },
};

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
            ? `${value.toFixed(1)}%`
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

  const pieGeneralData = {
    labels: ["FSUTPC","LIBRE","UPP","MTS","SUMATE","AUPP","NGP","FRI","MNR","MDA","BLANCOS","NULOS"],
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
          : [totals.fsutpc, totals.libre, totals.upp, totals.mts, totals.sumate, totals.aupp, totals.ngp, totals.fri, totals.mnr, totals.mda, totals.blancos, totals.nulos],
        backgroundColor: ["#5c9743","#E11D48","#025744","#006d36","#5e2572","#663d2b","#16a7e0","#014995","#ff84b0","#fcbf28","#ffffff","#777777"],
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
    ? data.find((d) => d.recinto === selectedProvince)
    : null;

  return (
    /* className="py-12 bg-gradient-to-b from-gray-50 via-white to-gray-100 */
    <section className="py-3 bg-gradient-to-b from-gray-50 via-white to-gray-100">
      <div className="container mx-auto px-3 md:px-8">
        {/* Encabezado text-center mb-12 */}
        <div className="text-center mb-6">
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 mb-2">
            <BarChart3 className="w-10 h-10 text-[#416972] drop-shadow-sm" />
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#416972] tracking-tight">
              Control Municipal Electoral 2026
            </h2>
          </div>
          {/* text-lg md:text-xl text-gray-600 mb-8 font-medium */}
          <p className="text-lg md:text-xl text-gray-600 mb-2 font-medium">
            Resultados — Municipio de Cobija
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={fetchData}
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#416972] to-[#5f8a8d] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition disabled:opacity-50">
              <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}/>
              Actualizar Datos
            </button>
            <button onClick={handleTogglePercent} className="inline-flex items-center gap-2 px-6 py-2.5 border-2 border-[#416972] text-[#416972] font-semibold rounded-lg hover:bg-[#416972]/10 transition">
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
              </h3>
              {/* FSUTPC,LIBRE,UPP,MTS,APB-SUMATE,AUPP,NGP,FRI,MNR,MDA */}
              <div className="grid grid-cols-2 md:grid-cols-6 gap-5 text-center">
                <div className="p-4 bg-[#5c9743]/10 rounded-xl">
                  <h4 className="text-lg font-semibold text-[#5c9743]">FSUTPC</h4>
                  <p className="text-3xl font-bold text-[#5c9743] mt-1">
                    {displayValue(totals.fsutpc, totalGeneral)}
                  </p>
                </div>

                <div className="p-4 bg-red-100 rounded-xl">
                  <h4 className="text-lg font-semibold text-red-800">LIBRE</h4>
                  <p className="text-3xl font-bold text-red-800 mt-1">
                    {displayValue(totals.libre, totalGeneral)}
                  </p>
                </div>

                <div className="p-6 bg-[#025744]/10 rounded-xl">
                  <h4 className="text-lg font-semibold text-[#025744]">UPP</h4>
                  <p className="text-3xl font-bold text-[#025744] mt-1">
                    {displayValue(totals.upp, totalGeneral)}
                  </p>
                </div>

                <div className="p-6 bg-[#006d36]/10 rounded-xl">
                  <h4 className="text-lg font-semibold text-[#006d36]">MTS</h4>
                  <p className="text-3xl font-bold text-[#006d36] mt-1">
                    {displayValue(totals.mts, totalGeneral)}
                  </p>
                </div>

                <div className="p-6 bg-[#5e2572]/10 rounded-xl">
                  <h4 className="text-lg font-semibold text-[#5e2572]">SUMATE</h4>
                  <p className="text-3xl font-bold text-[#5e2572] mt-1">
                    {displayValue(totals.sumate, totalGeneral)}
                  </p>
                </div>

                <div className="p-6 bg-[#663d2b]/10 rounded-xl">
                  <h4 className="text-lg font-semibold text-[#663d2b]">AUPP</h4>
                  <p className="text-3xl font-bold text-[#663d2b] mt-1">
                    {displayValue(totals.aupp, totalGeneral)}
                  </p>
                </div>

                <div className="p-6 bg-[#16a7e0]/10 rounded-xl">
                  <h4 className="text-lg font-semibold text-[#16a7e0]">NGP</h4>
                  <p className="text-3xl font-bold text-[#16a7e0] mt-1">
                    {displayValue(totals.ngp, totalGeneral)}
                  </p>
                </div>

                <div className="p-6 bg-[#014995]/10 rounded-xl">
                  <h4 className="text-lg font-semibold text-[#014995]">FRI</h4>
                  <p className="text-3xl font-bold text-[#014995] mt-1">
                    {displayValue(totals.fri, totalGeneral)}
                  </p>
                </div>

                <div className="p-6 bg-[#ff84b0]/10 rounded-xl">
                  <h4 className="text-lg font-semibold text-[#ff84b0]">MNR</h4>
                  <p className="text-3xl font-bold text-[#ff84b0] mt-1">
                    {displayValue(totals.mnr, totalGeneral)}
                  </p>
                </div>

                <div className="p-6 bg-[#fcbf28]/10 rounded-xl">
                  <h4 className="text-lg font-semibold text-[#fcbf28]">MDA</h4>
                  <p className="text-3xl font-bold text-[#fcbf28] mt-1">
                    {displayValue(totals.mda, totalGeneral)}
                  </p>
                </div>

                <div className="p-4 bg-[#000000]/10 rounded-xl">
                  <h4 className="text-lg font-semibold text-[#000000]">BLANCO</h4>
                  <p className="text-3xl font-bold text-[#000000] mt-1">
                    {displayValue(totals.blancos, totalGeneral)}
                  </p>
                </div>

                <div className="p-4 bg-[#7f7c7c]/10 rounded-xl">
                  <h4 className="text-lg font-semibold text-gray-800">NULO</h4>
                  <p className="text-3xl font-bold text-gray-800 mt-1">
                    {displayValue(totals.nulos, totalGeneral)}
                  </p>
                </div>
              </div>
            </div>

            {/* Torta general */}
            <div className="bg-white/80 rounded-2xl shadow-lg p-8 mb-12">
              <h3 className="text-2xl font-bold text-[#416972] mb-6 text-center">
                Distribución Total
              </h3>
              <div className="flex justify-center">
                <div className="w-full md:w-1/2 h-[300px] md:h-80">
                  <Pie key={chartKey} data={pieGeneralData} options={pieOption} plugins={[ChartDataLabels]}/>
                  {/* <Pie key={chartKey} data={pieGeneralData} options={chartOption}/> */}
                </div>
              </div>
            </div>
            
            {/* Comparación por provincia */}
            <h3 className="text-2xl font-bold text-[#416972] mb-8 text-center">
              Comparación por Recintos en Municipio Cobija
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {data.map((prov, i) => {
                const totalProv = prov.fsutpc + prov.libre + prov.upp + prov.mts + prov.sumate + prov.aupp + prov.ngp + prov.fri + prov.mnr + prov.mda + prov.blancos + prov.nulos;
                const values = showPercent
                  ? [
                    toPercent(prov.fsutpc, totalProv),
                    toPercent(prov.libre, totalProv),
                    toPercent(prov.upp, totalProv),
                    toPercent(prov.mts, totalProv),
                    toPercent(prov.sumate, totalProv),
                    toPercent(prov.aupp, totalProv),
                    toPercent(prov.ngp, totalProv),
                    toPercent(prov.fri, totalProv),
                    toPercent(prov.mnr, totalProv),
                    toPercent(prov.mda, totalProv),
                    toPercent(prov.blancos, totalProv),
                    toPercent(prov.nulos, totalProv),
                    ]
                  : [prov.fsutpc,prov.libre,prov.upp,prov.mts,prov.sumate,prov.aupp,prov.ngp,prov.fri,prov.mnr,prov.mda,prov.blancos,prov.nulos]
                const barData = {                  
                  labels: ["FSUTPC", "LIBRE", "UPP", "MTS", "SUMATE", "AUPP", "NGP", "FRI", "MNR", "MDA", "BLANCO", "NULO"],
                  datasets: [
                    {
                      label: prov.recinto,
                      data: values,
                      backgroundColor: ["#5c9743","#E11D48","#025744","#006d36","#5e2572","#663d2b","#16a7e0","#014995","#ff84b0","#fcbf28","#dbd2d2","#777777"],
                    },
                  ],
                };

                return (
                  <div
                    key={`${i}-${showPercent}`}
                    className="bg-white/80 rounded-xl shadow-md hover:shadow-lg transition p-5"
                  >
                    <h4 className="text-lg md:text-xl font-bold text-center text-gray-800 mb-4">
                      {prov.recinto}
                    </h4>
                    <div className="h-[300px] md:h-72">
                      <Bar data={barData} options={chartOptions} plugins={[ChartDataLabels]} />
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
