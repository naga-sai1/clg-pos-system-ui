//@ts-nocheck
import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { storage } from '@/lib/storage'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { CustomerDetailsForm } from './customer-details-form'
import { PaymentMethods } from './paymentmethods'

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  cart: any[]
  onCheckout: (data: any) => void
  customerDetails: {
    doctorName: string
    customerName: string
    customerMobile: string
  }
  onCustomerDetailsChange: (details: {
    doctorName: string
    customerName: string
    customerMobile: string
  }) => void
  discountPercentage: number
}

export function CheckoutModal({
  isOpen,
  onClose,
  cart,
  onCheckout,
  customerDetails,
  onCustomerDetailsChange,
  discountPercentage,
}: CheckoutModalProps) {
  const user = storage.getUser()
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cash')
  const [errors, setErrors] = useState({
    customerName: '',
    customerMobile: '',
  })

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.quantity * item.price, 0)
  }

  const validateForm = () => {
    const newErrors = {
      customerName: '',
      customerMobile: '',
    }

    // Only validate mobile number format if it's provided
    if (
      customerDetails.customerMobile?.trim() &&
      !/^\d{10}$/.test(customerDetails.customerMobile.trim())
    ) {
      newErrors.customerMobile = 'Please enter a valid 10-digit mobile number'
    }

    setErrors(newErrors)
    // Return true since all fields are optional now
    return !newErrors.customerMobile
  }

  const handleCheckout = () => {
    if (!validateForm()) {
      return
    }

    const checkoutData = {
      cart: cart.map((item) => ({
        barcode: item.barcode,
        name: item.name,
        description: item.description || '',
        price: item.price,
        quantity: item.quantity,
        batch_number: item.batch_number,
        manufacturing_date: item.manufacturing_date,
        expiry_date: item.expiry_date,
        brand: item.brand,
        unit: item.unit,
        sgst: item.sgst,
        cgst: item.cgst,
      })),
      total:
        calculateTotal() -
        (calculateTotal() * Math.min(discountPercentage, 100)) / 100,
      paymentMethod: selectedPaymentMethod,
      customerDetails: {
        doctorName: customerDetails.doctorName?.trim() || '',
        customerName: customerDetails.customerName?.trim() || '',
        customerMobile: customerDetails.customerMobile?.trim() || '',
      },
      discount_percentage: Math.min(discountPercentage, 100) || 0,
      user_id: user?.userId,
    }

    console.log('checkoutData', checkoutData)
    onCheckout(checkoutData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Checkout</DialogTitle>
          <DialogDescription>
            Please fill in the required details to complete your purchase
          </DialogDescription>
        </DialogHeader>

        <div className='py-4 space-y-4'>
          <PaymentMethods
            selectedMethod={selectedPaymentMethod}
            onSelect={setSelectedPaymentMethod}
          />

          <CustomerDetailsForm
            onDetailsChange={(details) => {
              onCustomerDetailsChange(details)
              // Clear errors when user starts typing
              setErrors({
                customerName: '',
                customerMobile: '',
              })
            }}
            initialDetails={customerDetails}
            errors={errors}
          />

          <div className='space-y-2'>
            <div className='flex justify-between'>
              <span>Total Items:</span>
              <span className='font-semibold'>{cart.length}</span>
            </div>
            <div className='flex justify-between'>
              <span>Sub Total:</span>
              <span className='font-semibold'>
                ₹{calculateTotal().toFixed(2)}
              </span>
            </div>
            {discountPercentage > 0 && (
              <div className='flex justify-between'>
                <span>Discount ({discountPercentage}%):</span>
                <span className='font-semibold text-red-500'>
                  -₹{(calculateTotal() * (discountPercentage / 100)).toFixed(2)}
                </span>
              </div>
            )}
            <div className='flex justify-between'>
              <span>Grand Total:</span>
              <span className='font-semibold'>
                ₹
                {(
                  calculateTotal() -
                  calculateTotal() * (discountPercentage / 100)
                ).toFixed(2)}
              </span>
            </div>
            <div className='flex justify-between'>
              <span>Payment Method:</span>
              <span className='font-semibold capitalize'>
                {selectedPaymentMethod}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleCheckout}>Proceed to Checkout</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
