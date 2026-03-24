export interface PuntoVoto {
  id: string;
  recinto: string;
  mesa: string;
  lat: number;
  lng: number;
  habilitados: number;
  validos: number;
  blancos: number;
  nulos: number;
  votos: {
    LIBRE: number;
    UPP: number;
    MTS: number;
    SUMATE: number;
    AUPP: number;
    NGP: number;
    FRI: number;
    MNR: number;
    MDA: number;
  };
}