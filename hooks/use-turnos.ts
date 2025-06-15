"use client"

import { useState, useEffect } from "react"
import type { DiasSemana } from "@/types"

const HORARIOS_DISPONIBLES = [
  "8:00 AM",
  "8:40 AM",
  "9:20 AM",
  "10:00 AM",
  "10:40 AM",
  "11:20 AM",
  "2:00 PM",
  "2:40 PM",
  "3:20 PM",
  "4:00 PM",
  "4:40 PM",
  "5:20 PM",
  "6:00 PM",
  "6:40 PM",
  "7:20 PM",
]

const DIAS_SEMANA: DiasSemana[] = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"]

export function useTurnos() {
  const [turnos, setTurnos] = useState<Record<string, string>>({})
  const [diaActual, setDiaActual] = useState<DiasSemana>("lunes")

  useEffect(() => {
    const hoy = new Date()
    const dia = DIAS_SEMANA[hoy.getDay()]
    setDiaActual(dia)

    const turnosGuardados = localStorage.getItem("turnos")
    if (turnosGuardados) {
      setTurnos(JSON.parse(turnosGuardados))
    }
  }, [])

  const guardarTurnos = (nuevosTurnos: Record<string, string>) => {
    setTurnos(nuevosTurnos)
    localStorage.setItem("turnos", JSON.stringify(nuevosTurnos))
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
