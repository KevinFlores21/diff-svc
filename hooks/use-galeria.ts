"use client"

import { useState, useEffect } from "react"
import type { FotoCorte } from "@/types"

export function useGaleria() {
  const [fotos, setFotos] = useState<FotoCorte[]>([])

  useEffect(() => {
    cargarFotosGuardadas()
  }, [])

  const cargarFotosGuardadas = () => {
    try {
      // Cargar fotos desde localStorage
      const fotosGuardadas = localStorage.getItem("galeria-fotos-permanentes")
      if (fotosGuardadas) {
        const fotosParsed = JSON.parse(fotosGuardadas)
        setFotos(fotosParsed)
      } else {
        // Fotos iniciales de ejemplo
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
        guardarFotosPermanentes(fotosEjemplo)
      }
    } catch (error) {
      console.error("Error al cargar fotos:", error)
    }
  }

  const guardarFotosPermanentes = (nuevasFotos: FotoCorte[]) => {
    try {
      setFotos(nuevasFotos)
      localStorage.setItem("galeria-fotos-permanentes", JSON.stringify(nuevasFotos))

      // También guardar en IndexedDB para mayor persistencia
      if (typeof window !== "undefined" && "indexedDB" in window) {
        guardarEnIndexedDB(nuevasFotos)
      }
    } catch (error) {
      console.error("Error al guardar fotos:", error)
    }
  }

  const guardarEnIndexedDB = async (fotos: FotoCorte[]) => {
    try {
      const request = indexedDB.open("CaracasAlconBarberDB", 1)

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains("fotos")) {
          db.createObjectStore("fotos", { keyPath: "id" })
        }
      }

      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        const transaction = db.transaction(["fotos"], "readwrite")
        const store = transaction.objectStore("fotos")

        // Limpiar y guardar todas las fotos
        store.clear()
        fotos.forEach((foto) => store.add(foto))
      }
    } catch (error) {
      console.error("Error al guardar en IndexedDB:", error)
    }
  }

  const agregarFoto = (foto: Omit<FotoCorte, "id" | "fecha">) => {
    const nuevaFoto: FotoCorte = {
      ...foto,
      id: `foto-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      fecha: new Date().toLocaleDateString(),
      tipo: "adicional",
    }
    const nuevasFotos = [...fotos, nuevaFoto]
    guardarFotosPermanentes(nuevasFotos)
  }

  const reemplazarFoto = (fotoId: string, nuevaFoto: Omit<FotoCorte, "id" | "fecha">) => {
    const fotoExistente = fotos.find((f) => f.id === fotoId)
    if (!fotoExistente) return

    const fotoActualizada: FotoCorte = {
      ...nuevaFoto,
      id: fotoId,
      fecha: new Date().toLocaleDateString(),
      tipo: fotoExistente.tipo,
      posicion: fotoExistente.posicion,
    }

    const nuevasFotos = fotos.map((foto) => (foto.id === fotoId ? fotoActualizada : foto))
    guardarFotosPermanentes(nuevasFotos)
  }

  const eliminarFoto = (id: string) => {
    // No permitir eliminar fotos destacadas, solo reemplazar
    const foto = fotos.find((f) => f.id === id)
    if (foto?.tipo === "destacada") {
      alert("No puedes eliminar fotos destacadas. Puedes reemplazarlas desde el panel de administración.")
      return
    }

    const nuevasFotos = fotos.filter((foto) => foto.id !== id)
    guardarFotosPermanentes(nuevasFotos)
  }

  const convertirArchivoABase64 = (archivo: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(archivo)
    })
  }

  const crearRespaldo = () => {
    const respaldo = {
      fecha: new Date().toISOString(),
      fotos: fotos,
      version: "2.0",
      tipo: "galeria-completa",
    }

    const dataStr = JSON.stringify(respaldo, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })

    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `galeria-respaldo-completo-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    return respaldo
  }

  const restaurarRespaldo = (archivo: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const respaldo = JSON.parse(e.target?.result as string)
          if (respaldo.fotos && Array.isArray(respaldo.fotos)) {
            guardarFotosPermanentes(respaldo.fotos)
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

  const exportarComoHTML = () => {
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
        .destacada { border: 2px solid #ffd700; }
    </style>
</head>
<body>
    <div class="container">
        <h1>💈 Galería Caracas Alcon Barber</h1>
        <div class="gallery">
            ${fotos
              .map(
                (foto) => `
                <div class="photo ${foto.tipo === "destacada" ? "destacada" : ""}">
                    <img src="${foto.url}" alt="${foto.titulo}">
                    <div class="photo-info">
                        <div class="photo-title">${foto.titulo} ${foto.tipo === "destacada" ? "⭐" : ""}</div>
                        <div class="photo-desc">${foto.descripcion}</div>
                        <div class="photo-date">📅 ${foto.fecha}</div>
                    </div>
                </div>
            `,
              )
              .join("")}
        </div>
        <div class="footer">
            <p>Galería generada el ${new Date().toLocaleDateString()}</p>
            <p>💈 Caracas Alcon Barber - Calidad, Estilo y Flow</p>
            <p>Total de fotos: ${fotos.length} | Fotos destacadas: ${fotos.filter((f) => f.tipo === "destacada").length}</p>
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
    convertirArchivoABase64,
    crearRespaldo,
    restaurarRespaldo,
    exportarComoHTML,
  }
}
