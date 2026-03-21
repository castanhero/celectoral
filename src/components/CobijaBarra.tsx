import { useMemo } from "react";
import { Bar,Pie } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import type { ChartOptions } from "chart.js";

const ETIQUETAS_PARTIDOS = [
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
  "BLANCO",
  "NULO",
];
const ETIQUETAS_COLOR = [
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
        Votos Generales
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
