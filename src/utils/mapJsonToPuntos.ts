import type { PuntoVoto } from "./types";

export function mapJsonToPuntos(raw: any[]): PuntoVoto[] {
  return raw
    .filter((row) => row.Recinto && row.Recinto !== "TOTAL")
    .map((row, index) => ({
      id: `${row.Recinto}-${row.Mesa ?? index}`,
      recinto: row.Recinto,
      mesa: row.Mesa?.toString() ?? "",
      lat: parseFloat(String(row.latitud).replace(",", ".")),
      lng: parseFloat(String(row.longitud).replace(",", ".")),
      habilitados: Number(row.Habilitados) || 0,
      validos: Number(row.VALIDOS) || 0,
      blancos: Number(row.BLANCOS) || 0,
      nulos: Number(row.NULOS) || 0,
      votos: {
        LIBRE: Number(row.LIBRE) || 0,
        UPP: Number(row.UPP) || 0,
        MTS: Number(row.MTS) || 0,
        SUMATE: Number(row.SUMATE) || 0,
        AUPP: Number(row.AUPP) || 0,
        NGP: Number(row.NGP) || 0,
        FRI: Number(row.FRI) || 0,
        MNR: Number(row.MNR) || 0,
        MDA: Number(row.MDA) || 0,
      },
    }))
    .filter((p) => !Number.isNaN(p.lat) && !Number.isNaN(p.lng));
}