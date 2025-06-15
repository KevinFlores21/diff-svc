"use client"

import { useState, useEffect } from "react"
import type { DiasSemana } from "@/types"

const HORARIOS_DISPONIBLES = [
  // Mañana: 8:00 AM a 12:00 PM (cada 40 minutos)
  "8:00 AM",
  "8:40 AM",
  "9:20 AM",
  "10:00 AM",
  "10:40 AM",
  "11:20 AM",
  "12:00 PM",
  // Tarde: 2:00 PM a 8:00 PM (cada 40 minutos)
  "2:00 PM",
  "2:40 PM",
  "3:20 PM",
  "4:00 PM",
  "4:40 PM",
  "5:20 PM",
  "6:00 PM",
  "6:40 PM",
  "7:20 PM",
  "8:00 PM",
]

const DIAS_SEMANA: DiasSemana[] = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"]

export function useTurnos() {
  const [turnos, setTurnos] = useState<Record<string, string>>({})
  const [diaActual, setDiaActual] = useState<DiasSemana>("lunes")

  useEffect(() => {
    // Obtener el día actual
    const hoy = new Date()
    const dia = DIAS_SEMANA[hoy.getDay()]
    setDiaActual(dia)

    // Cargar turnos guardados
    try {
      const turnosGuardados = localStorage.getItem("turnos")
      if (turnosGuardados) {
        const turnosParsed = JSON.parse(turnosGuardados)
        setTurnos(turnosParsed)
      }
    } catch (error) {
      console.error("Error al cargar turnos:", error)
      setTurnos({})
    }
  }, []) // Array de dependencias vacío para que solo se ejecute una vez

  const guardarTurnos = (nuevosTurnos: Record<string, string>) => {
    try {
      setTurnos(nuevosTurnos)
      localStorage.setItem("turnos", JSON.stringify(nuevosTurnos))
    } catch (error) {
      console.error("Error al guardar turnos:", error)
    }
  }

  const agregarTurno = (hora: string, nombre: string, numero: string) => {
    const nuevosTurnos = { ...turnos, [hora]: `${nombre} (${numero})` }
    guardarTurnos(nuevosTurnos)
  }

  const eliminarTurno = (hora: string) => {
    const nuevosTurnos = { ...turnos }
    delete nuevosTurnos[hora]
    guardarTurnos(nuevosTurnos)
  }

  const obtenerHorariosDisponibles = () => {
    if (diaActual === "miércoles") return []

    if (diaActual === "domingo") {
      return HORARIOS_DISPONIBLES.filter((hora) => hora <= "6:40 PM")
    }

    return HORARIOS_DISPONIBLES
  }

  return {
    turnos,
    diaActual,
    agregarTurno,
    eliminarTurno,
    obtenerHorariosDisponibles,
  }
}
