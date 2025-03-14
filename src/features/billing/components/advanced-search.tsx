'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { addItem } from '@/store/slices/billingSlice'
import { Search, Loader2 } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { useDebounce } from 'use-debounce'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ProductList } from './product-list'
import { searchProducts } from '@/api'



export default function AdvancedSearch() {
  const [searchTerm, setSearchTerm] = useState('')
  const dispatch = useDispatch()
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500)

  const [searchResponse, setSearchResponse] = useState<any | null>(
    null
  )
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSearch = useCallback(async () => {
    if (!debouncedSearchTerm) {
      setIsOpen(false)
      setSearchResponse(null)
      return
    }

    setLoading(true)
    setIsOpen(true)
    try {
      const responseData = await searchProducts(debouncedSearchTerm)
      console.log("response", responseData)
      if (!responseData) {
        throw new Error('Failed to fetch products')
      }

      setSearchResponse(responseData)
    } catch (error) {
      console.error('Error fetching products:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch products',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }, [debouncedSearchTerm])

  useEffect(() => {
    handleSearch()
  }, [handleSearch])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const addToCart = (product: any) => {
    dispatch(
      addItem({
        barcode: product.barcode,
        name: product.products_name,
        description: product.products_description,
        price: product.products_price,
        quantity: 1,
        batch_number: product.batch_number,
        manufacturing_date: product.manufacturing_date,
        expiry_date: product.expiry_date,
        brand: product.brand,
        shedule: product.shedule,
        unit: product.unit,
        sgst: parseFloat(product.gst) / 2,
        cgst: parseFloat(product.gst) / 2,
      })
    )
    toast({
      title: 'Added to Cart',
      description: `${product.products_name} has been added to the cart.`,
    })
    setIsOpen(false)
  }

  return (
    <Card className='w-full max-w-2xl shadow-lg'>
      <CardContent className='p-4'>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <div className='flex space-x-2'>
              <div className='relative flex-grow'>
                <Input
                  ref={inputRef}
                  type='text'
                  placeholder='Search products by name or barcode'
                  value={searchTerm}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  className='pl-10 pr-4 py-2 w-full'
                />
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
              </div>
              <Button onClick={handleSearch} disabled={loading}>
                {loading ? (
                  <Loader2 className='h-4 w-4 animate-spin' />
                ) : (
                  'Search'
                )}
              </Button>
            </div>
          </PopoverTrigger>
          <PopoverContent className='w-[400px] p-0' align='start'>
            <ProductList
              searchResponse={searchResponse}
              loading={loading}
              addToCart={addToCart}
            />
          </PopoverContent>
        </Popover>
      </CardContent>
    </Card>
  )
}
