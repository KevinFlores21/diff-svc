"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { DiasSemana } from "@/types"

interface AgendarTurnosProps {
  turnos: Record<string, string>
  diaActual: DiasSemana
  horariosDisponibles: string[]
  onAgregarTurno: (hora: string, nombre: string, numero: string) => void
  onEliminarTurno: (hora: string) => void
}

export default function AgendarTurnos({
  turnos,
  diaActual,
  horariosDisponibles,
  onAgregarTurno,
  onEliminarTurno,
}: AgendarTurnosProps) {
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

    onAgregarTurno(horaSeleccionada, nombre, numero)

    // Enviar mensaje a WhatsApp
    const mensaje = `🔔 NUEVO TURNO\nHora: ${horaSeleccionada}\nNombre: ${nombre}\nWhatsApp: ${numero}`
    window.open(`https://wa.me/573167530191?text=${encodeURIComponent(mensaje)}`, "_blank")

    // Limpiar formulario
    setNombre("")
    setNumero("")
    setDialogAbierto(false)

    alert("Turno agendado.")
  }

  const eliminarTurno = (hora: string) => {
    if (!confirm("¿Seguro que quieres eliminar este turno?")) return

    const nombreCompleto = turnos[hora]
    onEliminarTurno(hora)

    // Enviar mensaje de cancelación
    const mensaje = `⚠️ El turno de las ${hora} (${nombreCompleto}) fue eliminado. No se podrá atender.`
    window.open(`https://wa.me/573167530191?text=${encodeURIComponent(mensaje)}`, "_blank")
  }

  if (diaActual === "miércoles") {
    return (
      <section className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-6 mb-8 border border-cyan-400/30 shadow-lg shadow-cyan-400/20">
        <h2 className="text-2xl font-bold mb-6 text-center">Turnos</h2>
        <p className="text-center text-cyan-400 text-lg">Hoy no se atiende.</p>
      </section>
    )
  }

  return (
    <section className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-6 mb-8 border border-cyan-400/30 shadow-lg shadow-cyan-400/20">
      <h2 className="text-2xl font-bold mb-6 text-center">Turnos Disponibles</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {horariosDisponibles.map((hora) => {
          const ocupado = turnos[hora]

          return (
            <div
              key={hora}
              className="bg-gray-800/60 p-4 rounded-lg border border-cyan-400/30 shadow-md shadow-cyan-400/10"
            >
              <div className="text-center">
                <div className="font-bold text-lg text-cyan-400">{hora}</div>
                <div className="text-sm mb-3">{ocupado ? `Ocupado por ${ocupado}` : "Disponible"}</div>
                {ocupado ? (
                  <Button variant="destructive" size="sm" onClick={() => eliminarTurno(hora)} className="w-full">
                    ❌ Eliminar
                  </Button>
                ) : (
                  <Button
                    onClick={() => agendarTurno(hora)}
                    className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold"
                  >
                    ✅ Agendar
                  </Button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <Dialog open={dialogAbierto} onOpenChange={setDialogAbierto}>
        <DialogContent className="bg-gray-900 border-cyan-400/30">
          <DialogHeader>
            <DialogTitle className="text-white">Agendar turno para {horaSeleccionada}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="nombre" className="text-white">
                Tu nombre:
              </Label>
              <Input
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ingresa tu nombre"
                className="bg-gray-800 border-cyan-400/30 text-white"
              />
            </div>
            <div>
              <Label htmlFor="numero" className="text-white">
                Tu número de WhatsApp:
              </Label>
              <Input
                id="numero"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                placeholder="Ej: 573167530191"
                className="bg-gray-800 border-cyan-400/30 text-white"
              />
            </div>
            <Button onClick={confirmarTurno} className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold">
              Confirmar turno
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}
