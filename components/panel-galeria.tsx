"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Trash2, Upload, ImageIcon } from "lucide-react"
import Image from "next/image"
import type { FotoCorte } from "@/types"

interface PanelGaleriaProps {
  fotos: FotoCorte[]
  onAgregarFoto: (foto: Omit<FotoCorte, "id" | "fecha">) => void
  onEliminarFoto: (id: string) => void
  autenticado: boolean
}

export default function PanelGaleria({ fotos, onAgregarFoto, onEliminarFoto, autenticado }: PanelGaleriaProps) {
  const [dialogAbierto, setDialogAbierto] = useState(false)
  const [urlImagen, setUrlImagen] = useState("")
  const [titulo, setTitulo] = useState("")
  const [descripcion, setDescripcion] = useState("")

  const agregarFoto = () => {
    if (!urlImagen || !titulo || !descripcion) {
      alert("Por favor completa todos los campos")
      return
    }

    onAgregarFoto({
      url: urlImagen,
      titulo,
      descripcion,
    })

    // Limpiar formulario
    setUrlImagen("")
    setTitulo("")
    setDescripcion("")
    setDialogAbierto(false)

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

      {/* Dialog para agregar foto */}
      <Dialog open={dialogAbierto} onOpenChange={setDialogAbierto}>
        <DialogContent className="bg-gray-900 border-cyan-400/30">
          <DialogHeader>
            <DialogTitle className="text-white">Agregar Nueva Foto</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-white text-sm font-medium mb-2 block">URL de la imagen:</label>
              <Input
                value={urlImagen}
                onChange={(e) => setUrlImagen(e.target.value)}
                placeholder="https://ejemplo.com/imagen.jpg"
                className="bg-gray-800 border-cyan-400/30 text-white"
              />
              <p className="text-white/50 text-xs mt-1">
                Puedes usar servicios como Imgur, Google Drive, o cualquier URL de imagen
              </p>
            </div>

            <div>
              <label className="text-white text-sm font-medium mb-2 block">Título del corte:</label>
              <Input
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ej: Fade Moderno, Corte Clásico..."
                className="bg-gray-800 border-cyan-400/30 text-white"
              />
            </div>

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

            {urlImagen && (
              <div>
                <label className="text-white text-sm font-medium mb-2 block">Vista previa:</label>
                <div className="relative w-full h-32 rounded border border-cyan-400/30 overflow-hidden">
                  <Image
                    src={urlImagen || "/placeholder.svg"}
                    alt="Vista previa"
                    fill
                    className="object-cover"
                    onError={() => alert("Error al cargar la imagen. Verifica la URL.")}
                  />
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={() => setDialogAbierto(false)}
                variant="outline"
                className="flex-1 border-cyan-400/30 text-white hover:bg-cyan-400/10"
              >
                Cancelar
              </Button>
              <Button onClick={agregarFoto} className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-black font-bold">
                <Upload className="h-4 w-4 mr-1" />
                Agregar Foto
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
