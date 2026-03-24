import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import type { PuntoVoto } from "../utils/types";

const coloresPartido: Record<string, string> = {
  LIBRE: "#E11D48",
  UPP: "#025744",
  MTS: "#006d36",
  SUMATE: "#5e2572",
  AUPP: "#663d2b",
  NGP: "#16a7e0",
  FRI: "#014995",
  MNR: "#ff84b0",
  MDA: "#fcbf28",
};

function getGanador(votos: PuntoVoto["votos"]) {
  const entries = Object.entries(votos);
  if (!entries.length) return null;
  return entries.reduce((max, curr) => (curr[1] > max[1] ? curr : max));
}

interface Props {
  puntos: PuntoVoto[];
}

export default function MapaVotosCobija({ puntos }: Props) {
  const center: [number, number] = [-11.03, -68.78]; // centro Cobija aprox
  const maxValidos =
    puntos.length > 0
      ? Math.max(...puntos.map((p) => p.validos || 0))
      : 0;

  const scaleRadius = (validos: number) => {
    if (maxValidos <= 0) return 4;
    const minR = 6;
    const maxR = 25;
    return minR + ((validos / maxValidos) * (maxR - minR));
  };

  return (
    <div className="w-full h-[600px] rounded-2xl overflow-hidden shadow-lg border border-gray-200">
      <MapContainer
        center={center}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {puntos.map((p) => {
          const ganador = getGanador(p.votos);
          const color =
            (ganador && coloresPartido[ganador[0]]) || "#4b5563";

          const radius = scaleRadius(p.validos);

          const totalEmitidos = p.validos + p.blancos + p.nulos;

          return (
            <CircleMarker
              key={p.id}
              center={[p.lat, p.lng]}
              radius={radius}
              pathOptions={{
                color,
                fillColor: color,
                fillOpacity: 0.75,
                weight: 1.5,
              }}
            >
              <Popup>
                <div className="text-xs md:text-sm space-y-1">
                  <p className="font-bold text-gray-800">
                    {p.recinto} — Mesa {p.mesa}
                  </p>
                  <p className="text-gray-600">
                    Habilitados:{" "}
                    <strong>{p.habilitados.toLocaleString()}</strong>
                  </p>
                  <p className="text-gray-600">
                    Válidos:{" "}
                    <strong className="text-emerald-700">
                      {p.validos.toLocaleString()}
                    </strong>{" "}
                    ({(
                      (p.validos * 100) /
                      (p.habilitados || 1)
                    ).toFixed(1)}
                    % de habilitados)
                  </p>
                  <p className="text-gray-600">
                    Blancos:{" "}
                    <strong>{p.blancos.toLocaleString()}</strong> · Nulos:{" "}
                    <strong>{p.nulos.toLocaleString()}</strong>
                  </p>
                  <p className="text-gray-500">
                    Total emitidos:{" "}
                    <strong>{totalEmitidos.toLocaleString()}</strong>
                  </p>
                  <hr className="my-1" />
                  <p className="font-semibold text-gray-700">
                    Resultados por partido:
                  </p>
                  <ul className="space-y-0.5 max-h-40 overflow-auto pr-1">
                    {Object.entries(p.votos)
                      .sort((a, b) => b[1] - a[1])
                      .map(([partido, v]) => (
                        <li key={partido}>
                          <span
                            className="inline-block w-2 h-2 rounded-full mr-1 align-middle"
                            style={{ backgroundColor: coloresPartido[partido] }}
                          />
                          <span className="font-semibold">{partido}:</span>{" "}
                          {v.toLocaleString()}{" "}
                          {p.validos > 0 && (
                            <span className="text-gray-500">
                              (
                              {((v * 100) / p.validos).toFixed(1)}
                              %)
                            </span>
                          )}
                        </li>
                      ))}
                  </ul>
                  {ganador && (
                    <p className="mt-1 text-[11px] text-gray-500">
                      Ganador en este recinto:{" "}
                      <strong>{ganador[0]}</strong> con{" "}
                      <strong>{ganador[1].toLocaleString()}</strong> votos.
                    </p>
                  )}
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}