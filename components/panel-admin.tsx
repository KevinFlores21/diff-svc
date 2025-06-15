"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Settings, Trash2, User, Phone, Clock } from "lucide-react"
import PanelGaleria from "./panel-galeria"
import PanelConfiguracion from "./panel-configuracion"
import type { FotoCorte, ConfiguracionApp, ServicioPago } from "@/types"

interface PanelAdminProps {
  turnos: Record<string, string>
  onEliminarTurno: (hora: string) => void
  fotos: FotoCorte[]
  onAgregarFoto: (foto: Omit<FotoCorte, "id" | "fecha">) => void
  onReemplazarFoto: (fotoId: string, foto: Omit<FotoCorte, "id" | "fecha">) => void
  onEliminarFoto: (id: string) => void
  onConvertirArchivo: (archivo: File) => Promise<string>
  onCrearRespaldo: () => any
  onRestaurarRespaldo: (archivo: File) => Promise<void>
  onExportarHTML: () => void
  configuracion: ConfiguracionApp
  onActualizarNumeroNequi: (numero: string) => void
  onActualizarCuentaBancolombia: (cuenta: string) => void
  onActualizarServicio: (servicioId: string, datos: Partial<ServicioPago>) => void
  onCrearRespaldoConfiguracion: () => any
  onRestaurarConfiguracion: (archivo: File) => Promise<void>
}

