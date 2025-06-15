"use client"

import { Share2, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTurnos } from "@/hooks/use-turnos"
import AgendarTurnos from "@/components/agendar-turnos"
import Precios from "@/components/precios"
import Encuesta from "@/components/encuesta"
import PanelAdmin from "@/components/panel-admin"

export default function Home() {
  const { turnos, agregarTurno, eliminarTurno } = useTurnos()

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

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed text-white"
      style={{ backgroundImage: "url(/barbershop-bg.jpg)" }}
    >
      <div className="min-h-screen bg-black/40 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <header className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Bienvenido a Caracas Alcon Barber – Calidad, Estilo y Flow 💈
            </h1>
          </header>

          {/* Panel Admin */}
          <PanelAdmin turnos={turnos} onEliminarTurno={eliminarTurno} />

          {/* Agendar Turnos */}
          <AgendarTurnos turnos={turnos} onAgregarTurno={agregarTurno} />

          {/* Precios */}
          <Precios />

          {/* Encuesta */}
          <Encuesta />

          {/* Footer */}
          <footer className="text-center space-y-4">
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
                <a href="https://wa.me/573167530191" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  WhatsApp
                </a>
              </Button>
            </div>
            <p className="text-white/70">Hecho para Caracas 💈 – ChatGPT – Kevin Flórez</p>
          </footer>
        </div>
      </div>
    </div>
  )
}
