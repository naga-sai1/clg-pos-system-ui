import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store'
import { retrieveHeldBill } from '@/store/slices/billingSlice'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from 'sonner'

export function HeldBills() {
  const dispatch = useDispatch()
  const heldBills = useSelector((state: RootState) => state.billing.heldBills)

  const handleRetrieve = (id: string) => {
    dispatch(retrieveHeldBill(id))
    toast.success('Bill retrieved successfully')
  }

  if (heldBills.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Held Bills</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px]">
          <div className="space-y-4">
            {heldBills.map((bill) => (
              <Card key={bill.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{bill.referenceNumber}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(bill.timestamp).toLocaleString()}
                    </div>
                    <div className="mt-1 font-semibold">
                      ₹{bill.finalAmount.toFixed(2)}
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleRetrieve(bill.id)}
                  >
                    Retrieve
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
