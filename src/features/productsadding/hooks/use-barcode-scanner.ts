// hooks/use-barcode-scanner.ts
import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'

type BarcodeFormat = 'EAN-13' | 'UPC-A' | 'CODE128' | 'CODE39' | 'QR' | 'ANY'

interface UseBarcodeScanner {
  onScan: (barcode: string) => void
  options?: {
    resetTimeout?: number
    showToast?: boolean
    allowedKeys?: RegExp
    minLength?: number
    maxLength?: number
    format?: BarcodeFormat
  }
}

interface BarcodeHookResult {
  barcodeBuffer: string
  isScanning: boolean
  startScanning: () => void
  stopScanning: () => void
  resetBuffer: () => void
}

const barcodePatterns = {
  'EAN-13': /^\d{13}$/,
  'UPC-A': /^\d{12}$/,
  CODE128: /^[A-Za-z0-9\-_.\/\\+=%]{1,48}$/,
  CODE39: /^[A-Z0-9\-. $/+%]{1,48}$/,
  QR: /^[A-Za-z0-9\-_.\/\\+=%]{1,2048}$/,
  ANY: /^[A-Za-z0-9\-_.\/\\+=%]{1,2048}$/,
}

export const useBarcodeScanner = ({
  onScan,
  options = {},
}: UseBarcodeScanner): BarcodeHookResult => {
  const {
    resetTimeout = 30, // Reduced from 100 to 30 for faster response
    showToast = true,
    allowedKeys = /^[A-Za-z0-9\-_.\/\\+=%]*$/,
    minLength = 4,
    maxLength = 48,
    format = 'ANY',
  } = options

  const [barcodeBuffer, setBarcodeBuffer] = useState<string>('')
  const [lastKeyTime, setLastKeyTime] = useState<number>(0)
  const [isScanning, setIsScanning] = useState(true)

  const resetBuffer = useCallback(() => {
    setBarcodeBuffer('')
  }, [])

  const startScanning = useCallback(() => {
    setIsScanning(true)
    resetBuffer()
  }, [resetBuffer])

  const stopScanning = useCallback(() => {
    // setIsScanning(false)
    resetBuffer()
  }, [resetBuffer])

  const validateBarcode = useCallback(
    (barcode: string) => {
      if (barcode.length < minLength || barcode.length > maxLength) {
        return false
      }

      const pattern = barcodePatterns[format]
      if (!pattern.test(barcode)) {
        return false
      }

      // Removed specific EAN-13 and UPC-A checks for simplicity
      return true
    },
    [format, minLength, maxLength]
  )

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (!isScanning) return

      const currentTime = new Date().getTime()

      if (currentTime - lastKeyTime > resetTimeout) {
        resetBuffer()
      }

      if (allowedKeys.test(event.key) || event.key === 'Enter') {
        if (event.key === 'Enter') {
          if (barcodeBuffer && validateBarcode(barcodeBuffer)) {
            console.log('Valid barcode scanned:', barcodeBuffer) // Added logging
            onScan(barcodeBuffer)
            if (showToast) {
              toast.success(`Barcode scanned successfully: ${barcodeBuffer}`)
            }
            resetBuffer()
          } else if (barcodeBuffer) {
            console.log('Invalid barcode:', barcodeBuffer) // Added logging
            if (showToast) {
              toast.error(`Invalid barcode format: ${barcodeBuffer}`)
            }
            resetBuffer()
          }
        } else if (event.key.length === 1) {
          setBarcodeBuffer((prev) => {
            const newBuffer = prev + event.key
            console.log('Current buffer:', newBuffer) // Added logging
            return newBuffer
          })
        }
      }

      setLastKeyTime(currentTime)
    },
    [
      barcodeBuffer,
      lastKeyTime,
      resetTimeout,
      allowedKeys,
      showToast,
      isScanning,
      onScan,
      resetBuffer,
      validateBarcode,
    ]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [handleKeyPress])

  useEffect(() => {
    return () => {
      stopScanning()
    }
  }, [stopScanning])

  return {
    barcodeBuffer,
    isScanning,
    startScanning,
    stopScanning,
    resetBuffer,
  }
}
