"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, Trash2, Plus, Edit, ImageIcon } from "lucide-react"
import type { Turno, Servicio, Configuracion } from "@/types"

interface PanelAdminExpandidoProps {
  turnos: Turno[]
  configuracion: Configuracion
  onEliminarTurno: (index: number) => void
  onActualizarNumeroNequi: (numero: string) => void
  onActualizarServicio: (servicio: Servicio) => void
  onAgregarFotoCorte: (url: string, descripcion?: string) => void
  onEliminarFotoCorte: (id: string) => void
}

export default function PanelAdminExpandido({
  turnos,
  configuracion,
  onEliminarTurno,
  onActualizarNumeroNequi,
  onActualizarServicio,
  onAgregarFotoCorte,
  onEliminarFotoCorte,
}: PanelAdminExpandidoProps) {
  const [clave, setClave] = useState("")
  const [autenticado, setAutenticado] = useState(false)
  const [numeroNequi, setNumeroNequi] = useState(configuracion.numeroNequi)
  const [servicioEditando, setServicioEditando] = useState<Servicio | null>(null)
  const [nuevaFoto, setNuevaFoto] = useState("")
  const [descripcionFoto, setDescripcionFoto] = useState("")

  const verificarClave = () => {
    if (clave === "caracas123") {
      setAutenticado(true)
    } else {
      alert("Contraseña incorrecta")
    }
  }

  const eliminarTurno = (index: number) => {
    const turno = turnos[index]
    onEliminarTurno(index)

    const mensaje = "Tu turno fue cancelado. Lo sentimos."
    window.open(`https://wa.me/${turno.numero}?text=${encodeURIComponent(mensaje)}`, "_blank")

    alert("Turno eliminado")
  }

  const guardarNumeroNequi = () => {
    onActualizarNumeroNequi(numeroNequi)
    alert("Número Nequi actualizado")
  }

  const guardarServicio = () => {
    if (!servicioEditando) return
    onActualizarServicio(servicioEditando)
    setServicioEditando(null)
    alert("Servicio actualizado")
  }

  const agregarFoto = () => {
    if (!nuevaFoto) return
    onAgregarFotoCorte(nuevaFoto, descripcionFoto)
    setNuevaFoto("")
    setDescripcionFoto("")
    alert("Foto agregada")
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed top-4 right-4 bg-black/50 border-white/20 text-white hover:bg-white/20"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-black/90 text-white border-white/20 w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-white">Panel Privado (Caracas)</SheetTitle>
        </SheetHeader>

        {!autenticado ? (
          <div className="space-y-4 mt-6">
            <Input
              type="password"
              placeholder="Contraseña"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
            <Button onClick={verificarClave} className="w-full">
              Acceder al Panel
            </Button>
          </div>
        ) : (
          <div className="mt-6">
            <Tabs defaultValue="turnos" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-white/10">
                <TabsTrigger value="turnos" className="text-xs">
                  Turnos
                </TabsTrigger>
                <TabsTrigger value="precios" className="text-xs">
                  Precios
                </TabsTrigger>
                <TabsTrigger value="nequi" className="text-xs">
                  Nequi
                </TabsTrigger>
                <TabsTrigger value="fotos" className="text-xs">
                  Fotos
                </TabsTrigger>
              </TabsList>

              <TabsContent value="turnos" className="space-y-4">
                <h3 className="text-lg font-semibold">Turnos Agendados</h3>
                {turnos.length === 0 ? (
                  <p className="text-white/70">No hay turnos agendados</p>
                ) : (
                  <div className="space-y-2">
                    {turnos.map((turno, index) => (
                      <Card key={index} className="bg-white/10 border-white/20">
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-semibold">{turno.hora}</div>
                              <div className="text-sm text-white/70">{turno.nombre}</div>
                              <div className="text-xs text-white/50">{turno.numero}</div>
                              {turno.pagado && (
                                <div className="text-xs text-green-400">Pagado ({turno.metodoPago})</div>
                              )}
                            </div>
                            <Button variant="destructive" size="sm" onClick={() => eliminarTurno(index)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="precios" className="space-y-4">
                <h3 className="text-lg font-semibold">Gestionar Precios</h3>
                <div className="space-y-2">
                  {configuracion.servicios.map((servicio) => (
                    <Card key={servicio.id} className="bg-white/10 border-white/20">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold">{servicio.nombre}</div>
                            <div className="text-green-400">${servicio.precio.toLocaleString()}</div>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => setServicioEditando(servicio)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {servicioEditando && (
                  <Card className="bg-white/10 border-white/20">
                    <CardHeader>
                      <CardTitle className="text-white">Editar Servicio</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Nombre del servicio</Label>
                        <Input
                          value={servicioEditando.nombre}
                          onChange={(e) => setServicioEditando({ ...servicioEditando, nombre: e.target.value })}
                          className="bg-white/10 border-white/20 text-white"
                        />
                      </div>
                      <div>
                        <Label>Precio</Label>
                        <Input
                          type="number"
                          value={servicioEditando.precio}
                          onChange={(e) => setServicioEditando({ ...servicioEditando, precio: Number(e.target.value) })}
                          className="bg-white/10 border-white/20 text-white"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={guardarServicio} className="flex-1">
                          Guardar
                        </Button>
                        <Button variant="outline" onClick={() => setServicioEditando(null)} className="flex-1">
                          Cancelar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="nequi" className="space-y-4">
                <h3 className="text-lg font-semibold">Configurar Nequi</h3>
                <Card className="bg-white/10 border-white/20">
                  <CardContent className="p-4 space-y-4">
                    <div>
                      <Label>Número de Nequi</Label>
                      <Input
                        value={numeroNequi}
                        onChange={(e) => setNumeroNequi(e.target.value)}
                        placeholder="Ej: 3167530191"
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    <Button onClick={guardarNumeroNequi} className="w-full">
                      Actualizar Número
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="fotos" className="space-y-4">
                <h3 className="text-lg font-semibold">Gestionar Fotos</h3>

                <Card className="bg-white/10 border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Agregar Nueva Foto
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>URL de la imagen</Label>
                      <Input
                        value={nuevaFoto}
                        onChange={(e) => setNuevaFoto(e.target.value)}
                        placeholder="https://ejemplo.com/imagen.jpg"
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    <div>
                      <Label>Descripción (opcional)</Label>
                      <Input
                        value={descripcionFoto}
                        onChange={(e) => setDescripcionFoto(e.target.value)}
                        placeholder="Ej: Corte fade moderno"
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    {nuevaFoto && (
                      <div className="flex justify-center">
                        <img
                          src={nuevaFoto || "/placeholder.svg"}
                          alt="Vista previa"
                          className="w-24 h-24 object-cover rounded"
                          onError={(e) => {
                            e.currentTarget.style.display = "none"
                          }}
                        />
                      </div>
                    )}
                    <Button onClick={agregarFoto} className="w-full">
                      <ImageIcon className="mr-2 h-4 w-4" />
                      Agregar Foto
                    </Button>
                  </CardContent>
                </Card>

                <div className="space-y-2">
                  <h4 className="font-semibold">Fotos Actuales ({configuracion.fotosCortes.length})</h4>
                  {configuracion.fotosCortes.map((foto) => (
                    <Card key={foto.id} className="bg-white/10 border-white/20">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <img
                              src={foto.url || "/placeholder.svg"}
                              alt={foto.descripcion || "Corte"}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div>
                              <div className="text-sm font-medium">{foto.descripcion || "Sin descripción"}</div>
                              <div className="text-xs text-white/50">
                                {new Date(foto.fechaSubida).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <Button variant="destructive" size="sm" onClick={() => onEliminarFotoCorte(foto.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
