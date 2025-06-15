import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const PRECIOS = [
  { servicio: "Corte sencillo", precio: "$10.000" },
  { servicio: "Corte + Diseño", precio: "$15.000" },
  { servicio: "Afeitada", precio: "$8.000" },
]

export default function Precios() {
  return (
    <section className="bg-black/50 backdrop-blur-sm rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Precios 💵</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {PRECIOS.map((item, index) => (
          <Card key={index} className="bg-white/10 border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-lg">{item.servicio}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-400">{item.precio}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
