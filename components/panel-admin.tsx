"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Settings } from "lucide-react"

interface PanelAdminProps {
  turnos: Record<string, string>
  onEliminarTurno: (hora: string) => void
}

export default function PanelAdmin({ turnos, onEliminarTurno }: PanelAdminProps) {
  const [clave, setClave] = useState("")
  const [autenticado, setAutenticado] = useState(false)

  const verificarClave = () => {
    if (clave === "caracas123") {
      setAutenticado(true)
      revisarTurnos()
    } else {
      alert("Contraseña incorrecta.")
    }
  }

  const revisarTurnos = () => {
    if (Object.keys(turnos).length === 0) {
      alert("No hay turnos agendados.")
      return
    }

    for (const [hora, nombre] of Object.entries(turnos)) {
      const confirmar = confirm(`🕒 ${hora} – ${nombre}\n¿Eliminar este turno?`)
      if (confirmar) {
        onEliminarTurno(hora)

        // Enviar mensaje de cancelación
        const mensaje = `⚠️ El dueño eliminó el turno de las ${hora} (${nombre}).`
        window.open(`https://wa.me/573167530191?text=${encodeURIComponent(mensaje)}`, "_blank")
      }
    }

    alert("Revisado y actualizado.")
    setAutenticado(false)
    setClave("")
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed top-4 right-4 bg-cyan-500 border-cyan-400 text-black hover:bg-cyan-600 rounded-full p-3"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-gray-900/95 text-white border-cyan-400/30">
        <SheetHeader>
          <SheetTitle className="text-white">Panel de Administración</SheetTitle>
        </SheetHeader>

        <div className="space-y-4 mt-6">
          <Input
            type="password"
            placeholder="Contraseña del panel:"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            className="bg-gray-800 border-cyan-400/30 text-white placeholder:text-gray-400"
          />
          <Button onClick={verificarClave} className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold">
            Acceder
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
