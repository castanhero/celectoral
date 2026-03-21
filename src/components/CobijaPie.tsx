import { useMemo } from "react";
import { Pie } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import type { ChartOptions } from "chart.js";

const ETIQUETAS_PARTIDOS = ["FSUTPC","LIBRE","UPP","MTS","SUMATE","AUPP","NGP","FRI","MNR","MDA","BLANCO","NULO"];
const ETIQUETAS_COLOR = ["#5c9743","#E11D48","#025744","#006d36","#5e2572","#663d2b","#16a7e0","#014995","#ff84b0","#fcbf28","#dbd2d2","#777777"];

interface PieGeneralPro {
  totals: Record<string, number>;
  totalGeneral: number;
  showPercent: boolean;
  chartKey: number;
}



export default function PieGeneral({ totals, totalGeneral, showPercent, chartKey }: PieGeneralPro) {

  const pieData = useMemo(() => {
    const raw = [
      totals.fsutpc, totals.libre, totals.upp,  totals.mts,
      totals.sumate, totals.aupp,  totals.ngp,  totals.fri,
      totals.mnr,    totals.mda,   totals.blancos, totals.nulos,
    ];
    return {
      labels: ETIQUETAS_PARTIDOS,
      datasets: [{
        data: showPercent
          ? raw.map((v) => parseFloat(((v / totalGeneral) * 100).toFixed(2)))
          : raw,
        backgroundColor: ETIQUETAS_COLOR,
        borderWidth: 3,
        borderColor: "#F9FAFB",
      }],
    };
  }, [totals, totalGeneral, showPercent]);


  
const pieOption = useMemo<ChartOptions<"pie">>(() => ({
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
}), [showPercent]);

  return (
    <div className="bg-white/80 rounded-2xl shadow-lg p-6 mb-8">
      <h3 className="text-2xl font-bold text-[#416972] mb-6 text-center">
        Distribución Total de Circular
      </h3>
      <div className="flex justify-center">
        <div className="w-full md:w-2/3 lg:w-1/2 h-[300px] md:h-[320px]">
          <Pie
            key={chartKey}
            data={pieData}
            options={pieOption}
            plugins={[ChartDataLabels]}
          />
        </div>
      </div>
    </div>
  );
}

