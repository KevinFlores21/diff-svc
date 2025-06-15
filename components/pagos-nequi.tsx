"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, Smartphone } from "lucide-react"
import type { Servicio } from "@/types"

interface PagosNequiProps {
  servicios: Servicio[]
  numeroNequi: string
  onPagoRealizado: (servicio: Servicio, metodoPago: "efectivo" | "nequi") => void
}

export default function PagosNequi({ servicios, numeroNequi, onPagoRealizado }: PagosNequiProps) {
  const [dialogAbierto, setDialogAbierto] = useState(false)
  const [servicioSeleccionado, setServicioSeleccionado] = useState<Servicio | null>(null)
  const [metodoPago, setMetodoPago] = useState<"efectivo" | "nequi">("efectivo")

  const seleccionarServicio = (servicio: Servicio) => {
    setServicioSeleccionado(servicio)
    setDialogAbierto(true)
  }

  const confirmarPago = () => {
    if (!servicioSeleccionado) return

    if (metodoPago === "nequi") {
      // Abrir Nequi con el número y monto
      const mensaje = `Pago por ${servicioSeleccionado.nombre} - $${servicioSeleccionado.precio.toLocaleString()}`
      window.open(`https://wa.me/57${numeroNequi}?text=${encodeURIComponent(mensaje)}`, "_blank")
    }

    onPagoRealizado(servicioSeleccionado, metodoPago)
    setDialogAbierto(false)
    alert(`Pago registrado: ${servicioSeleccionado.nombre} - ${metodoPago}`)
  }

  return (
    <section className="bg-black/50 backdrop-blur-sm rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Realizar Pago 💳</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {servicios.map((servicio) => (
          <Card
            key={servicio.id}
            className="bg-white/10 border-white/20 cursor-pointer hover:bg-white/20 transition-colors"
            onClick={() => seleccionarServicio(servicio)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-lg">{servicio.nombre}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-400">${servicio.precio.toLocaleString()}</p>
              <Button className="w-full mt-2" variant="outline">
                Pagar
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogAbierto} onOpenChange={setDialogAbierto}>
        <DialogContent className="bg-black/90 text-white border-white/20">
          <DialogHeader>
            <DialogTitle>Pagar: {servicioSeleccionado?.nombre}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">${servicioSeleccionado?.precio.toLocaleString()}</p>
            </div>

            <div className="space-y-2">
              <Label>Método de pago:</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={metodoPago === "efectivo" ? "default" : "outline"}
                  onClick={() => setMetodoPago("efectivo")}
                  className="flex items-center gap-2"
                >
                  <CreditCard className="h-4 w-4" />
                  Efectivo
                </Button>
                <Button
                  variant={metodoPago === "nequi" ? "default" : "outline"}
                  onClick={() => setMetodoPago("nequi")}
                  className="flex items-center gap-2"
                >
                  <Smartphone className="h-4 w-4" />
                  Nequi
                </Button>
              </div>
            </div>

            {metodoPago === "nequi" && (
              <div className="bg-purple-600/20 p-4 rounded-lg">
                <p className="text-sm text-center">Se abrirá WhatsApp para contactar con el número Nequi:</p>
                <p className="text-center font-bold">{numeroNequi}</p>
              </div>
            )}

            <Button onClick={confirmarPago} className="w-full">
              Confirmar Pago
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}
