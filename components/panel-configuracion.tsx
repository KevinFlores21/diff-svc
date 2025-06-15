"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Settings2, Save, Upload, Download, Edit, DollarSign, Smartphone, CreditCard } from "lucide-react"
import type { ConfiguracionApp, ServicioPago } from "@/types"

interface PanelConfiguracionProps {
  configuracion: ConfiguracionApp
  onActualizarNumeroNequi: (numero: string) => void
  onActualizarCuentaBancolombia: (cuenta: string) => void
  onActualizarServicio: (servicioId: string, datos: Partial<ServicioPago>) => void
  onCrearRespaldo: () => any
  onRestaurarConfiguracion: (archivo: File) => Promise<void>
  autenticado: boolean
}

export default function PanelConfiguracion({
  configuracion,
  onActualizarNumeroNequi,
  onActualizarCuentaBancolombia,
  onActualizarServicio,
  onCrearRespaldo,
  onRestaurarConfiguracion,
  autenticado,
}: PanelConfiguracionProps) {
  const [dialogConfigAbierto, setDialogConfigAbierto] = useState(false)
  const [dialogServicioAbierto, setDialogServicioAbierto] = useState(false)
  const [servicioEditando, setServicioEditando] = useState<ServicioPago | null>(null)
  const [numeroNequiTemp, setNumeroNequiTemp] = useState(configuracion.numeroNequi)
  const [cuentaBancolombiaTemp, setCuentaBancolombiaTemp] = useState(configuracion.cuentaBancolombia)
  const [cargandoRespaldo, setCargandoRespaldo] = useState(false)
  const inputRespaldoRef = useRef<HTMLInputElement>(null)

  const abrirEdicionServicio = (servicio: ServicioPago) => {
    setServicioEditando({ ...servicio })
    setDialogServicioAbierto(true)
  }

  const guardarConfiguracionPagos = () => {
    onActualizarNumeroNequi(numeroNequiTemp)
    onActualizarCuentaBancolombia(cuentaBancolombiaTemp)
    alert("Configuración de pagos actualizada")
    setDialogConfigAbierto(false)
  }

  const guardarServicio = () => {
    if (!servicioEditando) return

    onActualizarServicio(servicioEditando.id, {
      nombre: servicioEditando.nombre,
      precio: servicioEditando.precio,
      descripcion: servicioEditando.descripcion,
      duracion: servicioEditando.duracion,
      popular: servicioEditando.popular,
    })

    alert("Servicio actualizado")
    setDialogServicioAbierto(false)
    setServicioEditando(null)
  }

  const crearRespaldoConfiguracion = () => {
    try {
      onCrearRespaldo()
      alert("¡Respaldo de configuración creado exitosamente!")
    } catch (error) {
      alert("Error al crear el respaldo.")
      console.error("Error:", error)
    }
  }

  const manejarRestaurarConfiguracion = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = event.target.files?.[0]
    if (!archivo) return

    if (!archivo.name.endsWith(".json")) {
      alert("Por favor selecciona un archivo de configuración válido (.json)")
      return
    }

    setCargandoRespaldo(true)
    try {
      await onRestaurarConfiguracion(archivo)
      alert("¡Configuración restaurada exitosamente!")
      // Recargar la página para aplicar cambios
      window.location.reload()
    } catch (error) {
      alert("Error al restaurar la configuración. Verifica que el archivo sea válido.")
      console.error("Error:", error)
    } finally {
      setCargandoRespaldo(false)
      if (inputRespaldoRef.current) {
        inputRespaldoRef.current.value = ""
      }
    }
  }

  const formatearPrecio = (precio: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(precio)
  }

  if (!autenticado) return null

  return (
    <div className="mt-6 border-t border-cyan-400/30 pt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">⚙️ Configuración</h3>
        <Button
          onClick={() => setDialogConfigAbierto(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold"
          size="sm"
        >
          <Settings2 className="h-4 w-4 mr-1" />
          Configurar
        </Button>
      </div>

      {/* Resumen de configuración actual */}
      <div className="space-y-3">
        <div className="bg-gray-800/40 p-3 rounded border border-cyan-400/20">
          <div className="flex items-center gap-2 mb-2">
            <Smartphone className="h-4 w-4 text-purple-400" />
            <span className="text-white font-medium">Nequi:</span>
          </div>
          <p className="text-cyan-400 font-mono">{configuracion.numeroNequi}</p>
        </div>

        <div className="bg-gray-800/40 p-3 rounded border border-cyan-400/20">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="h-4 w-4 text-yellow-400" />
            <span className="text-white font-medium">Bancolombia:</span>
          </div>
          <p className="text-cyan-400 font-mono">{configuracion.cuentaBancolombia}</p>
        </div>

        <div className="bg-gray-800/40 p-3 rounded border border-cyan-400/20">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="h-4 w-4 text-green-400" />
            <span className="text-white font-medium">Servicios:</span>
          </div>
          <div className="space-y-2">
            {configuracion.servicios.map((servicio) => (
              <div key={servicio.id} className="flex items-center justify-between">
                <div>
                  <span className="text-white text-sm">{servicio.nombre}</span>
                  <span className="text-cyan-400 ml-2">{formatearPrecio(servicio.precio)}</span>
                  {servicio.popular && <span className="text-yellow-400 ml-1">⭐</span>}
                </div>
                <Button
                  onClick={() => abrirEdicionServicio(servicio)}
                  size="sm"
                  variant="outline"
                  className="border-cyan-400/30 text-white hover:bg-cyan-400/10"
                >
                  <Edit className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Input oculto para respaldo */}
      <input
        ref={inputRespaldoRef}
        type="file"
        accept=".json"
        onChange={manejarRestaurarConfiguracion}
        className="hidden"
      />

      {/* Dialog de configuración principal */}
      <Dialog open={dialogConfigAbierto} onOpenChange={setDialogConfigAbierto}>
        <DialogContent className="bg-gray-900 border-cyan-400/30 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">⚙️ Configuración de Pagos</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-white text-sm font-medium mb-2 block">Número de Nequi:</label>
              <Input
                value={numeroNequiTemp}
                onChange={(e) => setNumeroNequiTemp(e.target.value)}
                placeholder="Ej: 3167530191"
                className="bg-gray-800 border-cyan-400/30 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-white text-sm font-medium mb-2 block">Cuenta Bancolombia:</label>
              <Input
                value={cuentaBancolombiaTemp}
                onChange={(e) => setCuentaBancolombiaTemp(e.target.value)}
                placeholder="Ej: 12345678901"
                className="bg-gray-800 border-cyan-400/30 text-white font-mono"
              />
            </div>

            <div className="border-t border-cyan-400/30 pt-4">
              <p className="text-white/70 text-sm mb-3">Respaldos de configuración:</p>
              <div className="flex gap-2">
                <Button
                  onClick={crearRespaldoConfiguracion}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold"
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Crear Respaldo
                </Button>
                <Button
                  onClick={() => inputRespaldoRef.current?.click()}
                  disabled={cargandoRespaldo}
                  variant="outline"
                  className="flex-1 border-cyan-400/30 text-white hover:bg-cyan-400/10"
                  size="sm"
                >
                  {cargandoRespaldo ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
                      Cargando...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-1" />
                      Restaurar
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => setDialogConfigAbierto(false)}
                variant="outline"
                className="flex-1 border-cyan-400/30 text-white hover:bg-cyan-400/10"
              >
                Cancelar
              </Button>
              <Button
                onClick={guardarConfiguracionPagos}
                className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-black font-bold"
              >
                <Save className="h-4 w-4 mr-1" />
                Guardar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de edición de servicio */}
      <Dialog open={dialogServicioAbierto} onOpenChange={setDialogServicioAbierto}>
        <DialogContent className="bg-gray-900 border-cyan-400/30 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">✂️ Editar Servicio</DialogTitle>
          </DialogHeader>

          {servicioEditando && (
            <div className="space-y-4">
              <div>
                <label className="text-white text-sm font-medium mb-2 block">Nombre del servicio:</label>
                <Input
                  value={servicioEditando.nombre}
                  onChange={(e) => setServicioEditando({ ...servicioEditando, nombre: e.target.value })}
                  className="bg-gray-800 border-cyan-400/30 text-white"
                />
              </div>

              <div>
                <label className="text-white text-sm font-medium mb-2 block">Precio (COP):</label>
                <Input
                  type="number"
                  value={servicioEditando.precio}
                  onChange={(e) =>
                    setServicioEditando({ ...servicioEditando, precio: Number.parseInt(e.target.value) || 0 })
                  }
                  className="bg-gray-800 border-cyan-400/30 text-white"
                />
              </div>

              <div>
                <label className="text-white text-sm font-medium mb-2 block">Descripción:</label>
                <Textarea
                  value={servicioEditando.descripcion}
                  onChange={(e) => setServicioEditando({ ...servicioEditando, descripcion: e.target.value })}
                  className="bg-gray-800 border-cyan-400/30 text-white"
                  rows={3}
                />
              </div>

              <div>
                <label className="text-white text-sm font-medium mb-2 block">Duración:</label>
                <Input
                  value={servicioEditando.duracion}
                  onChange={(e) => setServicioEditando({ ...servicioEditando, duracion: e.target.value })}
                  placeholder="Ej: 40 min"
                  className="bg-gray-800 border-cyan-400/30 text-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="popular"
                  checked={servicioEditando.popular || false}
                  onChange={(e) => setServicioEditando({ ...servicioEditando, popular: e.target.checked })}
                  className="rounded border-cyan-400/30"
                />
                <label htmlFor="popular" className="text-white text-sm">
                  Marcar como popular ⭐
                </label>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => setDialogServicioAbierto(false)}
                  variant="outline"
                  className="flex-1 border-cyan-400/30 text-white hover:bg-cyan-400/10"
                >
                  Cancelar
                </Button>
                <Button onClick={guardarServicio} className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-black font-bold">
                  <Save className="h-4 w-4 mr-1" />
                  Guardar Servicio
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
