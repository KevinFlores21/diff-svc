"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Camera, Calendar } from "lucide-react"
import Image from "next/image"
import type { FotoCorte } from "@/types"

interface GaleriaProps {
  fotos: FotoCorte[]
}

export default function GaleriaTrabajos({ fotos }: GaleriaProps) {
  const [fotoSeleccionada, setFotoSeleccionada] = useState<FotoCorte | null>(null)

  return (
    <section className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-6 mb-8 border border-cyan-400/30 shadow-lg shadow-cyan-400/20">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">📸 Galería de Trabajos</h2>
        <p className="text-white/70">Mira algunos de nuestros mejores cortes</p>
      </div>

      {fotos.length === 0 ? (
        <div className="text-center py-8">
          <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-white/70">Próximamente agregaremos fotos de nuestros trabajos</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {fotos.map((foto) => (
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
      )}

      {/* Dialog para ver foto en grande */}
      <Dialog open={!!fotoSeleccionada} onOpenChange={() => setFotoSeleccionada(null)}>
        <DialogContent className="bg-gray-900 border-cyan-400/30 max-w-2xl">
          {fotoSeleccionada && (
            <>
              <DialogHeader>
                <DialogTitle className="text-white">{fotoSeleccionada.titulo}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="relative aspect-square rounded-lg overflow-hidden">
                  <Image
                    src={fotoSeleccionada.url || "/placeholder.svg"}
                    alt={fotoSeleccionada.titulo}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-white/90 mb-2">{fotoSeleccionada.descripcion}</p>
                  <div className="flex items-center gap-1 text-cyan-400 text-sm">
                    <Calendar className="h-4 w-4" />
                    {fotoSeleccionada.fecha}
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
