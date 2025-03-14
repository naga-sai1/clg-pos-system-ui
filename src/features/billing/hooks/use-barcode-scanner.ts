import { useState, useEffect, useCallback, useRef } from 'react'
import { toast } from 'sonner'

type BarcodeFormat = 'EAN-13' | 'UPC-A' | 'EAN-8' | 'CODE128' | 'CODE39' | 'QR' | 'ANY'

interface UseBarcodeScanner {
  onScan: (barcode: string) => void
  options?: {
    resetTimeout?: number
    showToast?: boolean
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
  'EAN-8': /^\d{8}$/,
  CODE128: /^[A-Za-z0-9\-_.\/\\+=%]{1,48}$/,
  CODE39: /^[A-Z0-9\-. $/+%]{1,48}$/,
  QR: /^[A-Za-z0-9\-_.\/\\+=%]{1,2048}$/,
  ANY: /^[A-Za-z0-9\-_.\/\\+=%]{4,48}$/,
}

export const useBarcodeScanner = ({
  onScan,
  options = {},
}: UseBarcodeScanner): BarcodeHookResult => {
  const {
    resetTimeout = 300,
    showToast = true,
    minLength = 4,
    maxLength = 48,
    format = 'ANY',
  } = options

  const [barcodeBuffer, setBarcodeBuffer] = useState<string>('')
  const [lastKeyTime, setLastKeyTime] = useState<number>(0)
  const [isScanning, setIsScanning] = useState(true)
  const bufferTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const resetBuffer = useCallback(() => {
    if (bufferTimeoutRef.current) {
      clearTimeout(bufferTimeoutRef.current)
      bufferTimeoutRef.current = null
    }
    setBarcodeBuffer('')
  }, [])

  const startScanning = useCallback(() => {
    setIsScanning(true)
    resetBuffer()
  }, [resetBuffer])

  const stopScanning = useCallback(() => {
    setIsScanning(false)
    resetBuffer()
  }, [resetBuffer])

  const validateBarcode = useCallback(
    (barcode: string) => {
      if (!barcode || barcode.length < minLength || barcode.length > maxLength) {
        return false
      }

      // For numeric barcodes
      if (/^\d+$/.test(barcode)) {
        // Accept 10-digit barcodes (common format)
        if (barcode.length === 10) return true
        // Accept 13-digit EAN-13
        if (barcode.length === 13) return true
        // Accept 12-digit UPC-A
        if (barcode.length === 12) return true
        // Accept 8-digit EAN-8
        if (barcode.length === 8) return true
      }

      // For other formats, use the pattern for the specified format
      const pattern = barcodePatterns[format]
      return pattern.test(barcode)
    },
    [format, minLength, maxLength]
  )

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (!isScanning) return

      // Ignore modifier keys and function keys
      if (
        event.key === 'Shift' ||
        event.key === 'Control' ||
        event.key === 'Alt' ||
        event.key.startsWith('F')
      ) {
        return
      }

      const currentTime = new Date().getTime()

      // Clear existing timeout
      if (bufferTimeoutRef.current) {
        clearTimeout(bufferTimeoutRef.current)
      }

      // Set new timeout for buffer reset
      bufferTimeoutRef.current = setTimeout(() => {
        console.log('Buffer cleared due to inactivity')
        resetBuffer()
      }, resetTimeout)

      // Handle Enter key
      if (event.key === 'Enter') {
        console.log('Raw barcode input:', barcodeBuffer)
        
        // Use the raw barcode input directly
        let processedBarcode = barcodeBuffer.trim() // Remove any whitespace

        if (processedBarcode && validateBarcode(processedBarcode)) {
          console.log('Valid barcode detected:', processedBarcode)
          onScan(processedBarcode)
          if (showToast) {
            toast.success(`Barcode scanned: ${processedBarcode}`)
          }
        } else {
          console.log('Invalid barcode format:', processedBarcode)
          if (showToast) {
            toast.error('Invalid barcode format')
          }
        }
        resetBuffer()
        return
      }

      // Only accept valid characters for barcodes
      if (event.key.length === 1 && /[\w\d\-_.\/\\+=%]/.test(event.key)) {
        setBarcodeBuffer((prev) => {
          const newBuffer = prev + event.key
          console.log('Current buffer:', newBuffer)
          return newBuffer
        })
      }

      setLastKeyTime(currentTime)
    },
    [
      barcodeBuffer,
      isScanning,
      lastKeyTime,
      resetTimeout,
      validateBarcode,
      onScan,
      showToast,
      resetBuffer,
    ]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [handleKeyPress])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (bufferTimeoutRef.current) {
        clearTimeout(bufferTimeoutRef.current)
      }
    }
  }, [])

  return {
    barcodeBuffer,
    isScanning,
    startScanning,
    stopScanning,
    resetBuffer,
  }
}
