import { Card, CardContent } from "@/components/ui/card"

interface PaymentInfoProps {
  timestamp: string
  method: string
  amount: number
  notes: string
}

export function PaymentInfo({ timestamp, method, amount, notes }: PaymentInfoProps) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between text-sm">
          <div>{timestamp}</div>
          <div className="font-medium">{method}</div>
          <div className="font-medium">₹{amount.toFixed(2)}</div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div>Total Paid</div>
          <div className="font-medium">₹{amount.toFixed(2)}</div>
        </div>
        <div className="text-sm">
          <div className="font-medium mb-1 text-[#33A9FF]">Notes</div>
          <div className="text-muted-foreground">{notes}</div>
        </div>
      </CardContent>
    </Card>
  )
}
