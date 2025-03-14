//@ts-nocheck
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// src/features/billing/components/transactionsummary.tsx
interface TransactionSummaryProps {
  cart: any[]
  total: number
  subTotal: number
  totalGST: number
  discountPercentage: number
}

export function TransactionSummary({
  cart,
  total,
  subTotal,
  totalGST,
  discountPercentage,
}: TransactionSummaryProps) {
  const calculateItemGST = (item: any) => {
    const itemPrice = item.price
    const itemQuantity = item.quantity
    const baseAmount = itemPrice * itemQuantity

    return {
      sgst: (baseAmount * (item.sgst || 0)) / 100,
      cgst: (baseAmount * (item.cgst || 0)) / 100,
    }
  }

  const totalSGST = cart.reduce((total, item) => {
    return total + calculateItemGST(item).sgst
  }, 0)

  const totalCGST = cart.reduce((total, item) => {
    return total + calculateItemGST(item).cgst
  }, 0)

  const discountAmount = (subTotal * discountPercentage) / 100

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction Summary</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='flex justify-between'>
          <span>Sub Total</span>
          <span>₹{subTotal.toFixed(2)}</span>
        </div>
        <div className='flex justify-between'>
          <span>SGST</span>
          <span>₹{totalSGST.toFixed(2)}</span>
        </div>
        <div className='flex justify-between'>
          <span>CGST</span>
          <span>₹{totalCGST.toFixed(2)}</span>
        </div>
        {discountPercentage > 0 && (
          <div className='flex justify-between text-red-500'>
            <span>Discount ({discountPercentage}%)</span>
            <span>-₹{discountAmount.toFixed(2)}</span>
          </div>
        )}
        <div className='flex justify-between font-bold'>
          <span>Grand Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
