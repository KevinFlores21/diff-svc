"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export default function Encuesta() {
  const [satisfaccion, setSatisfaccion] = useState("")

  const enviarEncuesta = (e: React.FormEvent) => {
    e.preventDefault()
    if (!satisfaccion) {
      alert("Por favor selecciona una opción")
      return
    }
    alert("¡Gracias por tu opinión!")
    setSatisfaccion("")
  }

  return (
    <section className="bg-black/50 backdrop-blur-sm rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-bold mb-6 text-center">¿Cómo fue tu experiencia?</h2>
      <form onSubmit={enviarEncuesta} className="max-w-md mx-auto">
        <RadioGroup value={satisfaccion} onValueChange={setSatisfaccion}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="excelente" id="excelente" />
            <Label htmlFor="excelente" className="text-white">
              Excelente
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="buena" id="buena" />
            <Label htmlFor="buena" className="text-white">
              Buena
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="mala" id="mala" />
            <Label htmlFor="mala" className="text-white">
              Mala
            </Label>
          </div>
        </RadioGroup>
        <Button type="submit" className="w-full mt-4">
          Enviar
        </Button>
      </form>
    </section>
  )
}
