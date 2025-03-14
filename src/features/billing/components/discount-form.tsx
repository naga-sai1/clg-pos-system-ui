import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface DiscountFormProps {
  onDiscountChange: (discountPercentage: number) => void
}

export function DiscountForm({ onDiscountChange }: DiscountFormProps) {
  const [discountPercentage, setDiscountPercentage] = useState(0)

  const handleDiscountChange = (value: string) => {
    const discount = Math.min(Math.max(parseFloat(value) || 0, 0), 100)
    setDiscountPercentage(discount)
    onDiscountChange(discount)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Discount</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="discount">Discount Percentage (%)</Label>
          <Input
            id="discount"
            type="number"
            min="0"
            max="100"
            step="0.1"
            placeholder="Enter discount percentage"
            value={discountPercentage || ''}
            onChange={(e) => handleDiscountChange(e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  )
}
