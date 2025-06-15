"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Trash2, Upload, ImageIcon, Camera, X } from "lucide-react"
import Image from "next/image"
import type { FotoCorte } from "@/types"

interface PanelGaleriaProps {
  fotos: FotoCorte[]
  onAgregarFoto: (foto: Omit<FotoCorte, "id" | "fecha">) => void
  onEliminarFoto: (id: string) => void
  onConvertirArchivo: (archivo: File) => Promise<string>
  autenticado: boolean
}

export default function PanelGaleria({
  fotos,
  onAgregarFoto,
  onEliminarFoto,
  onConvertirArchivo,
  autenticado,
}: PanelGaleriaProps) {
  const [dialogAbierto, setDialogAbierto] = useState(false)
  const [imagenSeleccionada, setImagenSeleccionada] = useState<string>("")
  const [titulo, setTitulo] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [cargandoImagen, setCargandoImagen] = useState(false)
  const inputFileRef = useRef<HTMLInputElement>(null)

  const manejarSeleccionArchivo = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = event.target.files?.[0]
    if (!archivo) return

    // Validar que sea una imagen
    if (!archivo.type.startsWith("image/")) {
      alert("Por favor selecciona solo archivos de imagen (JPG, PNG, GIF, etc.)")
      return
    }

    // Validar tamaño (máximo 5MB)
    if (archivo.size > 5 * 1024 * 1024) {
      alert("La imagen es muy grande. Por favor selecciona una imagen menor a 5MB.")
      return
    }

    setCargandoImagen(true)
    try {
      const imagenBase64 = await onConvertirArchivo(archivo)
      setImagenSeleccionada(imagenBase64)
    } catch (error) {
      alert("Error al procesar la imagen. Inténtalo de nuevo.")
      console.error("Error:", error)
    } finally {
      setCargandoImagen(false)
    }
  }

  const abrirSelectorArchivos = () => {
    inputFileRef.current?.click()
  }

  const limpiarImagen = () => {
    setImagenSeleccionada("")
    if (inputFileRef.current) {
      inputFileRef.current.value = ""
    }
  }

  const agregarFoto = () => {
    if (!imagenSeleccionada || !titulo || !descripcion) {
      alert("Por favor completa todos los campos y selecciona una imagen")
      return
    }

    onAgregarFoto({
      url: imagenSeleccionada,
      titulo,
      descripcion,
    })

    // Limpiar formulario
    setImagenSeleccionada("")
    setTitulo("")
    setDescripcion("")
    setDialogAbierto(false)
    if (inputFileRef.current) {
      inputFileRef.current.value = ""
    }

    alert("Foto agregada exitosamente")
  }

  const eliminarFoto = (id: string, titulo: string) => {
    if (confirm(`¿Estás seguro de eliminar "${titulo}"?`)) {
      onEliminarFoto(id)
      alert("Foto eliminada")
    }
  }

  if (!autenticado) return null

  return (
    <div className="mt-6 border-t border-cyan-400/30 pt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Gestionar Galería</h3>
        <Button
          onClick={() => setDialogAbierto(true)}
          className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-1" />
          Agregar Foto
        </Button>
      </div>

      <div className="space-y-3 max-h-64 overflow-y-auto">
        {fotos.length === 0 ? (
          <div className="text-center py-4">
            <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-white/70 text-sm">No hay fotos en la galería</p>
          </div>
        ) : (
          fotos.map((foto) => (
            <div key={foto.id} className="flex items-center gap-3 bg-gray-800/40 p-3 rounded border border-cyan-400/20">
              <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0">
                <Image src={foto.url || "/placeholder.svg"} alt={foto.titulo} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{foto.titulo}</p>
                <p className="text-white/70 text-sm truncate">{foto.descripcion}</p>
                <p className="text-cyan-400 text-xs">{foto.fecha}</p>
              </div>
              <Button
                onClick={() => eliminarFoto(foto.id, foto.titulo)}
                variant="destructive"
                size="sm"
                className="flex-shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </div>

      {/* Input oculto para seleccionar archivos */}
      <input ref={inputFileRef} type="file" accept="image/*" onChange={manejarSeleccionArchivo} className="hidden" />

      {/* Dialog para agregar foto */}
      <Dialog open={dialogAbierto} onOpenChange={setDialogAbierto}>
        <DialogContent className="bg-gray-900 border-cyan-400/30 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Agregar Nueva Foto</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Selector de imagen */}
            <div>
              <label className="text-white text-sm font-medium mb-2 block">Seleccionar imagen:</label>

              {!imagenSeleccionada ? (
                <div className="border-2 border-dashed border-cyan-400/30 rounded-lg p-6 text-center">
                  <Camera className="h-12 w-12 text-cyan-400 mx-auto mb-2" />
                  <p className="text-white/70 mb-3">Selecciona una foto del corte</p>
                  <Button
                    onClick={abrirSelectorArchivos}
                    disabled={cargandoImagen}
                    className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold"
                  >
                    {cargandoImagen ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                        Procesando...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Seleccionar Foto
                      </>
                    )}
                  </Button>
                  <p className="text-white/50 text-xs mt-2">Formatos: JPG, PNG, GIF (máx. 5MB)</p>
                </div>
              ) : (
                <div className="relative">
                  <div className="relative w-full h-48 rounded border border-cyan-400/30 overflow-hidden">
                    <Image
                      src={imagenSeleccionada || "/placeholder.svg"}
                      alt="Vista previa"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <Button onClick={limpiarImagen} variant="destructive" size="sm" className="absolute top-2 right-2">
                    <X className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={abrirSelectorArchivos}
                    variant="outline"
                    size="sm"
                    className="absolute bottom-2 right-2 bg-black/50 border-cyan-400/30 text-white hover:bg-cyan-400/10"
                  >
                    Cambiar
                  </Button>
                </div>
              )}
            </div>

            {/* Título del corte */}
            <div>
              <label className="text-white text-sm font-medium mb-2 block">Título del corte:</label>
              <Input
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ej: Fade Moderno, Corte Clásico..."
                className="bg-gray-800 border-cyan-400/30 text-white"
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="text-white text-sm font-medium mb-2 block">Descripción:</label>
              <Textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Describe el estilo, técnica utilizada, etc."
                className="bg-gray-800 border-cyan-400/30 text-white"
                rows={3}
              />
            </div>

            {/* Botones */}
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setDialogAbierto(false)
                  limpiarImagen()
                  setTitulo("")
                  setDescripcion("")
                }}
                variant="outline"
                className="flex-1 border-cyan-400/30 text-white hover:bg-cyan-400/10"
              >
                Cancelar
              </Button>
              <Button
                onClick={agregarFoto}
                disabled={!imagenSeleccionada || !titulo || !descripcion}
                className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-black font-bold disabled:opacity-50"
              >
                <Camera className="h-4 w-4 mr-1" />
                Agregar Foto
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
