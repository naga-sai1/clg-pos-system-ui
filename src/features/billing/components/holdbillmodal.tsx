import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { holdBill } from '@/store/slices/billingSlice'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface HoldBillModalProps {
  isOpen: boolean
  onClose: () => void
  total: number
}

export function HoldBillModal({ isOpen, onClose, total }: HoldBillModalProps) {
  const [referenceNumber, setReferenceNumber] = useState('')
  const dispatch = useDispatch()

  const handleConfirm = () => {
    if (!referenceNumber.trim()) {
      toast.error('Please enter a reference number')
      return
    }

    dispatch(holdBill({ referenceNumber: referenceNumber.trim() }))
    toast.success('Bill held successfully')
    setReferenceNumber('')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hold Order</DialogTitle>
          <DialogDescription>
            The current order will be set on hold. You can retrieve this order from
            the held bills list. Providing a reference will help you identify the
            order more quickly.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="text-center">
            <div className="text-4xl font-semibold">
              ₹{total.toFixed(2)}
            </div>
          </div>

          <div className="space-y-2">
            <Input
              placeholder="Order Reference"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
