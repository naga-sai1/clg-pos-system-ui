import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

interface QuantityEditModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  quantity: string
  onQuantityChange: (value: string) => void
  onNumpadPress: (key: string) => void
}

export function QuantityEditModal({
  isOpen,
  onClose,
  onConfirm,
  quantity,
  onQuantityChange,
  onNumpadPress,
}: QuantityEditModalProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow special keys like Backspace, Delete, Enter, and Escape
    if (e.key === 'Backspace' || e.key === 'Delete' || e.key === 'Enter' || e.key === 'Escape') {
      if (e.key === 'Enter') {
        e.preventDefault()
        onConfirm()
      } else if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        // Allow default behavior for Backspace and Delete
        onQuantityChange(quantity.slice(0, -1))
      }
      return
    }

    // Block any non-numeric input
    if (!/^\d$/.test(e.key)) {
      e.preventDefault()
      return
    }

    // Prevent input if it would make the number too large
    if (quantity.length >= 5) {
      e.preventDefault()
      return
    }

    // Allow the numeric input
    onQuantityChange(quantity + e.key)
    e.preventDefault()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '') // Only allow digits
    if (value.length <= 5) { // Limit to 5 digits
      onQuantityChange(value)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Quantity</DialogTitle>
          <DialogDescription>
            Enter the new quantity for this item.
          </DialogDescription>
        </DialogHeader>
        <div className='flex flex-col items-center gap-4'>
          <Input
            type='text'
            value={quantity}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className='text-center text-2xl h-12 w-full'
            autoFocus
          />
          <div className='grid grid-cols-3 gap-10'>
            {[
              '7',
              '8',
              '9',
              '4',
              '5',
              '6',
              '1',
              '2',
              '3',
              'clear',
              '0',
              'enter',
            ].map((key) => (
              <Button
                key={key}
                onClick={() => onNumpadPress(key)}
                variant={key === 'enter' ? 'default' : 'outline'}
                className={cn(
                  'h-24 w-24 text-2xl font-medium',
                  key === 'clear' ? 'text-white bg-red-500' : ''
                )}
              >
                {key === 'clear' ? 'C' : key === 'enter' ? '✓' : key}
              </Button>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
