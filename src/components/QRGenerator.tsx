'use client'

import { useRef, useCallback } from 'react'
import QRCode from 'react-qr-code'

interface QRGeneratorProps {
  url: string
  restaurantName: string
  primaryColor: string
}

export function QRGenerator({ url, restaurantName, primaryColor }: QRGeneratorProps) {
  const qrRef = useRef<HTMLDivElement>(null)

  const downloadQR = useCallback(() => {
    if (!qrRef.current) return

    const svg = qrRef.current.querySelector('svg')
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      canvas.width = 400
      canvas.height = 400
      if (ctx) {
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 50, 50, 300, 300)
      }
      const pngUrl = canvas.toDataURL('image/png')
      const downloadLink = document.createElement('a')
      downloadLink.href = pngUrl
      downloadLink.download = `qr-${restaurantName.toLowerCase().replace(/\s+/g, '-')}.png`
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
    }

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }, [restaurantName])

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <div
        ref={qrRef}
        className="rounded-lg bg-white p-4 shadow-md"
      >
        <QRCode
          value={url}
          size={256}
          fgColor={primaryColor}
          bgColor="#FFFFFF"
          level="H"
        />
      </div>

      <p className="text-center text-sm text-gray-600 break-all max-w-[280px]">
        {url}
      </p>

      <button
        onClick={downloadQR}
        className="w-full max-w-[280px] min-h-[44px] rounded-lg px-6 py-3 font-medium text-white transition-colors"
        style={{ backgroundColor: primaryColor }}
      >
        Descargar PNG
      </button>
    </div>
  )
}
