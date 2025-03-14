import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'

interface PaymentMethod {
  id: string
  name: string
  icon: string
  color: string
}

const paymentMethods: PaymentMethod[] = [
  { id: 'cash', name: 'Cash', icon: '₹', color: 'bg-green-500' },
  { id: 'upi', name: 'UPI', icon: 'U', color: 'bg-blue-500' },
  { id: 'card', name: 'Card', icon: 'C', color: 'bg-red-500' },
]

interface PaymentMethodsProps {
  selectedMethod: string
  onSelect: (method: string) => void
}

export function PaymentMethods({
  selectedMethod,
  onSelect,
}: PaymentMethodsProps) {
  return (
    <div className='space-y-4'>
      <div className='text-lg font-medium'>Payment Methods</div>
      <div className='grid grid-cols-3 gap-2'>
        {paymentMethods.map((method) => (
          <motion.div
            key={method.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className={cn(
                'p-3 flex items-center gap-2 cursor-pointer hover:bg-muted/50 transition-colors',
                selectedMethod === method.id && 'ring-2 ring-[#33A9FF]'
              )}
              onClick={() => onSelect(method.id)}
            >
              <div
                className={cn(
                  'w-8 h-8 rounded flex items-center justify-center text-white text-sm',
                  method.color
                )}
              >
                {method.icon}
              </div>
              <span className='text-sm'>{method.name}</span>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
