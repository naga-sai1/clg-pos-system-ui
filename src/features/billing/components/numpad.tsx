//@ts-nocheck
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface NumpadProps {
  totalAmount: number
  onPaymentComplete: (amount: number) => void
}

export function Numpad({ totalAmount, onPaymentComplete }: NumpadProps) {
  const [display, setDisplay] = useState('0')
  const [isDecimalEntered, setIsDecimalEntered] = useState(false)

  const handleNumberPress = (num: string) => {
    setDisplay((prev) => {
      // Don't add more digits if we already have a reasonable length
      if (prev.replace('.', '').length >= 8) return prev

      if (prev === '0' && num !== '.') return num
      if (num === '.' && isDecimalEntered) return prev
      if (num === '.') {
        setIsDecimalEntered(true)
        return prev + num
      }
      // Limit to 2 decimal places
      if (isDecimalEntered) {
        const [whole, decimal] = prev.split('.')
        if (decimal && decimal.length >= 2) return prev
      }
      return prev + num
    })
  }

  const handleClear = () => {
    setDisplay('0')
    setIsDecimalEntered(false)
  }

  const calculateChange = () => {
    const paidAmount = Number.parseFloat(display)
    const change = paidAmount - totalAmount
    if (change >= 0) {
      onPaymentComplete(paidAmount)
    } else {
      toast.error('Insufficient payment amount')
    }
  }

  const formatDisplay = (value: string) => {
    const num = Number.parseFloat(value)
    if (isNaN(num)) return '0.00'
    return value.includes('.') ? value : `${value}.00`
  }

  return (
    <div className='space-y-2'>
      <div className='flex items-center bg-gray-100 p-3 rounded-md h-16'>
        <div className='flex-1 text-3xl font-mono tabular-nums overflow-hidden'>
          {formatDisplay(display)}
        </div>
        <div className='flex-shrink-0 ml-2'>
          <Button
            variant='destructive'
            size='sm'
            onClick={handleClear}
            className='w-20'
          >
            Clear
          </Button>
        </div>
      </div>
      <div className='grid grid-cols-3 gap-2'>
        {['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '00', '.'].map(
          (btn) => (
            <motion.div
              key={btn}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant='outline'
                className='h-16 text-2xl font-medium w-full hover:bg-muted/50 transition-colors'
                onClick={() => handleNumberPress(btn === '00' ? '00' : btn)}
              >
                {btn}
              </Button>
            </motion.div>
          )
        )}
      </div>
      <Button
        className='w-full h-16 text-xl bg-[#33A9FF] hover:bg-[#33A9FF]/90 text-white transition-colors'
        onClick={calculateChange}
      >
        Calculate Change
      </Button>
    </div>
  )
}
