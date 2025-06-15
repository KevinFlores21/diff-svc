export interface Turno {
  hora: string
  nombre: string
  numero: string
  pagado?: boolean
  metodoPago?: "efectivo" | "nequi"
  imagen?: string
  fecha: string // Nueva propiedad para tracking de fecha
}

export interface EncuestaData {
  satisfaccion: "excelente" | "buena" | "mala"
}

export interface Servicio {
  id: string
  nombre: string
  precio: number
  imagen?: string
}

export interface Configuracion {
  numeroNequi: string
  servicios: Servicio[]
  fotosCortes: FotoCorte[]
  ultimaLimpieza: string // Para tracking del reset diario
}

export interface FotoCorte {
  id: string
  url: string
  descripcion?: string
  fechaSubida: string
}
