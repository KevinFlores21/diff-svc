"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

const PRECIOS = [
  {
    servicio: "Corte con diseño",
    precio: "$20.000",
    descripcion: "Corte moderno con diseños personalizados",
    duracion: "40 min",
    popular: true,
  },
  {
    servicio: "Corte con barba",
    precio: "$28.000",
    descripcion: "Corte completo + arreglo de barba profesional",
    duracion: "60 min",
    popular: true,
  },
  {
    servicio: "Corte para niños",
    precio: "$18.000",
    descripcion: "Corte especial para niños con paciencia",
    duracion: "30 min",
  },
]

export default function Precios() {
  const abrirPagos = () => {
    // Scroll hacia la sección de pagos
    const seccionPagos = document.querySelector('[data-section="pagos"]')
    if (seccionPagos) {
      seccionPagos.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-6 mb-8 border border-cyan-400/30 shadow-lg shadow-cyan-400/20">
      <h2 className="text-2xl font-bold mb-6 text-center">💈 Nuestros Servicios</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {PRECIOS.map((item, index) => (
          <Card
            key={index}
            className={`bg-gray-800/60 border-cyan-400/30 shadow-md shadow-cyan-400/10 ${item.popular ? "ring-2 ring-yellow-400/50" : ""}`}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-lg text-center">{item.servicio}</CardTitle>
                {item.popular && (
                  <span className="bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold">Popular</span>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-2xl font-bold text-cyan-400 text-center">{item.precio}</p>
              <p className="text-white/70 text-sm text-center">{item.descripcion}</p>
              <p className="text-white/60 text-xs text-center">⏱️ {item.duracion}</p>
              <Button
                onClick={abrirPagos}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold"
                size="sm"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Pagar Online
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 text-center">
        <p className="text-white/70 text-sm">💳 Aceptamos Nequi, Bancolombia y efectivo</p>
      </div>
    </section>
  )
}
