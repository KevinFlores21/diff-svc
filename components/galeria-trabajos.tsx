"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Camera, Calendar, Star } from "lucide-react"
import Image from "next/image"
import type { FotoCorte } from "@/types"

interface GaleriaProps {
  fotos: FotoCorte[]
}

// Datos específicos para cada corte con posiciones para recortar la imagen
const cortesEspecificos = [
  {
    id: "1",
    titulo: "Taper Fade con Diseño",
    descripcion: "Desvanecimiento clásico con diseño personalizado en la nuca. Estilo moderno y limpio.",
    estilo: "object-[50%_20%]", // Enfoca la parte superior izquierda
    popularidad: 5,
  },
  {
    id: "2",
    titulo: "Corte con Líneas Laterales",
    descripcion: "Fade con diseños geométricos en los laterales. Perfecto para un look urbano y fresco.",
    estilo: "object-[80%_20%]", // Enfoca la parte superior derecha
    popularidad: 4,
  },
  {
    id: "3",
    titulo: "Classic Fade Premium",
    descripcion: "Desvanecimiento profesional y elegante. El corte perfecto para cualquier ocasión.",
    estilo: "object-[50%_70%]", // Enfoca la parte inferior
    popularidad: 5,
  },
]

export default function GaleriaTrabajos({ fotos }: GaleriaProps) {
  const [fotoSeleccionada, setFotoSeleccionada] = useState<FotoCorte | null>(null)

  // Combinar fotos con datos específicos de cortes
  const fotosConDetalles = fotos.slice(0, 3).map((foto, index) => ({
    ...foto,
    ...cortesEspecificos[index],
  }))

  // Agregar fotos adicionales que el usuario haya subido
  const fotosAdicionales = fotos.slice(3)

  return (
    <section className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-6 mb-8 border border-cyan-400/30 shadow-lg shadow-cyan-400/20">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">📸 Galería de Trabajos</h2>
        <p className="text-white/70">Mira algunos de nuestros mejores cortes realizados por Caracas</p>
      </div>

      {fotos.length === 0 ? (
        <div className="text-center py-8">
          <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-white/70">Próximamente agregaremos fotos de nuestros trabajos</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Cortes destacados */}
          <div>
            <h3 className="text-lg font-semibold text-cyan-400 mb-4 text-center">✨ Cortes Destacados</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {fotosConDetalles.map((foto, index) => (
                <div
                  key={foto.id}
                  className="bg-gray-800/60 rounded-lg overflow-hidden border border-cyan-400/20 hover:border-cyan-400/50 transition-all cursor-pointer group hover:scale-105"
                  onClick={() => setFotoSeleccionada(foto)}
                >
                  <div className="relative aspect-square">
                    <Image
                      src={foto.url || "/placeholder.svg"}
                      alt={foto.titulo}
                      fill
                      className={`${foto.estilo || "object-cover"} group-hover:scale-110 transition-transform duration-500`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Badge de popularidad */}
                    <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current" />
                      {foto.popularidad}/5
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-white mb-2">{foto.titulo}</h3>
                    <p className="text-white/70 text-sm mb-3 line-clamp-2">{foto.descripcion}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-cyan-400 text-xs">
                        <Calendar className="h-3 w-3" />
                        {foto.fecha}
                      </div>
                      <span className="text-green-400 text-xs font-semibold">Por Caracas</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fotos adicionales subidas por el usuario */}
          {fotosAdicionales.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-cyan-400 mb-4 text-center">📷 Más Trabajos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {fotosAdicionales.map((foto) => (
                  <div
                    key={foto.id}
                    className="bg-gray-800/60 rounded-lg overflow-hidden border border-cyan-400/20 hover:border-cyan-400/50 transition-all cursor-pointer group"
                    onClick={() => setFotoSeleccionada(foto)}
                  >
                    <div className="relative aspect-square">
                      <Image
                        src={foto.url || "/placeholder.svg"}
                        alt={foto.titulo}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-white mb-1">{foto.titulo}</h3>
                      <p className="text-white/70 text-sm mb-2">{foto.descripcion}</p>
                      <div className="flex items-center gap-1 text-cyan-400 text-xs">
                        <Calendar className="h-3 w-3" />
                        {foto.fecha}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Dialog para ver foto en grande */}
      <Dialog open={!!fotoSeleccionada} onOpenChange={() => setFotoSeleccionada(null)}>
        <DialogContent className="bg-gray-900 border-cyan-400/30 max-w-2xl">
          {fotoSeleccionada && (
            <>
              <DialogHeader>
                <DialogTitle className="text-white flex items-center gap-2">
                  {fotoSeleccionada.titulo}
                  {cortesEspecificos.find((c) => c.id === fotoSeleccionada.id) && (
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm">Destacado</span>
                    </div>
                  )}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="relative aspect-square rounded-lg overflow-hidden">
                  <Image
                    src={fotoSeleccionada.url || "/placeholder.svg"}
                    alt={fotoSeleccionada.titulo}
                    fill
                    className={cortesEspecificos.find((c) => c.id === fotoSeleccionada.id)?.estilo || "object-cover"}
                  />
                </div>
                <div>
                  <p className="text-white/90 mb-3">{fotoSeleccionada.descripcion}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-cyan-400 text-sm">
                      <Calendar className="h-4 w-4" />
                      {fotoSeleccionada.fecha}
                    </div>
                    <span className="text-green-400 text-sm font-semibold">✂️ Por Caracas Alcon Barber</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
