"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Settings2, Edit, Trash2, Plus, Save, DollarSign } from "lucide-react"
import type { ConfiguracionApp, ServicioPago } from "@/types"

interface PanelConfiguracionProps {
  configuracion: ConfiguracionApp
  onActualizarNumeroNequi: (numero: string) => void
  onActualizarCuentaBancolombia: (cuenta: string) => void
  onActualizarServicio: (servicioId: string, datos: Partial<ServicioPago>) => void
  onAgregarServicio: (servicio: Omit<ServicioPago, "id">) => void
  onEliminarServicio: (servicioId: string) => void
  autenticado: boolean
}

export default function PanelConfiguracion({
  configuracion,
  onActualizarNumeroNequi,
  onActualizarCuentaBancolombia,
  onActualizarServicio,
  onAgregarServicio,
  onEliminarServicio,
  autenticado,
}: PanelConfiguracionProps) {
  const [dialogConfigAbierto, setDialogConfigAbierto] = useState(false)
  const [dialogServicioAbierto, setDialogServicioAbierto] = useState(false)
  const [servicioEditando, setServicioEditando] = useState<ServicioPago | null>(null)

  // Estados para configuración
  const [numeroNequi, setNumeroNequi] = useState(configuracion.numeroNequi)
  const [cuentaBancolombia, setCuentaBancolombia] = useState(configuracion.cuentaBancolombia)

  // Estados para servicios
  const [nombreServicio, setNombreServicio] = useState("")
  const [precioServicio, setPrecioServicio] = useState("")
  const [descripcionServicio, setDescripcionServicio] = useState("")
  const [duracionServicio, setDuracionServicio] = useState("")
  const [popularServicio, setPopularServicio] = useState(false)

  const formatearPrecio = (precio: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(precio)
  }

  const guardarConfiguracion = () => {
    onActualizarNumeroNequi(numeroNequi)
    onActualizarCuentaBancolombia(cuentaBancolombia)
    setDialogConfigAbierto(false)
    alert("Configuración guardada exitosamente")
  }

  const abrirEditarServicio = (servicio?: ServicioPago) => {
    if (servicio) {
      setServicioEditando(servicio)
      setNombreServicio(servicio.nombre)
      setPrecioServicio(servicio.precio.toString())
      setDescripcionServicio(servicio.descripcion)
      setDuracionServicio(servicio.duracion)
      setPopularServicio(servicio.popular || false)
    } else {
      setServicioEditando(null)
      setNombreServicio("")
      setPrecioServicio("")
      setDescripcionServicio("")
      setDuracionServicio("")
      setPopularServicio(false)
    }
    setDialogServicioAbierto(true)
  }

  const guardarServicio = () => {
    if (!nombreServicio || !precioServicio || !descripcionServicio || !duracionServicio) {
      alert("Por favor completa todos los campos")
      return
    }

    const precio = Number.parseInt(precioServicio)
    if (isNaN(precio) || precio <= 0) {
      alert("El precio debe ser un número válido mayor a 0")
      return
    }

    const datosServicio = {
      nombre: nombreServicio,
      precio: precio,
      descripcion: descripcionServicio,
      duracion: duracionServicio,
      popular: popularServicio,
    }

    if (servicioEditando) {
      onActualizarServicio(servicioEditando.id, datosServicio)
      alert("Servicio actualizado exitosamente")
    } else {
      onAgregarServicio(datosServicio)
      alert("Servicio agregado exitosamente")
    }

    setDialogServicioAbierto(false)
  }

  const eliminarServicio = (servicio: ServicioPago) => {
    if (confirm(`¿Estás seguro de eliminar "${servicio.nombre}"?`)) {
      onEliminarServicio(servicio.id)
      alert("Servicio eliminado")
    }
  }

  if (!autenticado) return null

  return (
    <div className="mt-6 border-t border-cyan-400/30 pt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Configuración</h3>
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
          <p className="text-white/70 text-sm">Número Nequi:</p>
          <p className="text-white font-medium">{configuracion.numeroNequi}</p>
        </div>
        <div className="bg-gray-800/40 p-3 rounded border border-cyan-400/20">
          <p className="text-white/70 text-sm">Cuenta Bancolombia:</p>
          <p className="text-white font-medium">{configuracion.cuentaBancolombia}</p>
        </div>
        <div className="bg-gray-800/40 p-3 rounded border border-cyan-400/20">
          <div className="flex items-center justify-between mb-2">
            <p className="text-white/70 text-sm">Servicios ({configuracion.servicios.length}):</p>
            <Button onClick={() => abrirEditarServicio()} size="sm" className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {configuracion.servicios.map((servicio) => (
              <div key={servicio.id} className="flex items-center justify-between bg-gray-700/30 p-2 rounded">
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">{servicio.nombre}</p>
                  <p className="text-cyan-400 text-sm">{formatearPrecio(servicio.precio)}</p>
                </div>
                <div className="flex gap-1">
                  <Button onClick={() => abrirEditarServicio(servicio)} size="sm" variant="outline">
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button onClick={() => eliminarServicio(servicio)} size="sm" variant="destructive">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dialog de configuración general */}
      <Dialog open={dialogConfigAbierto} onOpenChange={setDialogConfigAbierto}>
        <DialogContent className="bg-gray-900 border-cyan-400/30 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">⚙️ Configuración General</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-white text-sm font-medium mb-2 block">Número de Nequi:</label>
              <Input
                value={numeroNequi}
                onChange={(e) => setNumeroNequi(e.target.value)}
                placeholder="Ej: 3167530191"
                className="bg-gray-800 border-cyan-400/30 text-white"
              />
              <p className="text-white/60 text-xs mt-1">Este número se usará para recibir pagos por Nequi</p>
            </div>

            <div>
              <label className="text-white text-sm font-medium mb-2 block">Cuenta Bancolombia:</label>
              <Input
                value={cuentaBancolombia}
                onChange={(e) => setCuentaBancolombia(e.target.value)}
                placeholder="Ej: 12345678901"
                className="bg-gray-800 border-cyan-400/30 text-white"
              />
              <p className="text-white/60 text-xs mt-1">Número de cuenta de ahorros para transferencias</p>
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
                onClick={guardarConfiguracion}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold"
              >
                <Save className="h-4 w-4 mr-1" />
                Guardar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de servicios */}
      <Dialog open={dialogServicioAbierto} onOpenChange={setDialogServicioAbierto}>
        <DialogContent className="bg-gray-900 border-cyan-400/30 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">
              {servicioEditando ? "✏️ Editar Servicio" : "➕ Agregar Servicio"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-white text-sm font-medium mb-2 block">Nombre del servicio:</label>
              <Input
                value={nombreServicio}
                onChange={(e) => setNombreServicio(e.target.value)}
                placeholder="Ej: Corte con Diseño"
                className="bg-gray-800 border-cyan-400/30 text-white"
              />
            </div>

            <div>
              <label className="text-white text-sm font-medium mb-2 block">Precio (COP):</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                <Input
                  value={precioServicio}
                  onChange={(e) => setPrecioServicio(e.target.value.replace(/\D/g, ""))}
                  placeholder="20000"
                  className="bg-gray-800 border-cyan-400/30 text-white pl-10"
                />
              </div>
              {precioServicio && (
                <p className="text-cyan-400 text-sm mt-1">{formatearPrecio(Number.parseInt(precioServicio) || 0)}</p>
              )}
            </div>

            <div>
              <label className="text-white text-sm font-medium mb-2 block">Descripción:</label>
              <Textarea
                value={descripcionServicio}
                onChange={(e) => setDescripcionServicio(e.target.value)}
                placeholder="Describe el servicio..."
                className="bg-gray-800 border-cyan-400/30 text-white"
                rows={3}
              />
            </div>

            <div>
              <label className="text-white text-sm font-medium mb-2 block">Duración:</label>
              <Input
                value={duracionServicio}
                onChange={(e) => setDuracionServicio(e.target.value)}
                placeholder="Ej: 40 min"
                className="bg-gray-800 border-cyan-400/30 text-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="popular"
                checked={popularServicio}
                onChange={(e) => setPopularServicio(e.target.checked)}
                className="rounded border-cyan-400/30"
              />
              <label htmlFor="popular" className="text-white text-sm">
                Marcar como popular
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
              <Button onClick={guardarServicio} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold">
                <Save className="h-4 w-4 mr-1" />
                {servicioEditando ? "Actualizar" : "Agregar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
