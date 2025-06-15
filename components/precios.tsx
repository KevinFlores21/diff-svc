import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const PRECIOS = [
  { servicio: "Corte con diseño", precio: "$20.000" },
  { servicio: "Corte con barba", precio: "$28.000" },
  { servicio: "Corte para niños", precio: "$18.000" },
]

export default function Precios() {
  return (
    <section className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-6 mb-8 border border-cyan-400/30 shadow-lg shadow-cyan-400/20">
      <h2 className="text-2xl font-bold mb-6 text-center">💈 Precios</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {PRECIOS.map((item, index) => (
          <Card key={index} className="bg-gray-800/60 border-cyan-400/30 shadow-md shadow-cyan-400/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-lg text-center">{item.servicio}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-cyan-400 text-center">{item.precio}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
