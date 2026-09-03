/* Redimensiona/comprime imagens no navegador antes de guardar como data URL.
   Sem backend, isso é essencial para não estourar a cota do localStorage. */

interface ResizeOptions {
  maxDim?: number
  quality?: number
  mimeType?: 'image/jpeg' | 'image/webp'
}

export async function fileToCompressedDataUrl(
  file: File,
  { maxDim = 1600, quality = 0.82, mimeType = 'image/jpeg' }: ResizeOptions = {},
): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Arquivo não é uma imagem.')
  }

  const bitmap = await loadBitmap(file)
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height))
  const width = Math.round(bitmap.width * scale)
  const height = Math.round(bitmap.height * scale)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas indisponível.')
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, width, height)
  ctx.drawImage(bitmap, 0, 0, width, height)

  if ('close' in bitmap && typeof bitmap.close === 'function') bitmap.close()

  return canvas.toDataURL(mimeType, quality)
}

async function loadBitmap(file: File): Promise<ImageBitmap | HTMLImageElement> {
  if ('createImageBitmap' in window) {
    try {
      return await createImageBitmap(file)
    } catch {
      /* fallback abaixo */
    }
  }
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Não foi possível ler a imagem.'))
    }
    img.src = url
  })
}

export function approxDataUrlKB(dataUrl: string): number {
  const commaIndex = dataUrl.indexOf(',')
  const base64 = commaIndex >= 0 ? dataUrl.slice(commaIndex + 1) : dataUrl
  return Math.round((base64.length * 3) / 4 / 1024)
}

/** Estima o total ocupado no localStorage (em MB). */
export function localStorageUsageMB(): number {
  let total = 0
  try {
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i)
      if (!key) continue
      total += key.length + (localStorage.getItem(key)?.length ?? 0)
    }
  } catch {
    return 0
  }
  return +(total / (1024 * 1024)).toFixed(2)
}
