"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Turno } from "@/types"

interface AgendarTurnosProps {
  turnos: Turno[]
  onAgregarTurno: (turno: Turno) => void
}

const HORAS_DISPONIBLES = [
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
]

export default function AgendarTurnos({ turnos, onAgregarTurno }: AgendarTurnosProps) {
  const [dialogAbierto, setDialogAbierto] = useState(false)
  const [horaSeleccionada, setHoraSeleccionada] = useState("")
  const [nombre, setNombre] = useState("")
  const [numero, setNumero] = useState("")

  const agendarTurno = (hora: string) => {
    setHoraSeleccionada(hora)
    setDialogAbierto(true)
  }

  const confirmarTurno = () => {
    if (!nombre || !numero) {
      alert("Por favor completa todos los campos")
      return
    }

    const nuevoTurno: Turno = {
      hora: horaSeleccionada,
      nombre,
      numero,
    }

    onAgregarTurno(nuevoTurno)

    // Enviar mensaje a WhatsApp
    const mensaje = `Nuevo turno ${horaSeleccionada} de ${nombre} (${numero})`
    window.open(`https://wa.me/573167530191?text=${encodeURIComponent(mensaje)}`, "_blank")

    // Limpiar formulario
    setNombre("")
    setNumero("")
    setDialogAbierto(false)

    alert("Turno agendado correctamente")
  }

  const estaOcupado = (hora: string) => {
    return turnos.some((turno) => turno.hora === hora)
  }

  const obtenerTurno = (hora: string) => {
    return turnos.find((turno) => turno.hora === hora)
  }

  return (
    <section className="bg-black/50 backdrop-blur-sm rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Agendar tu turno</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {HORAS_DISPONIBLES.map((hora) => {
          const ocupado = estaOcupado(hora)
          const turno = obtenerTurno(hora)

          return (
            <Button
              key={hora}
              variant={ocupado ? "secondary" : "default"}
              disabled={ocupado}
              onClick={() => agendarTurno(hora)}
              className="h-auto p-3 text-sm"
            >
              <div className="text-center">
                <div className="font-semibold">{hora}</div>
                <div className="text-xs">{ocupado ? `Ocupado por ${turno?.nombre}` : "Disponible"}</div>
              </div>
            </Button>
          )
        })}
      </div>

      <Dialog open={dialogAbierto} onOpenChange={setDialogAbierto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agendar turno para {horaSeleccionada}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="nombre">Nombre completo</Label>
              <Input
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ingresa tu nombre"
              />
            </div>
            <div>
              <Label htmlFor="numero">Número de WhatsApp</Label>
              <Input
                id="numero"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                placeholder="Ej: 573167530191"
              />
            </div>
            <Button onClick={confirmarTurno} className="w-full">
              Confirmar turno
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}
