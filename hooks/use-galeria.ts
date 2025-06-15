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
      // Fotos reales de ejemplo con los cortes de Caracas
      const fotosEjemplo: FotoCorte[] = [
        {
          id: "1",
          url: "/cortes-ejemplo.png",
          titulo: "Taper Fade con Diseño",
          descripcion: "Desvanecimiento clásico con diseño personalizado en la nuca. Estilo moderno y limpio.",
          fecha: new Date().toLocaleDateString(),
        },
        {
          id: "2",
          url: "/cortes-ejemplo.png",
          titulo: "Corte con Líneas Laterales",
          descripcion: "Fade con diseños geométricos en los laterales. Perfecto para un look urbano y fresco.",
          fecha: new Date().toLocaleDateString(),
        },
        {
          id: "3",
          url: "/cortes-ejemplo.png",
          titulo: "Classic Fade Premium",
          descripcion: "Desvanecimiento profesional y elegante. El corte perfecto para cualquier ocasión.",
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
