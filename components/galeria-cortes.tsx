"use client"

import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { FotoCorte } from "@/types"

interface GaleriaCortes {
  fotos: FotoCorte[]
}

export default function GaleriaCortes({ fotos }: GaleriaCortes) {
  return (
    <section className="bg-black/50 backdrop-blur-sm rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Nuestros Cortes 💇‍♂️</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {fotos.map((foto) => (
          <Card key={foto.id} className="bg-white/10 border-white/20 overflow-hidden">
            <CardContent className="p-0">
              <Image
                src={foto.url || "/placeholder.svg"}
                alt={foto.descripcion || `Corte ${foto.id}`}
                width={200}
                height={200}
                className="w-full h-48 object-cover"
              />
              {foto.descripcion && (
                <CardHeader className="p-2">
                  <CardTitle className="text-white text-sm text-center">{foto.descripcion}</CardTitle>
                </CardHeader>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
