export interface Turno {
  hora: string
  nombre: string
  numero: string
}

export interface EncuestaData {
  satisfaccion: "Excelente" | "Bueno" | "Regular" | "Malo"
}

export type DiasSemana = "domingo" | "lunes" | "martes" | "miércoles" | "jueves" | "viernes" | "sábado"

export interface FotoCorte {
  id: string
  url: string
  titulo: string
  descripcion: string
  fecha: string
}
