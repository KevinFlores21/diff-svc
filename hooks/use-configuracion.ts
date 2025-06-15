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

  const crearRespaldoConfiguracion = () => {
    const respaldo = {
      fecha: new Date().toISOString(),
      configuracion: configuracion,
      version: "1.0",
    }

    const dataStr = JSON.stringify(respaldo, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })

    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `configuracion-respaldo-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    return respaldo
  }

  const restaurarConfiguracion = (archivo: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const respaldo = JSON.parse(e.target?.result as string)
          if (respaldo.configuracion) {
            guardarConfiguracion(respaldo.configuracion)
            resolve()
          } else {
            reject(new Error("Formato de respaldo inválido"))
          }
        } catch (error) {
          reject(error)
        }
      }
      reader.onerror = reject
      reader.readAsText(archivo)
    })
  }

  return {
    configuracion,
    actualizarNumeroNequi,
    actualizarCuentaBancolombia,
    actualizarServicio,
    crearRespaldoConfiguracion,
    restaurarConfiguracion,
  }
}
