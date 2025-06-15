import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Servicio } from "@/types"

interface PreciosProps {
  servicios: Servicio[]
}

export default function Precios({ servicios }: PreciosProps) {
  return (
    <section className="bg-black/50 backdrop-blur-sm rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Precios 💵</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {servicios.map((servicio) => (
          <Card key={servicio.id} className="bg-white/10 border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-lg">{servicio.nombre}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-400">${servicio.precio.toLocaleString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
