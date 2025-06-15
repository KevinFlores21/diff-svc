"use client"

import { useState, useEffect } from "react"
import type { Turno } from "@/types"

export function useTurnos() {
  const [turnos, setTurnos] = useState<Turno[]>([])

  useEffect(() => {
    const turnosGuardados = localStorage.getItem("turnos")
    if (turnosGuardados) {
      setTurnos(JSON.parse(turnosGuardados))
    }
  }, [])

  const guardarTurnos = (nuevosTurnos: Turno[]) => {
    setTurnos(nuevosTurnos)
    localStorage.setItem("turnos", JSON.stringify(nuevosTurnos))
  }

  const agregarTurno = (turno: Turno) => {
    const nuevosTurnos = [...turnos, turno]
    guardarTurnos(nuevosTurnos)
  }

  const eliminarTurno = (index: number) => {
    const nuevosTurnos = turnos.filter((_, i) => i !== index)
    guardarTurnos(nuevosTurnos)
  }

  return {
    turnos,
    agregarTurno,
    eliminarTurno,
  }
}
