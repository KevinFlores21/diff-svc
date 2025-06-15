"use client"

import { useState, useEffect } from "react"
import type { ConfiguracionApp, ServicioPago } from "@/types"

const CONFIGURACION_INICIAL: ConfiguracionApp = {
  numeroNequi: "3167530191",
  cuentaBancolombia: "12345678901",
  servicios: [
    {
      id: "1",
      nombre: "Corte con Diseño",
      precio: 20000,
      descripcion: "Corte moderno con diseños personalizados y acabado profesional",
      duracion: "40 min",
      popular: true,
    },
    {
      id: "2",
      nombre: "Corte con Barba",
      precio: 28000,
      descripcion: "Corte completo + arreglo de barba con técnicas profesionales",
      duracion: "60 min",
      popular: true,
    },
    {
      id: "3",
      nombre: "Corte para Niños",
      precio: 18000,
      descripcion: "Corte especial para niños con paciencia y cuidado",
      duracion: "30 min",
    },
  ],
  version: "1.0",
}

export function useConfiguracion() {
  const [configuracion, setConfiguracion] = useState<ConfiguracionApp>(CONFIGURACION_INICIAL)

  useEffect(() => {
    const configGuardada = localStorage.getItem("configuracion-app")
    if (configGuardada) {
      try {
        const config = JSON.parse(configGuardada)
        setConfiguracion({ ...CONFIGURACION_INICIAL, ...config })
      } catch (error) {
        console.error("Error al cargar configuración:", error)
        setConfiguracion(CONFIGURACION_INICIAL)
      }
    }
  }, [])

  const guardarConfiguracion = (nuevaConfig: ConfiguracionApp) => {
    setConfiguracion(nuevaConfig)
    localStorage.setItem("configuracion-app", JSON.stringify(nuevaConfig))
  }

  const actualizarNumeroNequi = (numero: string) => {
    const nuevaConfig = { ...configuracion, numeroNequi: numero }
    guardarConfiguracion(nuevaConfig)
  }

  const actualizarCuentaBancolombia = (cuenta: string) => {
    const nuevaConfig = { ...configuracion, cuentaBancolombia: cuenta }
    guardarConfiguracion(nuevaConfig)
  }

  const actualizarServicio = (servicioId: string, datosActualizados: Partial<ServicioPago>) => {
    const serviciosActualizados = configuracion.servicios.map((servicio) =>
      servicio.id === servicioId ? { ...servicio, ...datosActualizados } : servicio,
    )
    const nuevaConfig = { ...configuracion, servicios: serviciosActualizados }
    guardarConfiguracion(nuevaConfig)
  }

  const agregarServicio = (nuevoServicio: Omit<ServicioPago, "id">) => {
    const servicio: ServicioPago = {
      ...nuevoServicio,
      id: Date.now().toString(),
    }
    const nuevaConfig = {
      ...configuracion,
      servicios: [...configuracion.servicios, servicio],
    }
    guardarConfiguracion(nuevaConfig)
  }

  const eliminarServicio = (servicioId: string) => {
    const serviciosFiltrados = configuracion.servicios.filter((s) => s.id !== servicioId)
    const nuevaConfig = { ...configuracion, servicios: serviciosFiltrados }
    guardarConfiguracion(nuevaConfig)
  }

  return {
    configuracion,
    actualizarNumeroNequi,
    actualizarCuentaBancolombia,
    actualizarServicio,
    agregarServicio,
    eliminarServicio,
  }
}
