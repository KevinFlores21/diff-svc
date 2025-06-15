"use client"

import { Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTurnos } from "@/hooks/use-turnos"
import AgendarTurnos from "@/components/agendar-turnos"
import Precios from "@/components/precios"
import Encuesta from "@/components/encuesta"
import PanelAdmin from "@/components/panel-admin"
import Image from "next/image"

export default function Home() {
  const { turnos, diaActual, agregarTurno, eliminarTurno, obtenerHorariosDisponibles } = useTurnos()

  const compartir = () => {
    const mensaje = `💈 Caracas Alcon Barber – Agenda tu corte con estilo aquí:\n${window.location.href}`

    if (navigator.share) {
      navigator.share({
        title: "Caracas Alcon Barber 💈",
        text: mensaje,
        url: window.location.href,
      })
    } else {
      navigator.clipboard
        .writeText(mensaje)
        .then(() => alert("Enlace copiado. Puedes compartirlo en WhatsApp o redes."))
        .catch(() => alert("Tu navegador no permite copiar automáticamente."))
    }
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed text-white"
      style={{
        backgroundImage: "linear-gradient(rgba(0,0,0,0.8), rgba(15,15,15,0.8)), url(/barbershop-bg.jpg)",
      }}
    >
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <header className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-6 text-shadow-lg">
              Bienvenido a Caracas Alcon Barber – Calidad, Estilo y Flow
            </h1>

            <Button asChild className="bg-green-600 hover:bg-green-700 text-white font-bold">
              <a
                href="https://wa.me/573167530191?text=Hola%2C%20quiero%20agendar%20un%20turno"
                target="_blank"
                rel="noopener noreferrer"
              >
                Agenda por WhatsApp
              </a>
            </Button>
          </header>

          {/* Panel Admin */}
          <PanelAdmin turnos={turnos} onEliminarTurno={eliminarTurno} />

          {/* Agendar Turnos */}
          <AgendarTurnos
            turnos={turnos}
            diaActual={diaActual}
            horariosDisponibles={obtenerHorariosDisponibles()}
            onAgregarTurno={agregarTurno}
            onEliminarTurno={eliminarTurno}
          />

          {/* Precios */}
          <Precios />

          {/* Encuesta */}
          <Encuesta />

          {/* Botones de acción */}
          <div className="text-center mb-8">
            <Button onClick={compartir} className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
              <Share2 className="mr-2 h-4 w-4" />📤 Compartir
            </Button>
          </div>

          {/* Créditos */}
          <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-6 mb-8 border border-cyan-400/30 shadow-lg shadow-cyan-400/20 text-center">
            <p className="text-white/70">Hecho para Caracas | ChatGPT & Kevin Flórez</p>
          </div>

          {/* Foto del dueño */}
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4">El dueño – Caracas 💈</h3>
            <div className="inline-block">
              <Image
                src="/owner-photo.jpg"
                alt="Dueño de los cortes"
                width={200}
                height={200}
                className="rounded-2xl border-2 border-cyan-400 shadow-lg shadow-cyan-400/30"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
