"use client"

import { Share2, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTurnos } from "@/hooks/use-turnos"
import { useConfiguracion } from "@/hooks/use-configuracion"
import AgendarTurnos from "@/components/agendar-turnos"
import Precios from "@/components/precios"
import Encuesta from "@/components/encuesta"
import PanelAdminExpandido from "@/components/panel-admin-expandido"
import GaleriaCortes from "@/components/galeria-cortes"
import PagosNequi from "@/components/pagos-nequi"
import Image from "next/image"

export default function Home() {
  const { turnos, agregarTurno, eliminarTurno, actualizarTurno } = useTurnos()
  const { configuracion, actualizarNumeroNequi, actualizarServicio, agregarFotoCorte, eliminarFotoCorte } =
    useConfiguracion()

  const compartir = () => {
    if (navigator.share) {
      navigator.share({
        title: "Caracas Alcon Barber 💈",
        text: "Agenda tu corte con estilo 🔥",
        url: window.location.href,
      })
    } else {
      alert("Tu navegador no permite compartir desde aquí.")
    }
  }

  const manejarPago = (servicio: any, metodoPago: "efectivo" | "nequi") => {
    console.log(`Pago realizado: ${servicio.nombre} - ${metodoPago}`)
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed text-white"
      style={{ backgroundImage: "url(/barbershop-bg.jpg)" }}
    >
      <div className="min-h-screen bg-black/60 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <header className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Bienvenido a Caracas Alcon Barber – Calidad, Estilo y Flow 💈
            </h1>
            <p className="text-lg text-white/80">Los turnos se reinician automáticamente cada día</p>
          </header>

          {/* Panel Admin Expandido */}
          <PanelAdminExpandido
            turnos={turnos}
            configuracion={configuracion}
            onEliminarTurno={eliminarTurno}
            onActualizarNumeroNequi={actualizarNumeroNequi}
            onActualizarServicio={actualizarServicio}
            onAgregarFotoCorte={agregarFotoCorte}
            onEliminarFotoCorte={eliminarFotoCorte}
          />

          {/* Galería de Cortes */}
          <GaleriaCortes fotos={configuracion.fotosCortes} />

          {/* Agendar Turnos */}
          <AgendarTurnos turnos={turnos} onAgregarTurno={agregarTurno} />

          {/* Precios */}
          <Precios servicios={configuracion.servicios} />

          {/* Pagos por Nequi */}
          <PagosNequi
            servicios={configuracion.servicios}
            numeroNequi={configuracion.numeroNequi}
            onPagoRealizado={manejarPago}
          />

          {/* Encuesta */}
          <Encuesta />

          {/* Footer */}
          <footer className="text-center space-y-6">
            <div className="flex justify-center gap-4">
              <Button
                onClick={compartir}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Compartir
              </Button>
              <Button asChild className="bg-green-600 hover:bg-green-700">
                <a href={`https://wa.me/57${configuracion.numeroNequi}`} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  WhatsApp
                </a>
              </Button>
            </div>

            {/* Logo y Créditos */}
            <div className="flex flex-col items-center space-y-4">
              <div className="flex items-center justify-center gap-4">
                <Image
                  src="/alcon-barber-logo.jpg"
                  alt="Alcon Barber Logo"
                  width={80}
                  height={80}
                  className="rounded-full border-2 border-white/20"
                />
                <div className="text-center">
                  <p className="text-white font-bold text-lg">Caracas Alcon Barber 💈</p>
                  <p className="text-white/70 text-sm">Hecho por ChatGPT & Kevin Flórez</p>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}
