"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, Banknote, Copy, Check, ExternalLink, Globe } from "lucide-react"
import Image from "next/image"
import type { ServicioPago, MetodoPago } from "@/types"

const SERVICIOS: ServicioPago[] = [
  {
    id: "1",
    nombre: "Corte con Diseño",
    precio: 20000,
    descripcion: "Corte moderno con diseños personalizados y acabado profesional",
    duracion: "40 min",
    popular: true,
  },
  {
    id: "2",
    nombre: "Corte con Barba",
    precio: 28000,
    descripcion: "Corte completo + arreglo de barba con técnicas profesionales",
    duracion: "60 min",
    popular: true,
  },
  {
    id: "3",
    nombre: "Corte para Niños",
    precio: 18000,
    descripcion: "Corte especial para niños con paciencia y cuidado",
    duracion: "30 min",
  },
]

const METODOS_PAGO: MetodoPago[] = [
  {
    id: "nequi",
    nombre: "Nequi",
    tipo: "nequi",
    numero: "3167530191",
    logo: "/nequi-logo.png",
    instrucciones: "Envía el pago a este número de Nequi y comparte el comprobante por WhatsApp",
    enlaceDirecto: "https://nequi.com.co/",
  },
  {
    id: "bancolombia",
    nombre: "Bancolombia",
    tipo: "bancolombia",
    numero: "12345678901",
    logo: "/bancolombia-logo.png",
    instrucciones: "Transfiere a esta cuenta de ahorros Bancolombia y envía el comprobante",
    enlaceDirecto: "https://www.bancolombia.com/personas",
  },
  {
    id: "pse",
    nombre: "PSE - Pagos Seguros en Línea",
    tipo: "pse",
    logo: "/pse-logo.png",
    instrucciones: "Paga desde cualquier banco colombiano de forma segura y rápida",
    enlaceDirecto: "https://www.pse.com.co/",
  },
  {
    id: "efectivo",
    nombre: "Efectivo",
    tipo: "efectivo",
    instrucciones: "Paga directamente en la barbería al momento del servicio",
  },
]

