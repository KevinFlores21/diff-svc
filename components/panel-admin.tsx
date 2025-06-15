"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Settings, Trash2 } from "lucide-react"
import type { Turno } from "@/types"

interface PanelAdminProps {
  turnos: Turno[]
  onEliminarTurno: (index: number) => void
}

export default function PanelAdmin({ turnos, onEliminarTurno }: PanelAdminProps) {
  const [clave, setClave] = useState("")
  const [autenticado, setAutenticado] = useState(false)

  const verificarClave = () => {
    if (clave === "caracas123") {
      setAutenticado(true)
    } else {
      alert("Contraseña incorrecta")
    }
  }

  const eliminarTurno = (index: number) => {
    const turno = turnos[index]
    onEliminarTurno(index)

    // Enviar mensaje de cancelación
    const mensaje = "Tu turno fue cancelado. Lo sentimos."
    window.open(`https://wa.me/${turno.numero}?text=${encodeURIComponent(mensaje)}`, "_blank")

    alert("Turno eliminado")
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed top-4 right-4 bg-black/50 border-white/20 text-white hover:bg-white/20"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-black/90 text-white border-white/20">
        <SheetHeader>
          <SheetTitle className="text-white">Panel Privado (Caracas)</SheetTitle>
        </SheetHeader>

        {!autenticado ? (
          <div className="space-y-4 mt-6">
            <Input
              type="password"
              placeholder="Contraseña"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
            <Button onClick={verificarClave} className="w-full">
              Ver Turnos
            </Button>
          </div>
        ) : (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Turnos Agendados</h3>
            {turnos.length === 0 ? (
              <p className="text-white/70">No hay turnos agendados</p>
            ) : (
              <div className="space-y-2">
                {turnos.map((turno, index) => (
                  <div key={index} className="flex items-center justify-between bg-white/10 p-3 rounded">
                    <div>
                      <div className="font-semibold">{turno.hora}</div>
                      <div className="text-sm text-white/70">{turno.nombre}</div>
                      <div className="text-xs text-white/50">{turno.numero}</div>
                    </div>
                    <Button variant="destructive" size="sm" onClick={() => eliminarTurno(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
