"use client"

import { useState, useEffect } from "react"
import type { Turno } from "@/types"

export function useTurnos() {
  const [turnos, setTurnos] = useState<Turno[]>([])

  useEffect(() => {
    const hoy = new Date().toDateString()
    const turnosGuardados = localStorage.getItem("turnos")
    const ultimaLimpieza = localStorage.getItem("ultimaLimpieza")

    // Reset diario de turnos
    if (ultimaLimpieza !== hoy) {
      localStorage.setItem("turnos", JSON.stringify([]))
      localStorage.setItem("ultimaLimpieza", hoy)
      setTurnos([])
    } else if (turnosGuardados) {
      const turnosParseados = JSON.parse(turnosGuardados)
      // Filtrar turnos del día actual
      const turnosHoy = turnosParseados.filter((turno: Turno) => turno.fecha === hoy)
      setTurnos(turnosHoy)
    }
  }, [])

  const guardarTurnos = (nuevosTurnos: Turno[]) => {
    setTurnos(nuevosTurnos)
    localStorage.setItem("turnos", JSON.stringify(nuevosTurnos))
  }

  const agregarTurno = (turno: Omit<Turno, "fecha">) => {
    const turnoConFecha: Turno = {
      ...turno,
      fecha: new Date().toDateString(),
    }
    const nuevosTurnos = [...turnos, turnoConFecha]
    guardarTurnos(nuevosTurnos)
  }

  const eliminarTurno = (index: number) => {
    const nuevosTurnos = turnos.filter((_, i) => i !== index)
    guardarTurnos(nuevosTurnos)
  }

  const actualizarTurno = (index: number, turnoActualizado: Turno) => {
    const nuevosTurnos = turnos.map((turno, i) => (i === index ? turnoActualizado : turno))
    guardarTurnos(nuevosTurnos)
  }

  return {
    turnos,
    agregarTurno,
    eliminarTurno,
    actualizarTurno,
  }
}