export default function PanelAdmin({
  turnos,
  onEliminarTurno,
  fotos,
  onAgregarFoto,
  onReemplazarFoto,
  onEliminarFoto,
  onConvertirArchivo,
  onCrearRespaldo,
  onRestaurarRespaldo,
  onExportarHTML,
  configuracion,
  onActualizarNumeroNequi,
  onActualizarCuentaBancolombia,
  onActualizarServicio,
  onCrearRespaldoConfiguracion,
  onRestaurarConfiguracion,
}: PanelAdminProps) {
  const [clave, setClave] = useState("")
  const [autenticado, setAutenticado] = useState(false)
  const [dialogCancelacion, setDialogCancelacion] = useState(false)
  const [turnoSeleccionado, setTurnoSeleccionado] = useState<{ hora: string; info: string } | null>(null)
  const [motivoCancelacion, setMotivoCancelacion] = useState("")

  const verificarClave = () => {
    if (clave === "caracas123") {
      setAutenticado(true)
    } else {
      alert("Contraseña incorrecta.")
    }
  }

  const abrirDialogCancelacion = (hora: string, info: string) => {
    setTurnoSeleccionado({ hora, info })
    setDialogCancelacion(true)
  }

  const confirmarCancelacion = () => {
    if (!turnoSeleccionado || !motivoCancelacion.trim()) {
      alert("Por favor ingresa el motivo de la cancelación")
      return
    }

    const { hora, info } = turnoSeleccionado

    // Extraer número de teléfono del formato "Nombre (Número)"
    const match = info.match(/$$(\d+)$$/)
    const numeroCliente = match ? match[1] : ""

    // Eliminar el turno
    onEliminarTurno(hora)

    // Enviar mensaje al dueño
    const mensajeDueno = `⚠️ TURNO CANCELADO\nHora: ${hora}\nCliente: ${info}\nMotivo: ${motivoCancelacion}`
    window.open(`https://wa.me/${configuracion.numeroNequi}?text=${encodeURIComponent(mensajeDueno)}`, "_blank")

    // Enviar mensaje al cliente si tiene número
    if (numeroCliente) {
      const mensajeCliente = `🚫 Tu turno de las ${hora} (${info}) fue eliminado.\n\nMotivo: ${motivoCancelacion}\n\nDisculpa las molestias. Puedes reagendar cuando gustes.\n\n💈 Caracas Alcon Barber`
      window.open(`https://wa.me/${numeroCliente}?text=${encodeURIComponent(mensajeCliente)}`, "_blank")
    }

    // Limpiar y cerrar
    setMotivoCancelacion("")
    setDialogCancelacion(false)
    setTurnoSeleccionado(null)

    alert("Turno cancelado y notificaciones enviadas")
  }

  const parsearInfoCliente = (info: string) => {
    const match = info.match(/^(.+?)\s*$$(\d+)$$$/)
    if (match) {
      return {
        nombre: match[1].trim(),
        numero: match[2],
      }
    }
    return {
      nombre: info,
      numero: "No disponible",
    }
  }

  const turnosArray = Object.entries(turnos).map(([hora, info]) => ({
    hora,
    info,
    cliente: parsearInfoCliente(info),
  }))

  return (
    <>
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
        <SheetContent className="bg-gray-900/95 text-white border-cyan-400/30 w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-white">Panel de Administración</SheetTitle>
          </SheetHeader>

          {!autenticado ? (
            <div className="space-y-4 mt-6">
              <Input
                type="password"
                placeholder="Contraseña del panel:"
                value={clave}
                onChange={(e) => setClave(e.target.value)}
                className="bg-gray-800 border-cyan-400/30 text-white placeholder:text-gray-400"
                onKeyPress={(e) => e.key === "Enter" && verificarClave()}
              />
              <Button onClick={verificarClave} className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold">
                Acceder
              </Button>
            </div>
          ) : (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Turnos Agendados</h3>
                <span className="bg-cyan-500 text-black px-2 py-1 rounded text-sm font-bold">{turnosArray.length}</span>
              </div>

              {turnosArray.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-white/70">No hay turnos agendados</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {turnosArray.map(({ hora, info, cliente }, index) => (
                    <div key={index} className="bg-gray-800/60 p-4 rounded-lg border border-cyan-400/20">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className="h-4 w-4 text-cyan-400" />
                            <span className="font-bold text-cyan-400">{hora}</span>
                          </div>

                          <div className="flex items-center gap-2 mb-1">
                            <User className="h-4 w-4 text-white/70" />
                            <span className="text-white">{cliente.nombre}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-white/70" />
                            <span className="text-white/70 text-sm">{cliente.numero}</span>
                          </div>
                        </div>

                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => abrirDialogCancelacion(hora, info)}
                          className="ml-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Button
                onClick={() => {
                  setAutenticado(false)
                  setClave("")
                }}
                variant="outline"
                className="w-full mt-4 border-cyan-400/30 text-white hover:bg-cyan-400/10"
              >
                Cerrar Sesión
              </Button>

              <PanelConfiguracion
                configuracion={configuracion}
                onActualizarNumeroNequi={onActualizarNumeroNequi}
                onActualizarCuentaBancolombia={onActualizarCuentaBancolombia}
                onActualizarServicio={onActualizarServicio}
                onCrearRespaldo={onCrearRespaldoConfiguracion}
                onRestaurarConfiguracion={onRestaurarConfiguracion}
                autenticado={autenticado}
              />

              <PanelGaleria
                fotos={fotos}
                onAgregarFoto={onAgregarFoto}
                onReemplazarFoto={onReemplazarFoto}
                onEliminarFoto={onEliminarFoto}
                onConvertirArchivo={onConvertirArchivo}
                onCrearRespaldo={onCrearRespaldo}
                onRestaurarRespaldo={onRestaurarRespaldo}
                onExportarHTML={onExportarHTML}
                autenticado={autenticado}
              />
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Dialog de cancelación */}
      <Dialog open={dialogCancelacion} onOpenChange={setDialogCancelacion}>
        <DialogContent className="bg-gray-900 border-cyan-400/30">
          <DialogHeader>
            <DialogTitle className="text-white">Cancelar Turno</DialogTitle>
          </DialogHeader>

          {turnoSeleccionado && (
            <div className="space-y-4">
              <div className="bg-gray-800/60 p-3 rounded border border-cyan-400/20">
                <p className="text-white">
                  <strong>Hora:</strong> {turnoSeleccionado.hora}
                </p>
                <p className="text-white">
                  <strong>Cliente:</strong> {parsearInfoCliente(turnoSeleccionado.info).nombre}
                </p>
                <p className="text-white/70">
                  <strong>Teléfono:</strong> {parsearInfoCliente(turnoSeleccionado.info).numero}
                </p>
              </div>

              <div>
                <label className="text-white text-sm font-medium mb-2 block">Motivo de la cancelación:</label>
                <Textarea
                  value={motivoCancelacion}
                  onChange={(e) => setMotivoCancelacion(e.target.value)}
                  placeholder="Ej: Emergencia familiar, problema de salud, etc."
                  className="bg-gray-800 border-cyan-400/30 text-white placeholder:text-gray-400"
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => setDialogCancelacion(false)}
                  variant="outline"
                  className="flex-1 border-cyan-400/30 text-white hover:bg-cyan-400/10"
                >
                  Cancelar
                </Button>
                <Button onClick={confirmarCancelacion} variant="destructive" className="flex-1">
                  Confirmar Cancelación
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
