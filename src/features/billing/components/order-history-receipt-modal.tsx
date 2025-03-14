import { useRef, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { OrderHistoryReceipt } from './order-history-receipt'
import { OrderHistoryReceiptA4 } from './order-history-receipt-a4'

interface OrderHistoryReceiptModalProps {
  isOpen: boolean
  onClose: () => void
  order: any
}

export function OrderHistoryReceiptModal({
  isOpen,
  onClose,
  order,
}: OrderHistoryReceiptModalProps) {
  const [isPrinting, setIsPrinting] = useState(false)
  const [format, setFormat] = useState<'thermal' | 'a4'>('a4')
  const printRef = useRef<HTMLDivElement>(null)

  const handlePrint = async () => {
    if (!printRef.current) return

    try {
      setIsPrinting(true)

      // Create a new window for printing
      const printWindow = window.open('', '', 'width=800,height=600')
      if (!printWindow) {
        throw new Error('Could not open print window')
      }

      // Add necessary styles
      printWindow.document.write(`
        <html>
          <head>
            <style>
              @page {
                size: ${format === 'thermal' ? '80mm' : 'A4'} auto;
                margin: 0;
              }
              body {
                margin: 0;
                -webkit-print-color-adjust: exact;
              }
            </style>
          </head>
          <body>
            ${printRef.current.outerHTML}
          </body>
        </html>
      `)

      // Wait for images to load
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Print and close
      printWindow.document.close()
      printWindow.focus()
      printWindow.print()
      printWindow.close()

      toast.success('Receipt printed successfully')
    } catch (error) {
      console.error('Printing failed:', error)
      toast.error('Failed to print receipt')
    } finally {
      setIsPrinting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-[1400px] max-h-[95vh] flex flex-col p-0'>
        <DialogHeader className='px-6 py-4 border-b'>
          <DialogTitle>Receipt Preview - Order #{order?.order_id}</DialogTitle>
        </DialogHeader>

        <div className='flex items-center justify-center gap-4 py-4 border-b'>
          <Button
            variant={format === 'thermal' ? 'default' : 'outline'}
            onClick={() => setFormat('thermal')}
          >
            Thermal Receipt
          </Button>
          <Button
            variant={format === 'a4' ? 'default' : 'outline'}
            onClick={() => setFormat('a4')}
          >
            A4 Invoice
          </Button>
        </div>

        <div className='flex-1 overflow-y-auto p-6'>
          <div className='flex justify-center'>
            {format === 'thermal' ? (
              <div className='transform scale-[0.85] origin-top'>
                <OrderHistoryReceipt ref={printRef} order={order} />
              </div>
            ) : (
              <div className='transform scale-[0.85] origin-top'>
                <OrderHistoryReceiptA4 ref={printRef} order={order} />
              </div>
            )}
          </div>
        </div>

        <DialogFooter className='px-6 py-4 border-t'>
          <Button variant='outline' onClick={onClose}>
            Close
          </Button>
          <Button onClick={handlePrint} disabled={isPrinting}>
            {isPrinting ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Printing...
              </>
            ) : (
              'Print'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
