"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, Banknote, ExternalLink, ArrowRight, ArrowLeft } from "lucide-react"
import Image from "next/image"
import type { ServicioPago, MetodoPago, ConfiguracionApp } from "@/types"

interface MetodosPagoProps {
  configuracion: ConfiguracionApp
}

export default function MetodosPago({ configuracion }: MetodosPagoProps) {
  const [dialogAbierto, setDialogAbierto] = useState(false)
  const [pasoActual, setPasoActual] = useState<"seleccion" | "datos" | "transferencia">("seleccion")
  const [servicioSeleccionado, setServicioSeleccionado] = useState<ServicioPago | null>(null)
  const [metodoSeleccionado, setMetodoSeleccionado] = useState<MetodoPago | null>(null)
  const [nombreCliente, setNombreCliente] = useState("")
  const [numeroCliente, setNumeroCliente] = useState("")
  const [copiado, setCopiado] = useState(false)

  // Estados para datos de transferencia
  const [numeroTransferencia, setNumeroTransferencia] = useState("")
  const [montoTransferencia, setMontoTransferencia] = useState("")
  const [fechaTransferencia, setFechaTransferencia] = useState("")
  const [horaTransferencia, setHoraTransferencia] = useState("")

  const METODOS_PAGO: MetodoPago[] = [
    {
      id: "nequi",
      nombre: "Nequi",
      tipo: "nequi",
      numero: configuracion.numeroNequi,
      logo: "/nequi-logo.png",
      instrucciones: "Envía el pago a este número de Nequi y comparte el comprobante por WhatsApp",
      enlaceDirecto: "https://nequi.com.co/",
    },
    {
      id: "bancolombia",
      nombre: "Bancolombia",
      tipo: "bancolombia",
      numero: configuracion.cuentaBancolombia,
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

  const formatearPrecio = (precio: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(precio)
  }

  const seleccionarServicio = (servicio: ServicioPago) => {
    setServicioSeleccionado(servicio)
    setPasoActual("seleccion")
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

  const continuarADatos = () => {
    if (!metodoSeleccionado) {
      alert("Por favor selecciona un método de pago")
      return
    }
    setPasoActual("datos")
  }

  const continuarATransferencia = () => {
    if (!nombreCliente || !numeroCliente) {
      alert("Por favor completa todos los campos")
      return
    }

    if (metodoSeleccionado?.tipo === "efectivo") {
      // Para efectivo, ir directo a confirmar
      confirmarPago()
    } else if (metodoSeleccionado?.tipo === "pse") {
      // Para PSE, solicitar enlace
      solicitarEnlacePSE()
    } else {
      // Para Nequi y Bancolombia, ir a datos de transferencia
      setPasoActual("transferencia")
    }
  }

  const volverAPaso = (paso: "seleccion" | "datos" | "transferencia") => {
    setPasoActual(paso)
  }

  const solicitarEnlacePSE = () => {
    if (!servicioSeleccionado || !metodoSeleccionado || !nombreCliente || !numeroCliente) return

    const mensaje = `💳 SOLICITUD DE PAGO PSE

🛒 Servicio: ${servicioSeleccionado.nombre}
💰 Precio: ${formatearPrecio(servicioSeleccionado.precio)}
👤 Cliente: ${nombreCliente}
📱 WhatsApp: ${numeroCliente}

🌐 Quiero pagar con PSE (Pagos Seguros en Línea)
Por favor envíame el enlace de pago seguro para completar la transacción desde mi banco.`

    window.open(`https://wa.me/573167530191?text=${encodeURIComponent(mensaje)}`, "_blank")
    limpiarFormulario()
    alert("¡Excelente! Te enviaremos el enlace de PSE por WhatsApp para que pagues desde tu banco.")
  }

  const confirmarPago = () => {
    if (!servicioSeleccionado || !metodoSeleccionado || !nombreCliente || !numeroCliente) return

    let mensaje = ""

    if (metodoSeleccionado.tipo === "efectivo") {
      mensaje = `💵 PAGO EN EFECTIVO

🛒 Servicio: ${servicioSeleccionado.nombre}
💰 Precio: ${formatearPrecio(servicioSeleccionado.precio)}
👤 Cliente: ${nombreCliente}
📱 WhatsApp: ${numeroCliente}

💰 Voy a pagar en efectivo en la barbería.
Por favor confirma mi cita y la disponibilidad.`
    } else {
      // Para Nequi y Bancolombia con datos de transferencia
      mensaje = `${metodoSeleccionado.tipo === "nequi" ? "💜 PAGO CON NEQUI" : "🏦 TRANSFERENCIA BANCOLOMBIA"}

🛒 Servicio: ${servicioSeleccionado.nombre}
💰 Precio: ${formatearPrecio(servicioSeleccionado.precio)}
👤 Cliente: ${nombreCliente}
📱 WhatsApp: ${numeroCliente}

💸 DATOS DE LA TRANSFERENCIA:
${metodoSeleccionado.tipo === "nequi" ? "Número Nequi:" : "Cuenta:"} ${metodoSeleccionado.numero}
Número de transferencia: ${numeroTransferencia}
Monto enviado: $${montoTransferencia}
Fecha: ${fechaTransferencia}
Hora: ${horaTransferencia}

✅ Transferencia realizada. Por favor confirma cuando recibas el pago.`
    }

    window.open(`https://wa.me/573167530191?text=${encodeURIComponent(mensaje)}`, "_blank")
    limpiarFormulario()

    if (metodoSeleccionado.tipo === "nequi") {
      alert("¡Perfecto! Hemos recibido los datos de tu transferencia Nequi. Te contactaremos para confirmar.")
    } else if (metodoSeleccionado.tipo === "bancolombia") {
      alert("¡Excelente! Hemos recibido los datos de tu transferencia Bancolombia. Te contactaremos para confirmar.")
    } else {
      alert("¡Perfecto! Tu solicitud fue enviada. Te contactaremos para confirmar.")
    }
  }

  const limpiarFormulario = () => {
    setNombreCliente("")
    setNumeroCliente("")
    setNumeroTransferencia("")
    setMontoTransferencia("")
    setFechaTransferencia("")
    setHoraTransferencia("")
    setMetodoSeleccionado(null)
    setPasoActual("seleccion")
    setDialogAbierto(false)
  }

  const abrirEnlaceDirecto = () => {
    if (metodoSeleccionado?.enlaceDirecto) {
      if (metodoSeleccionado.tipo === "nequi") {
        window.open(`nequi://send?phone=${metodoSeleccionado.numero}&amount=${servicioSeleccionado?.precio}`, "_self")
        setTimeout(() => {
          window.open(metodoSeleccionado.enlaceDirecto, "_blank")
        }, 1000)
      } else {
        window.open(metodoSeleccionado.enlaceDirecto, "_blank")
      }
    }
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
        {configuracion.servicios.map((servicio) => (
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
            <DialogTitle className="text-white">
              {pasoActual === "seleccion" && "💳 Seleccionar Método de Pago"}
              {pasoActual === "datos" && "👤 Datos del Cliente"}
              {pasoActual === "transferencia" && "💸 Datos de la Transferencia"}
            </DialogTitle>
          </DialogHeader>

          {servicioSeleccionado && (
            <div className="space-y-4">
              {/* Resumen del servicio - siempre visible */}
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

              {/* PASO 1: Selección de método de pago */}
              {pasoActual === "seleccion" && (
                <>
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

                  <div className="flex gap-2">
                    <Button
                      onClick={() => setDialogAbierto(false)}
                      variant="outline"
                      className="flex-1 border-cyan-400/30 text-white hover:bg-cyan-400/10"
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={continuarADatos}
                      disabled={!metodoSeleccionado}
                      className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-black font-bold"
                    >
                      Aceptar
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </>
              )}

              {/* PASO 2: Datos del cliente */}
              {pasoActual === "datos" && metodoSeleccionado && (
                <>
                  <div className="bg-blue-900/30 border border-blue-600/30 rounded p-3">
                    <div className="flex items-center gap-2 mb-2">
                      {metodoSeleccionado.logo ? (
                        <div className="w-6 h-6 relative">
                          <Image
                            src={metodoSeleccionado.logo || "/placeholder.svg"}
                            alt={metodoSeleccionado.nombre}
                            fill
                            className="object-contain rounded"
                          />
                        </div>
                      ) : (
                        <Banknote className="h-5 w-5 text-green-400" />
                      )}
                      <p className="text-blue-200 font-medium">Método seleccionado: {metodoSeleccionado.nombre}</p>
                    </div>
                    {metodoSeleccionado.numero && (
                      <p className="text-blue-100 text-sm">
                        {metodoSeleccionado.tipo === "nequi" ? "Número:" : "Cuenta:"} {metodoSeleccionado.numero}
                      </p>
                    )}
                  </div>

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

                  <div className="flex gap-2">
                    <Button
                      onClick={() => volverAPaso("seleccion")}
                      variant="outline"
                      className="flex-1 border-cyan-400/30 text-white hover:bg-cyan-400/10"
                    >
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      Volver
                    </Button>
                    <Button
                      onClick={continuarATransferencia}
                      disabled={!nombreCliente || !numeroCliente}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold"
                    >
                      {metodoSeleccionado.tipo === "efectivo"
                        ? "Confirmar"
                        : metodoSeleccionado.tipo === "pse"
                          ? "Solicitar PSE"
                          : "Continuar"}
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </>
              )}

              {/* PASO 3: Datos de transferencia (solo para Nequi y Bancolombia) */}
              {pasoActual === "transferencia" && metodoSeleccionado && (
                <>
                  <div className="bg-green-900/30 border border-green-600/30 rounded p-3">
                    <p className="text-green-200 text-sm mb-2">
                      <strong>Instrucciones:</strong>
                    </p>
                    <p className="text-green-100 text-sm mb-3">
                      {metodoSeleccionado.tipo === "nequi"
                        ? `Envía $${servicioSeleccionado.precio.toLocaleString()} al número ${
                            metodoSeleccionado.numero
                          } por Nequi y luego completa los datos de la transferencia.`
                        : `Transfiere $${servicioSeleccionado.precio.toLocaleString()} a la cuenta ${
                            metodoSeleccionado.numero
                          } de Bancolombia y luego completa los datos.`}
                    </p>

                    {metodoSeleccionado.enlaceDirecto && (
                      <Button
                        onClick={abrirEnlaceDirecto}
                        size="sm"
                        className={`w-full text-white font-bold ${
                          metodoSeleccionado.tipo === "nequi"
                            ? "bg-purple-600 hover:bg-purple-700"
                            : "bg-yellow-600 hover:bg-yellow-700"
                        }`}
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Abrir {metodoSeleccionado.nombre}
                      </Button>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-white text-sm font-medium mb-2 block">
                        Número de transferencia / Referencia:
                      </label>
                      <Input
                        value={numeroTransferencia}
                        onChange={(e) => setNumeroTransferencia(e.target.value)}
                        placeholder="Ej: 123456789"
                        className="bg-gray-800 border-cyan-400/30 text-white"
                      />
                    </div>

                    <div>
                      <label className="text-white text-sm font-medium mb-2 block">Monto enviado:</label>
                      <Input
                        value={montoTransferencia}
                        onChange={(e) => setMontoTransferencia(e.target.value.replace(/\D/g, ""))}
                        placeholder={servicioSeleccionado.precio.toString()}
                        className="bg-gray-800 border-cyan-400/30 text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-white text-sm font-medium mb-2 block">Fecha:</label>
                        <Input
                          type="date"
                          value={fechaTransferencia}
                          onChange={(e) => setFechaTransferencia(e.target.value)}
                          className="bg-gray-800 border-cyan-400/30 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-white text-sm font-medium mb-2 block">Hora:</label>
                        <Input
                          type="time"
                          value={horaTransferencia}
                          onChange={(e) => setHoraTransferencia(e.target.value)}
                          className="bg-gray-800 border-cyan-400/30 text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => volverAPaso("datos")}
                      variant="outline"
                      className="flex-1 border-cyan-400/30 text-white hover:bg-cyan-400/10"
                    >
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      Volver
                    </Button>
                    <Button
                      onClick={confirmarPago}
                      disabled={
                        !numeroTransferencia || !montoTransferencia || !fechaTransferencia || !horaTransferencia
                      }
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold"
                    >
                      <CreditCard className="h-4 w-4 mr-1" />
                      Confirmar Pago
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
