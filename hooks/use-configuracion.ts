"use client"

import { useState, useEffect } from "react"
import type { Configuracion, Servicio, FotoCorte } from "@/types"

const CONFIGURACION_INICIAL: Configuracion = {
  numeroNequi: "3167530191",
  servicios: [
    { id: "1", nombre: "Corte sencillo", precio: 10000 },
    { id: "2", nombre: "Corte + Diseño", precio: 15000 },
    { id: "3", nombre: "Afeitada", precio: 8000 },
  ],
  fotosCortes: [
    {
      id: "1",
      url: "/placeholder.svg?height=200&width=200",
      descripcion: "Corte clásico",
      fechaSubida: new Date().toISOString(),
    },
    {
      id: "2",
      url: "/placeholder.svg?height=200&width=200",
      descripcion: "Diseño moderno",
      fechaSubida: new Date().toISOString(),
    },
  ],
  ultimaLimpieza: new Date().toDateString(),
}

export function useConfiguracion() {
  const [configuracion, setConfiguracion] = useState<Configuracion>(CONFIGURACION_INICIAL)

  useEffect(() => {
    const configGuardada = localStorage.getItem("configuracion")
    if (configGuardada) {
      setConfiguracion(JSON.parse(configGuardada))
    }
  }, [])

  const guardarConfiguracion = (nuevaConfig: Configuracion) => {
    setConfiguracion(nuevaConfig)
    localStorage.setItem("configuracion", JSON.stringify(nuevaConfig))
  }

  const actualizarNumeroNequi = (numero: string) => {
    const nuevaConfig = { ...configuracion, numeroNequi: numero }
    guardarConfiguracion(nuevaConfig)
  }

  const actualizarServicio = (servicio: Servicio) => {
    const serviciosActualizados = configuracion.servicios.map((s) => (s.id === servicio.id ? servicio : s))
    const nuevaConfig = { ...configuracion, servicios: serviciosActualizados }
    guardarConfiguracion(nuevaConfig)
  }

  const agregarFotoCorte = (url: string, descripcion?: string) => {
    const nuevaFoto: FotoCorte = {
      id: Date.now().toString(),
      url,
      descripcion,
      fechaSubida: new Date().toISOString(),
    }
    const nuevaConfig = {
      ...configuracion,
      fotosCortes: [...configuracion.fotosCortes, nuevaFoto],
    }
    guardarConfiguracion(nuevaConfig)
  }

  const eliminarFotoCorte = (id: string) => {
    const nuevaConfig = {
      ...configuracion,
      fotosCortes: configuracion.fotosCortes.filter((foto) => foto.id !== id),
    }
    guardarConfiguracion(nuevaConfig)
  }

  return {
    configuracion,
    actualizarNumeroNequi,
    actualizarServicio,
    agregarFotoCorte,
    eliminarFotoCorte,
  }
}
