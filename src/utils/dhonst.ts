// utils/dhondt.ts
export interface SeatResult {
  partido: string;
  votos: number;
  escanos: number;
  color: string;
  porcentaje: number;
}

export function calcularDHondt(
  partidos: { nombre: string; votos: number; color: string }[],
  totalEscanos: number,
): SeatResult[] {
  // Filtrar partidos sin votos válidos
  const validos = partidos.filter((p) => p.votos > 0);

  // Generar tabla de cocientes: votos / 1, 2, 3, ..., totalEscanos
  const cocientes: { partido: string; valor: number; color: string; votos: number }[] = [];
  validos.forEach((p) => {
    for (let i = 1; i <= totalEscanos; i++) {
      cocientes.push({
        partido: p.nombre,
        valor:   p.votos / i,
        color:   p.color,
        votos:   p.votos,
      });
    }
  });

  // Ordenar de mayor a menor y tomar los N mejores cocientes
  cocientes.sort((a, b) => b.valor - a.valor);
  const ganadores = cocientes.slice(0, totalEscanos);

  // Contar escaños por partido
  const totalVotos = validos.reduce((s, p) => s + p.votos, 0);
  const resultado: Record<string, SeatResult> = {};

  validos.forEach((p) => {
    resultado[p.nombre] = {
      partido:    p.nombre,
      votos:      p.votos,
      escanos:    0,
      color:      p.color,
      porcentaje: totalVotos > 0 ? parseFloat(((p.votos / totalVotos) * 100).toFixed(2)) : 0,
    };
  });

  ganadores.forEach((g) => {
    resultado[g.partido].escanos++;
  });

  return Object.values(resultado)
    .filter((r) => r.escanos > 0)
    .sort((a, b) => b.escanos - a.escanos);
}