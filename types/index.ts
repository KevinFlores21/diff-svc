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
  tipo?: "destacada" | "adicional"
  posicion?: number
}

export interface ServicioPago {
  id: string
  nombre: string
  precio: number
  descripcion: string
  duracion: string
  popular?: boolean
}

export interface MetodoPago {
  id: string
  nombre: string
  tipo: "nequi" | "bancolombia" | "pse" | "efectivo"
  numero?: string
  qr?: string
  instrucciones: string
  logo?: string
  enlaceDirecto?: string
}

export interface ConfiguracionApp {
  numeroNequi: string
  cuentaBancolombia: string
  servicios: ServicioPago[]
  version: string
}
