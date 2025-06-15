"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export default function Encuesta() {
  const [opinion, setOpinion] = useState("")

  const enviarEncuesta = () => {
    if (!opinion) {
      alert("Por favor selecciona una opción")
      return
    }

    alert("Gracias por tu opinión: " + opinion)

    // Enviar a WhatsApp
    const mensaje = "📝 Opinión del cliente: " + opinion
    window.open(`https://wa.me/573167530191?text=${encodeURIComponent(mensaje)}`, "_blank")

    setOpinion("")
  }

  return (
    <section className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-6 mb-8 border border-cyan-400/30 shadow-lg shadow-cyan-400/20">
      <h2 className="text-2xl font-bold mb-6 text-center">📝 Encuesta de Satisfacción</h2>
      <div className="max-w-md mx-auto space-y-4">
        <div>
          <Label className="text-white text-lg">¿Te gustó el servicio?</Label>
          <Select value={opinion} onValueChange={setOpinion}>
            <SelectTrigger className="bg-gray-800 border-cyan-400/30 text-white">
              <SelectValue placeholder="Selecciona una opción" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-cyan-400/30">
              <SelectItem value="Excelente" className="text-white">
                Excelente
              </SelectItem>
              <SelectItem value="Bueno" className="text-white">
                Bueno
              </SelectItem>
              <SelectItem value="Regular" className="text-white">
                Regular
              </SelectItem>
              <SelectItem value="Malo" className="text-white">
                Malo
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={enviarEncuesta} className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold">
          Enviar
        </Button>
      </div>
    </section>
  )
}
