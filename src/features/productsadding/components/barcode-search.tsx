import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Search } from 'lucide-react'

interface BarcodeSearchProps {
  onBarcodeDetected: (barcode: string) => void
  isLoading: boolean
}

export default function BarcodeSearch({ onBarcodeDetected, isLoading }: BarcodeSearchProps) {
  const [barcodeInput, setBarcodeInput] = useState('')

  const handleSearch = () => {
    if (barcodeInput.trim()) {
      onBarcodeDetected(barcodeInput.trim())
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="flex space-x-2 mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
        {isLoading && (
          <Loader2 className="h-4 w-4 animate-spin text-primary absolute left-3 top-1/2 -translate-y-1/2" />
        )}
        <Input
          type="text"
          placeholder="Enter barcode manually"
          value={barcodeInput}
          onChange={(e) => setBarcodeInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pl-10"
        />
      </div>
      <Button 
        onClick={handleSearch}
        disabled={isLoading || !barcodeInput.trim()}
      >
        Search
      </Button>
    </div>
  )
}
