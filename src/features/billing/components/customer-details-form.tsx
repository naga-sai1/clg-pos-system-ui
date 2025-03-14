import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface CustomerDetailsFormProps {
  onDetailsChange: (details: {
    doctorName: string
    customerName: string
    customerMobile: string
  }) => void
  initialDetails?: {
    doctorName: string
    customerName: string
    customerMobile: string
  }
  errors?: {
    customerName?: string
    customerMobile?: string
  }
}

export function CustomerDetailsForm({
  onDetailsChange,
  initialDetails,
  errors = {},
}: CustomerDetailsFormProps) {
  const [details, setDetails] = useState({
    doctorName: initialDetails?.doctorName || '',
    customerName: initialDetails?.customerName || '',
    customerMobile: initialDetails?.customerMobile || '',
  })

  const handleChange = (field: string, value: string) => {
    if (field === 'customerMobile') {
      // Only allow numbers and limit to 10 digits
      const numbersOnly = value.replace(/[^0-9]/g, '')
      const limitedToTen = numbersOnly.slice(0, 10)
      value = limitedToTen
    }

    const newDetails = { ...details, [field]: value }
    setDetails(newDetails)
    onDetailsChange(newDetails)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Details</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-2'>
          <Label htmlFor='doctorName'>Doctor Name</Label>
          <Input
            id='doctorName'
            placeholder='Enter doctor name'
            value={details.doctorName}
            onChange={(e) => handleChange('doctorName', e.target.value)}
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='customerName'>
            Customer Name <span className='text-red-500'>*</span>
          </Label>
          <Input
            id='customerName'
            placeholder='Enter customer name'
            value={details.customerName}
            onChange={(e) => handleChange('customerName', e.target.value)}
            className={errors.customerName ? 'border-red-500' : ''}
          />
          {errors.customerName && (
            <p className='text-sm text-red-500'>{errors.customerName}</p>
          )}
        </div>
        <div className='space-y-2'>
          <Label htmlFor='customerMobile'>
            Mobile Number <span className='text-red-500'>*</span>
          </Label>
          <Input
            id='customerMobile'
            type='tel'
            placeholder='Enter 10 digit mobile number'
            value={details.customerMobile}
            onChange={(e) => handleChange('customerMobile', e.target.value)}
            className={errors.customerMobile ? 'border-red-500' : ''}
            maxLength={10}
            pattern='[0-9]{10}'
          />
          {errors.customerMobile && (
            <p className='text-sm text-red-500'>{errors.customerMobile}</p>
          )}
          {details.customerMobile && details.customerMobile.length !== 10 && (
            <p className='text-sm text-yellow-600'>
              Mobile number must be 10 digits
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
