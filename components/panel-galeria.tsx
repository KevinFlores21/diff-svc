"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Plus,
  Trash2,
  Upload,
  ImageIcon,
  Camera,
  X,
  Download,
  FileUp,
  Save,
  Globe,
  RefreshCw,
  Star,
} from "lucide-react"
import Image from "next/image"
import type { FotoCorte } from "@/types"

interface PanelGaleriaProps {
  fotos: FotoCorte[]
  onAgregarFoto: (foto: Omit<FotoCorte, "id" | "fecha">) => void
  onReemplazarFoto: (fotoId: string, foto: Omit<FotoCorte, "id" | "fecha">) => void
  onEliminarFoto: (id: string) => void
  onConvertirArchivo: (archivo: File) => Promise<string>
  onCrearRespaldo: () => any
  onRestaurarRespaldo: (archivo: File) => Promise<void>
  onExportarHTML: () => void
  autenticado: boolean
}

export default function PanelGaleria({
  fotos,
  onAgregarFoto,
  onReemplazarFoto,
  onEliminarFoto,
  onConvertirArchivo,
  onCrearRespaldo,
  onRestaurarRespaldo,
  onExportarHTML,
  autenticado,
}: PanelGaleriaProps) {
  const [dialogAbierto, setDialogAbierto] = useState(false)
  const [dialogRespaldo, setDialogRespaldo] = useState(false)
  const [modoEdicion, setModoEdicion] = useState<"agregar" | "reemplazar">("agregar")
  const [fotoReemplazando, setFotoReemplazando] = useState<FotoCorte | null>(null)
  const [imagenSeleccionada, setImagenSeleccionada] = useState<string>("")
  const [titulo, setTitulo] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [cargandoImagen, setCargandoImagen] = useState(false)
  const [cargandoRespaldo, setCargandoRespaldo] = useState(false)
  const inputFileRef = useRef<HTMLInputElement>(null)
  const inputRespaldoRef = useRef<HTMLInputElement>(null)

  const manejarSeleccionArchivo = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = event.target.files?.[0]
    if (!archivo) return

    // Validar que sea una imagen
    if (!archivo.type.startsWith("image/")) {
      alert("Por favor selecciona solo archivos de imagen (JPG, PNG, GIF, etc.)")
      return
    }

    // Validar tamaño (máximo 10MB para mejor calidad)
    if (archivo.size > 10 * 1024 * 1024) {
      alert("La imagen es muy grande. Por favor selecciona una imagen menor a 10MB.")
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

  const manejarRestaurarRespaldo = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = event.target.files?.[0]
    if (!archivo) return

    if (!archivo.name.endsWith(".json")) {
      alert("Por favor selecciona un archivo de respaldo válido (.json)")
      return
    }

    setCargandoRespaldo(true)
    try {
      await onRestaurarRespaldo(archivo)
      alert("¡Respaldo restaurado exitosamente!")
      setDialogRespaldo(false)
    } catch (error) {
      alert("Error al restaurar el respaldo. Verifica que el archivo sea válido.")
      console.error("Error:", error)
    } finally {
      setCargandoRespaldo(false)
      if (inputRespaldoRef.current) {
        inputRespaldoRef.current.value = ""
      }
    }
  }

  const abrirAgregarFoto = () => {
    setModoEdicion("agregar")
    setFotoReemplazando(null)
    setTitulo("")
    setDescripcion("")
    setImagenSeleccionada("")
    setDialogAbierto(true)
  }

  const abrirReemplazarFoto = (foto: FotoCorte) => {
    setModoEdicion("reemplazar")
    setFotoReemplazando(foto)
    setTitulo(foto.titulo)
    setDescripcion(foto.descripcion)
    setImagenSeleccionada("")
    setDialogAbierto(true)
  }

  const abrirSelectorArchivos = () => {
    inputFileRef.current?.click()
  }

  const abrirSelectorRespaldo = () => {
    inputRespaldoRef.current?.click()
  }

  const limpiarImagen = () => {
    setImagenSeleccionada("")
    if (inputFileRef.current) {
      inputFileRef.current.value = ""
    }
  }

  const procesarFoto = () => {
    if (!titulo || !descripcion) {
      alert("Por favor completa el título y la descripción")
      return
    }

    if (modoEdicion === "reemplazar" && fotoReemplazando) {
      // Para reemplazar, la imagen es opcional (puede mantener la actual)
      const datosActualizados = {
        url: imagenSeleccionada || fotoReemplazando.url,
        titulo,
        descripcion,
      }
      onReemplazarFoto(fotoReemplazando.id, datosActualizados)
      alert("Foto actualizada exitosamente")
    } else {
      // Para agregar, la imagen es obligatoria
      if (!imagenSeleccionada) {
        alert("Por favor selecciona una imagen")
        return
      }
      onAgregarFoto({
        url: imagenSeleccionada,
        titulo,
        descripcion,
      })
      alert("Foto agregada exitosamente")
    }

    // Limpiar formulario
    setImagenSeleccionada("")
    setTitulo("")
    setDescripcion("")
    setDialogAbierto(false)
    setFotoReemplazando(null)
    if (inputFileRef.current) {
      inputFileRef.current.value = ""
    }
  }

  const eliminarFoto = (id: string, titulo: string) => {
    if (confirm(`¿Estás seguro de eliminar "${titulo}"?`)) {
      onEliminarFoto(id)
    }
  }

  const crearRespaldo = () => {
    try {
      onCrearRespaldo()
      alert("¡Respaldo creado exitosamente! El archivo se ha descargado.")
    } catch (error) {
      alert("Error al crear el respaldo.")
      console.error("Error:", error)
    }
  }

  const exportarHTML = () => {
    try {
      onExportarHTML()
      alert("¡Galería exportada como página web! El archivo HTML se ha descargado.")
    } catch (error) {
      alert("Error al exportar la galería.")
      console.error("Error:", error)
    }
  }

  if (!autenticado) return null

  const fotosDestacadas = fotos.filter((f) => f.tipo === "destacada")
  const fotosAdicionales = fotos.filter((f) => f.tipo === "adicional")

  return (
    <div className="mt-6 border-t border-cyan-400/30 pt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">📸 Gestionar Galería</h3>
        <div className="flex gap-2">
          <Button
            onClick={() => setDialogRespaldo(true)}
            className="bg-green-600 hover:bg-green-700 text-white font-bold"
            size="sm"
          >
            <Save className="h-4 w-4 mr-1" />
            Guardar
          </Button>
          <Button onClick={abrirAgregarFoto} className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold" size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Agregar
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Fotos destacadas */}
        {fotosDestacadas.length > 0 && (
          <div>
            <h4 className="text-white font-medium mb-2 flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-400" />
              Fotos Destacadas ({fotosDestacadas.length})
            </h4>
            <div className="space-y-2">
              {fotosDestacadas.map((foto) => (
                <div
                  key={foto.id}
                  className="flex items-center gap-3 bg-yellow-900/20 p-3 rounded border border-yellow-400/30"
                >
                  <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0">
                    <Image src={foto.url || "/placeholder.svg"} alt={foto.titulo} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{foto.titulo}</p>
                    <p className="text-white/70 text-sm truncate">{foto.descripcion}</p>
                    <p className="text-yellow-400 text-xs">⭐ Destacada • {foto.fecha}</p>
                  </div>
                  <Button
                    onClick={() => abrirReemplazarFoto(foto)}
                    size="sm"
                    className="bg-yellow-600 hover:bg-yellow-700 text-white flex-shrink-0"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fotos adicionales */}
        <div>
          <h4 className="text-white font-medium mb-2">📷 Fotos Adicionales ({fotosAdicionales.length})</h4>
          {fotosAdicionales.length === 0 ? (
            <div className="text-center py-4">
              <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-white/70 text-sm">No hay fotos adicionales</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {fotosAdicionales.map((foto) => (
                <div
                  key={foto.id}
                  className="flex items-center gap-3 bg-gray-800/40 p-3 rounded border border-cyan-400/20"
                >
                  <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0">
                    <Image src={foto.url || "/placeholder.svg"} alt={foto.titulo} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{foto.titulo}</p>
                    <p className="text-white/70 text-sm truncate">{foto.descripcion}</p>
                    <p className="text-cyan-400 text-xs">{foto.fecha}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      onClick={() => abrirReemplazarFoto(foto)}
                      size="sm"
                      variant="outline"
                      className="border-cyan-400/30 text-white hover:bg-cyan-400/10 flex-shrink-0"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => eliminarFoto(foto.id, foto.titulo)}
                      variant="destructive"
                      size="sm"
                      className="flex-shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Inputs ocultos */}
      <input ref={inputFileRef} type="file" accept="image/*" onChange={manejarSeleccionArchivo} className="hidden" />
      <input ref={inputRespaldoRef} type="file" accept=".json" onChange={manejarRestaurarRespaldo} className="hidden" />

      {/* Dialog para agregar/reemplazar foto */}
      <Dialog open={dialogAbierto} onOpenChange={setDialogAbierto}>
        <DialogContent className="bg-gray-900 border-cyan-400/30 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">
              {modoEdicion === "reemplazar" ? "🔄 Reemplazar Foto" : "📸 Agregar Nueva Foto"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Selector de imagen */}
            <div>
              <label className="text-white text-sm font-medium mb-2 block">
                {modoEdicion === "reemplazar" ? "Nueva imagen (opcional):" : "Seleccionar imagen:"}
              </label>

              {!imagenSeleccionada ? (
                <div className="border-2 border-dashed border-cyan-400/30 rounded-lg p-6 text-center">
                  {modoEdicion === "reemplazar" && fotoReemplazando ? (
                    <div className="relative w-full h-32 mb-3 rounded overflow-hidden">
                      <Image
                        src={fotoReemplazando.url || "/placeholder.svg"}
                        alt="Imagen actual"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white text-sm">Imagen actual</span>
                      </div>
                    </div>
                  ) : (
                    <Camera className="h-12 w-12 text-cyan-400 mx-auto mb-2" />
                  )}
                  <p className="text-white/70 mb-3">
                    {modoEdicion === "reemplazar"
                      ? "Selecciona una nueva imagen o mantén la actual"
                      : "Selecciona una foto del corte"}
                  </p>
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
                        {modoEdicion === "reemplazar" ? "Cambiar Imagen" : "Seleccionar Foto"}
                      </>
                    )}
                  </Button>
                  <p className="text-white/50 text-xs mt-2">Formatos: JPG, PNG, GIF (máx. 10MB)</p>
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
                  setFotoReemplazando(null)
                }}
                variant="outline"
                className="flex-1 border-cyan-400/30 text-white hover:bg-cyan-400/10"
              >
                Cancelar
              </Button>
              <Button
                onClick={procesarFoto}
                disabled={!titulo || !descripcion || (modoEdicion === "agregar" && !imagenSeleccionada)}
                className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-black font-bold disabled:opacity-50"
              >
                <Camera className="h-4 w-4 mr-1" />
                {modoEdicion === "reemplazar" ? "Actualizar" : "Agregar Foto"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para opciones de respaldo */}
      <Dialog open={dialogRespaldo} onOpenChange={setDialogRespaldo}>
        <DialogContent className="bg-gray-900 border-cyan-400/30 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">💾 Guardar Galería</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-white/70 text-sm">
              Guarda tus fotos para que no se pierdan. Las fotos se guardan automáticamente en tu navegador y también
              puedes crear respaldos.
            </p>

            <div className="bg-green-900/30 border border-green-600/30 rounded p-3">
              <p className="text-green-200 text-sm">
                ✅ <strong>Auto-guardado activo:</strong> Tus fotos se guardan automáticamente en el navegador y no se
                eliminarán.
              </p>
            </div>

            <div className="space-y-3">
              <Button onClick={crearRespaldo} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold">
                <Download className="h-4 w-4 mr-2" />
                Descargar Respaldo (.json)
              </Button>

              <Button onClick={exportarHTML} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold">
                <Globe className="h-4 w-4 mr-2" />
                Exportar como Página Web (.html)
              </Button>

              <div className="border-t border-cyan-400/30 pt-3">
                <p className="text-white/70 text-sm mb-2">Restaurar desde respaldo:</p>
                <Button
                  onClick={abrirSelectorRespaldo}
                  disabled={cargandoRespaldo}
                  variant="outline"
                  className="w-full border-cyan-400/30 text-white hover:bg-cyan-400/10"
                >
                  {cargandoRespaldo ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Restaurando...
                    </>
                  ) : (
                    <>
                      <FileUp className="h-4 w-4 mr-2" />
                      Cargar Respaldo
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="bg-yellow-900/30 border border-yellow-600/30 rounded p-3">
              <p className="text-yellow-200 text-xs">
                💡 <strong>Consejo:</strong> Las fotos destacadas no se pueden eliminar, solo reemplazar. Crea respaldos
                regularmente para mayor seguridad.
              </p>
            </div>

            <Button
              onClick={() => setDialogRespaldo(false)}
              variant="outline"
              className="w-full border-cyan-400/30 text-white hover:bg-cyan-400/10"
            >
              Cerrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
