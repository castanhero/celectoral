import { useMemo } from "react";
import { Bar, Pie } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import type { ChartOptions } from "chart.js";

const ETIQUETAS_PARTIDOS = [
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
];
const ETIQUETAS_COLOR = [
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
];

interface BarraGeneralPro {
  totals: Record<string, number>;
  totalGeneral: number;
  showPercent: boolean;
  chartKey: number;
}

export default function BarGeneral({
  totals,
  totalGeneral,
  showPercent,
  chartKey,
}: BarraGeneralPro) {
  const values = useMemo(() => {
    const raw = [
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
    ];
    return showPercent
      ? raw.map((v) => parseFloat(((v / totalGeneral) * 100).toFixed(2)))
      : raw;
  }, [totals, totalGeneral, showPercent]);

  const barData = useMemo(
    () => ({
      labels: ETIQUETAS_PARTIDOS,
      datasets: [
        {
          label: "Total General",
          data: values,
          backgroundColor: ETIQUETAS_COLOR,
          borderRadius: 6,
          borderSkipped: false,
        },
      ],
    }),
    [values],
  );

  const options = useMemo<ChartOptions<"bar">>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        datalabels: {
          anchor: "end",
          align: "end",
          offset: 2,
          font: { size: 10, weight: "bold" },
          color: "#333",
          formatter: (value: number) =>
            value > 0
              ? showPercent
                ? `${value.toFixed(2)}%`
                : `${value.toLocaleString()}`
              : "",
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grace: "15%",
          ticks: {
            callback: (val) =>
              showPercent ? `${val}%` : Number(val).toLocaleString(),
          },
        },
        x: {
          ticks: { font: { size: 10, weight: "bold" } },
        },
      },
    }),
    [showPercent],
  );

  return (
    <div className="bg-white/80 rounded-2xl shadow-lg p-6 mb-8">
      <h3 className="text-2xl font-bold text-[#416972] mb-6 text-center">
        Distribucion Departamental 
      </h3>
      <div className="w-full h-[350px] md:h-[300px]">
        <Bar
          key={chartKey}
          data={barData}
          options={options}
          plugins={[ChartDataLabels]}
        />
      </div>
    </div>
  );
}
