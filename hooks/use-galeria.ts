"use client"

import { useState, useEffect } from "react"
import type { FotoCorte } from "@/types"

export function useGaleria() {
  const [fotos, setFotos] = useState<FotoCorte[]>([])

  useEffect(() => {
    const fotosGuardadas = localStorage.getItem("galeria-fotos")
    if (fotosGuardadas) {
      setFotos(JSON.parse(fotosGuardadas))
    } else {
      // Fotos de ejemplo para mostrar el diseño
      const fotosEjemplo: FotoCorte[] = [
        {
          id: "1",
          url: "/placeholder.svg?height=300&width=300",
          titulo: "Corte Moderno",
          descripcion: "Fade con diseño lateral",
          fecha: new Date().toLocaleDateString(),
        },
        {
          id: "2",
          url: "/placeholder.svg?height=300&width=300",
          titulo: "Corte Clásico",
          descripcion: "Estilo tradicional con barba",
          fecha: new Date().toLocaleDateString(),
        },
        {
          id: "3",
          url: "/placeholder.svg?height=300&width=300",
          titulo: "Diseño Creativo",
          descripcion: "Corte con líneas artísticas",
          fecha: new Date().toLocaleDateString(),
        },
      ]
      setFotos(fotosEjemplo)
      localStorage.setItem("galeria-fotos", JSON.stringify(fotosEjemplo))
    }
  }, [])

  const guardarFotos = (nuevasFotos: FotoCorte[]) => {
    setFotos(nuevasFotos)
    localStorage.setItem("galeria-fotos", JSON.stringify(nuevasFotos))
  }

  const agregarFoto = (foto: Omit<FotoCorte, "id" | "fecha">) => {
    const nuevaFoto: FotoCorte = {
      ...foto,
      id: Date.now().toString(),
      fecha: new Date().toLocaleDateString(),
    }
    const nuevasFotos = [nuevaFoto, ...fotos]
    guardarFotos(nuevasFotos)
  }

  const eliminarFoto = (id: string) => {
    const nuevasFotos = fotos.filter((foto) => foto.id !== id)
    guardarFotos(nuevasFotos)
  }

  // Función para convertir archivo a base64
  const convertirArchivoABase64 = (archivo: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(archivo)
    })
  }

  return {
    fotos,
    agregarFoto,
    eliminarFoto,
    convertirArchivoABase64,
  }
}
