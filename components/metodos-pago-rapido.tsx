"use client"

import { Button } from "@/components/ui/button"
import { Smartphone, CreditCard, Globe } from "lucide-react"
import Image from "next/image"

export default function MetodosPagoRapido() {
  const abrirNequi = () => {
    // Intenta abrir la app de Nequi
    window.open("nequi://", "_self")
    // Fallback a la web
    setTimeout(() => {
      window.open("https://nequi.com.co/", "_blank")
    }, 1000)
  }

  const abrirBancolombia = () => {
    window.open("https://www.bancolombia.com/personas", "_blank")
  }

  const abrirPSE = () => {
    window.open("https://www.pse.com.co/", "_blank")
  }

  return (
    <section className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 backdrop-blur-sm rounded-lg p-6 mb-8 border border-cyan-400/30 shadow-lg shadow-cyan-400/20">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">🚀 Pagos Rápidos</h2>
        <p className="text-white/70">Accede directamente a tu método de pago preferido</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Nequi */}
        <Button
          onClick={abrirNequi}
          className="h-20 bg-purple-600 hover:bg-purple-700 text-white font-bold flex flex-col items-center justify-center gap-2 transition-all hover:scale-105"
        >
          <div className="flex items-center gap-2">
            <Image src="/nequi-logo.png" alt="Nequi" width={24} height={24} className="rounded" />
            <Smartphone className="h-5 w-5" />
          </div>
          <span>Abrir Nequi</span>
        </Button>

        {/* Bancolombia */}
        <Button
          onClick={abrirBancolombia}
          className="h-20 bg-yellow-600 hover:bg-yellow-700 text-white font-bold flex flex-col items-center justify-center gap-2 transition-all hover:scale-105"
        >
          <div className="flex items-center gap-2">
            <Image src="/bancolombia-logo.png" alt="Bancolombia" width={24} height={24} className="rounded" />
            <CreditCard className="h-5 w-5" />
          </div>
          <span>Abrir Bancolombia</span>
        </Button>

        {/* PSE */}
        <Button
          onClick={abrirPSE}
          className="h-20 bg-blue-600 hover:bg-blue-700 text-white font-bold flex flex-col items-center justify-center gap-2 transition-all hover:scale-105"
        >
          <div className="flex items-center gap-2">
            <Image src="/pse-logo.png" alt="PSE" width={24} height={24} className="rounded" />
            <Globe className="h-5 w-5" />
          </div>
          <span>Pagar con PSE</span>
        </Button>
      </div>

      <div className="text-center mt-4">
        <p className="text-white/60 text-sm">
          💡 <strong>Tip:</strong> Con PSE puedes pagar desde cualquier banco colombiano de forma segura
        </p>
      </div>
    </section>
  )
}