export default function MetodosPago() {
  const [dialogAbierto, setDialogAbierto] = useState(false)
  const [servicioSeleccionado, setServicioSeleccionado] = useState<ServicioPago | null>(null)
  const [metodoSeleccionado, setMetodoSeleccionado] = useState<MetodoPago | null>(null)
  const [nombreCliente, setNombreCliente] = useState("")
  const [numeroCliente, setNumeroCliente] = useState("")
  const [copiado, setCopiado] = useState(false)

  const formatearPrecio = (precio: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(precio)
  }

  const seleccionarServicio = (servicio: ServicioPago) => {
    setServicioSeleccionado(servicio)
    setDialogAbierto(true)
  }

  const copiarNumero = async (numero: string) => {
    try {
      await navigator.clipboard.writeText(numero)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    } catch (error) {
      alert("No se pudo copiar el número")
    }
  }

  const procesarPago = () => {
    if (!servicioSeleccionado || !metodoSeleccionado || !nombreCliente || !numeroCliente) {
      alert("Por favor completa todos los campos")
      return
    }

    let mensaje = ""

    if (metodoSeleccionado.tipo === "pse") {
      mensaje = `💳 SOLICITUD DE PAGO PSE

Servicio: ${servicioSeleccionado.nombre}
Precio: ${formatearPrecio(servicioSeleccionado.precio)}
Cliente: ${nombreCliente}
WhatsApp: ${numeroCliente}
Método: PSE (Pagos Seguros en Línea)

Quiero pagar a través de PSE. Por favor envíame el enlace de pago seguro.`
    } else {
      mensaje = `🛒 SOLICITUD DE PAGO

Servicio: ${servicioSeleccionado.nombre}
Precio: ${formatearPrecio(servicioSeleccionado.precio)}
Cliente: ${nombreCliente}
WhatsApp: ${numeroCliente}
Método de pago: ${metodoSeleccionado.nombre}

${metodoSeleccionado.tipo !== "efectivo" ? `Número para transferir: ${metodoSeleccionado.numero}` : ""}

Por favor confirma la disponibilidad y procede con el pago.`
    }

    window.open(`https://wa.me/573167530191?text=${encodeURIComponent(mensaje)}`, "_blank")

    // Limpiar formulario
    setNombreCliente("")
    setNumeroCliente("")
    setMetodoSeleccionado(null)
    setDialogAbierto(false)

    alert("Solicitud enviada. Te contactaremos para confirmar el pago y la cita.")
  }

  const abrirEnlaceDirecto = () => {
    if (metodoSeleccionado?.enlaceDirecto) {
      if (metodoSeleccionado.tipo === "nequi") {
        // Intenta abrir la app de Nequi primero
        window.open(`nequi://send?phone=${metodoSeleccionado.numero}&amount=${servicioSeleccionado?.precio}`, "_self")
        // Fallback a la web de Nequi
        setTimeout(() => {
          window.open(metodoSeleccionado.enlaceDirecto, "_blank")
        }, 1000)
      } else {
        window.open(metodoSeleccionado.enlaceDirecto, "_blank")
      }
    }
  }

  const generarEnlacePSE = () => {
    if (!servicioSeleccionado || !nombreCliente) return "#"

    // Simulación de enlace PSE (en producción sería un enlace real de PSE)
    const parametros = new URLSearchParams({
      amount: servicioSeleccionado.precio.toString(),
      description: `${servicioSeleccionado.nombre} - Caracas Alcon Barber`,
      customer_name: nombreCliente,
      customer_phone: numeroCliente,
    })

    return `https://checkout.pse.com.co/payment?${parametros.toString()}`
  }

  return (
    <section className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-6 mb-8 border border-cyan-400/30 shadow-lg shadow-cyan-400/20">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">💰 Precios y Pagos</h2>
        <p className="text-white/70">Elige tu servicio y paga de forma fácil y segura</p>
        <div className="flex justify-center items-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <Image src="/nequi-logo.png" alt="Nequi" width={30} height={30} className="rounded" />
            <Image src="/bancolombia-logo.png" alt="Bancolombia" width={30} height={30} className="rounded" />
            <Image src="/pse-logo.png" alt="PSE" width={30} height={30} className="rounded" />
            <span className="text-white/60 text-sm">Métodos seguros</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {SERVICIOS.map((servicio) => (
          <Card
            key={servicio.id}
            className={`bg-gray-800/60 border-cyan-400/30 shadow-md shadow-cyan-400/10 hover:border-cyan-400/50 transition-all cursor-pointer group ${
              servicio.popular ? "ring-2 ring-yellow-400/50" : ""
            }`}
            onClick={() => seleccionarServicio(servicio)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-lg">{servicio.nombre}</CardTitle>
                {servicio.popular && (
                  <span className="bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold">Popular</span>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-3xl font-bold text-cyan-400">{formatearPrecio(servicio.precio)}</p>
                <p className="text-white/70 text-sm">{servicio.descripcion}</p>
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">⏱️ {servicio.duracion}</span>
                  <Button
                    size="sm"
                    className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold group-hover:scale-105 transition-transform"
                  >
                    Pagar Ahora
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog de pago */}
      <Dialog open={dialogAbierto} onOpenChange={setDialogAbierto}>
        <DialogContent className="bg-gray-900 border-cyan-400/30 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">💳 Realizar Pago</DialogTitle>
          </DialogHeader>

          {servicioSeleccionado && (
            <div className="space-y-4">
              {/* Resumen del servicio */}
              <div className="bg-gray-800/60 p-4 rounded border border-cyan-400/20">
                <h3 className="text-white font-semibold mb-2">{servicioSeleccionado.nombre}</h3>
                <p className="text-white/70 text-sm mb-2">{servicioSeleccionado.descripcion}</p>
                <div className="flex justify-between items-center">
                  <span className="text-cyan-400 font-bold text-xl">
                    {formatearPrecio(servicioSeleccionado.precio)}
                  </span>
                  <span className="text-white/60 text-sm">⏱️ {servicioSeleccionado.duracion}</span>
                </div>
              </div>

              {/* Datos del cliente */}
              <div className="space-y-3">
                <div>
                  <label className="text-white text-sm font-medium mb-2 block">Tu nombre:</label>
                  <Input
                    value={nombreCliente}
                    onChange={(e) => setNombreCliente(e.target.value)}
                    placeholder="Ingresa tu nombre completo"
                    className="bg-gray-800 border-cyan-400/30 text-white"
                  />
                </div>
                <div>
                  <label className="text-white text-sm font-medium mb-2 block">Tu WhatsApp:</label>
                  <Input
                    value={numeroCliente}
                    onChange={(e) => setNumeroCliente(e.target.value)}
                    placeholder="Ej: 3167530191"
                    className="bg-gray-800 border-cyan-400/30 text-white"
                  />
                </div>
              </div>

              {/* Métodos de pago */}
              <div>
                <label className="text-white text-sm font-medium mb-3 block">Método de pago:</label>
                <div className="space-y-2">
                  {METODOS_PAGO.map((metodo) => (
                    <div
                      key={metodo.id}
                      className={`p-3 rounded border cursor-pointer transition-all ${
                        metodoSeleccionado?.id === metodo.id
                          ? "border-cyan-400 bg-cyan-400/10"
                          : "border-gray-600 hover:border-cyan-400/50"
                      }`}
                      onClick={() => setMetodoSeleccionado(metodo)}
                    >
                      <div className="flex items-center gap-3">
                        {metodo.logo ? (
                          <div className="w-8 h-8 relative flex-shrink-0">
                            <Image
                              src={metodo.logo || "/placeholder.svg"}
                              alt={metodo.nombre}
                              fill
                              className="object-contain rounded"
                            />
                          </div>
                        ) : (
                          <>{metodo.tipo === "efectivo" && <Banknote className="h-5 w-5 text-green-400" />}</>
                        )}
                        <div className="flex-1">
                          <p className="text-white font-medium">{metodo.nombre}</p>
                          {metodo.numero && (
                            <p className="text-white/70 text-sm">
                              {metodo.tipo === "nequi" ? "Nequi:" : "Cuenta:"} {metodo.numero}
                            </p>
                          )}
                          {metodo.tipo === "pse" && (
                            <p className="text-green-400 text-sm">✅ Todos los bancos colombianos</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Información del método seleccionado */}
              {metodoSeleccionado && (
                <div className="bg-blue-900/30 border border-blue-600/30 rounded p-3">
                  <p className="text-blue-200 text-sm mb-2">
                    <strong>Instrucciones:</strong>
                  </p>
                  <p className="text-blue-100 text-sm mb-3">{metodoSeleccionado.instrucciones}</p>

                  {metodoSeleccionado.numero && (
                    <div className="flex items-center gap-2 mb-3">
                      <Input
                        value={metodoSeleccionado.numero}
                        readOnly
                        className="bg-gray-800 border-cyan-400/30 text-white text-sm"
                      />
                      <Button
                        onClick={() => copiarNumero(metodoSeleccionado.numero!)}
                        size="sm"
                        variant="outline"
                        className="border-cyan-400/30 text-white hover:bg-cyan-400/10"
                      >
                        {copiado ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  )}

                  {metodoSeleccionado.enlaceDirecto && (
                    <div className="flex gap-2">
                      <Button
                        onClick={abrirEnlaceDirecto}
                        size="sm"
                        className={`flex-1 text-white font-bold ${
                          metodoSeleccionado.tipo === "nequi"
                            ? "bg-purple-600 hover:bg-purple-700"
                            : metodoSeleccionado.tipo === "bancolombia"
                              ? "bg-yellow-600 hover:bg-yellow-700"
                              : "bg-blue-600 hover:bg-blue-700"
                        }`}
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Abrir {metodoSeleccionado.nombre}
                      </Button>

                      {metodoSeleccionado.tipo === "pse" && nombreCliente && (
                        <Button
                          onClick={() => window.open(generarEnlacePSE(), "_blank")}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white font-bold"
                        >
                          <Globe className="h-4 w-4 mr-1" />
                          Pago Rápido
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Botones */}
              <div className="flex gap-2">
                <Button
                  onClick={() => setDialogAbierto(false)}
                  variant="outline"
                  className="flex-1 border-cyan-400/30 text-white hover:bg-cyan-400/10"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={procesarPago}
                  disabled={!metodoSeleccionado || !nombreCliente || !numeroCliente}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold"
                >
                  <CreditCard className="h-4 w-4 mr-1" />
                  {metodoSeleccionado?.tipo === "pse" ? "Solicitar PSE" : "Solicitar Pago"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
