"use client"

import { useState, useEffect } from "react"
import type { FotoCorte } from "@/types"

export function useGaleria() {
  const [fotos, setFotos] = useState<FotoCorte[]>([])

  useEffect(() => {
    cargarFotosGuardadas()
  }, []) // Array de dependencias vacío

  const cargarFotosGuardadas = () => {
    try {
      // Cargar fotos desde localStorage
      const fotosGuardadas = localStorage.getItem("galeria-fotos-permanentes")
      if (fotosGuardadas) {
        const fotosParsed = JSON.parse(fotosGuardadas)
        setFotos(fotosParsed)
      } else {
        // Si no hay fotos guardadas, crear las fotos de ejemplo
        const fotosEjemplo: FotoCorte[] = [
          {
            id: "destacada-1",
            url: "/cortes-ejemplo.png",
            titulo: "Taper Fade con Diseño",
            descripcion: "Desvanecimiento clásico con diseño personalizado en la nuca. Estilo moderno y limpio.",
            fecha: new Date().toLocaleDateString(),
            tipo: "destacada",
            posicion: 1,
          },
          {
            id: "destacada-2",
            url: "/cortes-ejemplo.png",
            titulo: "Corte con Líneas Laterales",
            descripcion: "Fade con diseños geométricos en los laterales. Perfecto para un look urbano y fresco.",
            fecha: new Date().toLocaleDateString(),
            tipo: "destacada",
            posicion: 2,
          },
          {
            id: "destacada-3",
            url: "/cortes-ejemplo.png",
            titulo: "Classic Fade Premium",
            descripcion: "Desvanecimiento profesional y elegante. El corte perfecto para cualquier ocasión.",
            fecha: new Date().toLocaleDateString(),
            tipo: "destacada",
            posicion: 3,
          },
        ]
        setFotos(fotosEjemplo)
        guardarFotosEnStorage(fotosEjemplo)
      }
    } catch (error) {
      console.error("Error al cargar fotos:", error)
      setFotos([])
    }
  }

  const guardarFotosEnStorage = (nuevasFotos: FotoCorte[]) => {
    try {
      localStorage.setItem("galeria-fotos-permanentes", JSON.stringify(nuevasFotos))
      // También crear un respaldo automático
      const respaldoAutomatico = {
        fecha: new Date().toISOString(),
        fotos: nuevasFotos,
        version: "auto-backup",
      }
      localStorage.setItem("galeria-respaldo-automatico", JSON.stringify(respaldoAutomatico))
    } catch (error) {
      console.error("Error al guardar fotos:", error)
    }
  }

  const guardarFotos = (nuevasFotos: FotoCorte[]) => {
    setFotos(nuevasFotos)
    guardarFotosEnStorage(nuevasFotos)
  }

  const agregarFoto = (foto: Omit<FotoCorte, "id" | "fecha">) => {
    const nuevaFoto: FotoCorte = {
      ...foto,
      id: `foto-${Date.now()}`,
      fecha: new Date().toLocaleDateString(),
      tipo: foto.tipo || "adicional",
    }
    const nuevasFotos = [nuevaFoto, ...fotos]
    guardarFotos(nuevasFotos)
  }

  const reemplazarFoto = (fotoId: string, nuevaUrl: string, nuevoTitulo?: string, nuevaDescripcion?: string) => {
    const nuevasFotos = fotos.map((foto) =>
      foto.id === fotoId
        ? {
            ...foto,
            url: nuevaUrl,
            titulo: nuevoTitulo || foto.titulo,
            descripcion: nuevaDescripcion || foto.descripcion,
            fecha: new Date().toLocaleDateString(),
          }
        : foto,
    )
    guardarFotos(nuevasFotos)
  }

  const eliminarFoto = (id: string) => {
    const nuevasFotos = fotos.filter((foto) => foto.id !== id)
    guardarFotos(nuevasFotos)
  }

  const obtenerFotosDestacadas = () => {
    return fotos.filter((foto) => foto.tipo === "destacada").sort((a, b) => (a.posicion || 0) - (b.posicion || 0))
  }

  const obtenerFotosAdicionales = () => {
    return fotos.filter((foto) => foto.tipo !== "destacada")
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

  // Función para crear respaldo de todas las fotos
  const crearRespaldo = () => {
    const respaldo = {
      fecha: new Date().toISOString(),
      fotos: fotos,
      version: "1.0",
      tipo: "manual",
    }

    const dataStr = JSON.stringify(respaldo, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })

    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `galeria-respaldo-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    return respaldo
  }

  // Función para restaurar desde respaldo
  const restaurarRespaldo = (archivo: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const respaldo = JSON.parse(e.target?.result as string)
          if (respaldo.fotos && Array.isArray(respaldo.fotos)) {
            guardarFotos(respaldo.fotos)
            resolve()
          } else {
            reject(new Error("Formato de respaldo inválido"))
          }
        } catch (error) {
          reject(error)
        }
      }
      reader.onerror = reject
      reader.readAsText(archivo)
    })
  }

  // Función para exportar fotos como HTML estático
  const exportarComoHTML = () => {
    const fotosDestacadas = obtenerFotosDestacadas()
    const fotosAdicionales = obtenerFotosAdicionales()

    const html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Galería Caracas Alcon Barber</title>
    <style>
        body { font-family: Arial, sans-serif; background: #1a1a1a; color: white; margin: 0; padding: 20px; }
        .container { max-width: 1200px; margin: 0 auto; }
        h1 { text-align: center; color: #00ffff; margin-bottom: 30px; }
        .gallery { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .photo { background: #2a2a2a; border-radius: 10px; overflow: hidden; border: 1px solid #00ffff; }
        .photo img { width: 100%; height: 250px; object-fit: cover; }
        .photo-info { padding: 15px; }
        .photo-title { font-size: 18px; font-weight: bold; margin-bottom: 8px; color: #00ffff; }
        .photo-desc { font-size: 14px; color: #ccc; margin-bottom: 8px; }
        .photo-date { font-size: 12px; color: #888; }
        .footer { text-align: center; margin-top: 40px; padding: 20px; border-top: 1px solid #333; }
        .destacadas { margin-bottom: 40px; }
        .section-title { color: #00ffff; font-size: 24px; margin-bottom: 20px; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <h1>💈 Galería Caracas Alcon Barber</h1>
        
        <div class="destacadas">
            <h2 class="section-title">✨ Cortes Destacados</h2>
            <div class="gallery">
                ${fotosDestacadas
                  .map(
                    (foto) => `
                    <div class="photo">
                        <img src="${foto.url}" alt="${foto.titulo}">
                        <div class="photo-info">
                            <div class="photo-title">${foto.titulo}</div>
                            <div class="photo-desc">${foto.descripcion}</div>
                            <div class="photo-date">📅 ${foto.fecha}</div>
                        </div>
                    </div>
                `,
                  )
                  .join("")}
            </div>
        </div>

        ${
          fotosAdicionales.length > 0
            ? `
        <div>
            <h2 class="section-title">📷 Más Trabajos</h2>
            <div class="gallery">
                ${fotosAdicionales
                  .map(
                    (foto) => `
                    <div class="photo">
                        <img src="${foto.url}" alt="${foto.titulo}">
                        <div class="photo-info">
                            <div class="photo-title">${foto.titulo}</div>
                            <div class="photo-desc">${foto.descripcion}</div>
                            <div class="photo-date">📅 ${foto.fecha}</div>
                        </div>
                    </div>
                `,
                  )
                  .join("")}
            </div>
        </div>
        `
            : ""
        }
        
        <div class="footer">
            <p>Galería generada el ${new Date().toLocaleDateString()}</p>
            <p>💈 Caracas Alcon Barber - Calidad, Estilo y Flow</p>
            <p>Total de fotos: ${fotos.length}</p>
        </div>
    </div>
</body>
</html>`

    const blob = new Blob([html], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `galeria-caracas-alcon-barber-${new Date().toISOString().split("T")[0]}.html`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return {
    fotos,
    agregarFoto,
    reemplazarFoto,
    eliminarFoto,
    obtenerFotosDestacadas,
    obtenerFotosAdicionales,
    convertirArchivoABase64,
    crearRespaldo,
    restaurarRespaldo,
    exportarComoHTML,
  }
}
