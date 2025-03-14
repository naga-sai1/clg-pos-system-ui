//@ts-nocheck
import type React from 'react'
import { useState, useEffect } from 'react'
import { z } from 'zod'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import {
  addProduct,
  getProductByBarcode,
  updateProduct,
  getAllCategories,
  getAllBrands,
  getAllBrandNames,
  getAllUnits,
  getAllActiveCategoriesDropdown,
  getAllActiveUnitsDropdown,
} from '@/api'
import { Package2, Barcode, Upload, CalendarIcon } from 'lucide-react'
import { toast, Toaster } from 'sonner'
import { storage } from '@/lib/storage'
import { cn } from '@/lib/utils'
import { useQueryData } from '@/hooks/use-query-data'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import BarcodeSearch from './components/barcode-search'
import BulkProductUpload from './components/bulk-productupload'
import { useBarcodeScanner } from './hooks/use-barcode-scanner'

// Define the product schema using Zod
const productSchema = z.object({
  products_name: z.string().min(1, 'Product name is required'),
  products_description: z.string().nullable().optional(),
  products_price: z.number().min(0, 'Price must be a positive number'),
  category: z.string().min(1, 'Category is required'),
  supplier: z.string().nullable().optional(),
  barcode: z.string().min(1, 'Barcode is required'),
  quantity: z.number().min(0, 'Quantity must be a positive number'),
  unit: z.string().min(1, 'Unit is required'),
  batch_number: z.string().min(1, 'Batch number is required'),
  manufacturing_date: z
    .date()
    .min(new Date('1900-01-01'), 'Manufacturing date must be after 1900-01-01'),
  expiry_date: z.date().min(new Date(), 'Expiry date must be after today'),
  qty_alert: z.number().min(0, 'Quantity alert must be a positive number'),
  created_by: z.number().optional(),
  updated_by: z.number().optional(),
  status: z.string().default('active'),
  brand: z.string().min(1, 'Manufacturer is required'),
  gst: z.string().min(1, 'GST rate is required'),
  shedule: z.string().min(1, 'Shedule is required'),
})

type ProductFormData = z.infer<typeof productSchema>

interface CategoryType {
  category_id: number
  category: string
  category_slug: string
  created_on: string
  status: boolean
  is_active: boolean
}

interface BrandType {
  brand_id: number
  brand: string
  brand_slug: string
  created_on: string
  status: boolean
  is_active: boolean
}

const ProductAdding: React.FC = () => {
  const [scannedBarcode, setScannedBarcode] = useState<string | null>(null)
  const [isUpdateMode, setIsUpdateMode] = useState(false)
  const queryClient = useQueryClient()
  const user = storage.getUser() || {}
  const { data: categories, isLoading: categoriesLoading } = useQueryData(
    ['categories_dropdown'],
    getAllActiveCategoriesDropdown
  )
  const { data: units, isLoading: unitsLoading } = useQueryData(
    ['units_dropdown'],
    getAllActiveUnitsDropdown
  )

  const { data: brands, isLoading: brandsLoading } = useQueryData(
    ['brand_names'],
    getAllBrandNames
  )

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      products_name: '',
      products_description: '',
      products_price: 0,
      category: '',
      supplier: '',
      barcode: '',
      quantity: 0,
      unit: '',
      batch_number: '',
      manufacturing_date: new Date(),
      expiry_date: new Date(),
      qty_alert: 5,
      status: 'active',
      brand: '',
      gst: '5',  // Change from empty string to default value '5'
      shedule: '',
    },
  })

  // Handle barcode detection
  const handleBarcodeDetected = (barcode: string) => {
    setScannedBarcode(barcode)
    form.setValue('barcode', barcode)
  }

  // Use the barcode scanner hook
  const { isScanning, startScanning, stopScanning } = useBarcodeScanner({
    onScan: handleBarcodeDetected,
    options: {
      resetTimeout: 100,
      showToast: true,
    },
  })

  // Query for fetching product details
  const {
    data: existingProduct,
    isError: productFetchError,
    isLoading: isProductLoading,
  } = useQuery({
    queryKey: ['product', scannedBarcode],
    queryFn: () =>
      scannedBarcode ? getProductByBarcode(scannedBarcode) : null,
    enabled: !!scannedBarcode,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
  })

  // Watch for changes in existingProduct
  useEffect(() => {
    if (isProductLoading) {
      toast.info('Checking for existing product...')
      return
    }

    if (existingProduct?.product) {
      console.log('Existing product found:', existingProduct)

      // Pre-fill form with existing product data
      const productData = existingProduct.product
      form.setValue('products_name', productData.products_name)
      form.setValue('products_description', productData.products_description)
      form.setValue('products_price', productData.products_price)
      form.setValue('category', productData.category)
      form.setValue('supplier', productData.suppliers_name)
      form.setValue('quantity', productData.quantity)
      form.setValue('barcode', productData.barcode)
      form.setValue('unit', productData.unit)
      form.setValue('batch_number', productData.batch_number)
      form.setValue(
        'manufacturing_date',
        new Date(productData.manufacturing_date)
      )
      form.setValue('expiry_date', new Date(productData.expiry_date))
      form.setValue('qty_alert', productData.qty_alert)
      form.setValue('brand', productData.brand)
      form.setValue('gst', productData.gst)
      form.setValue('shedule', productData.shedule)

      setIsUpdateMode(true)
      toast.warning('Product found! You can now update the details.')
    } else if (scannedBarcode && !productFetchError) {
      setIsUpdateMode(false)
      // Reset form except for barcode
      const defaultValues = {
        products_name: '',
        products_description: '',
        products_price: 0,
        category: '',
        supplier: '',
        quantity: 0,
        barcode: scannedBarcode,
        unit: '',
        batch_number: '',
        manufacturing_date: new Date(),
        expiry_date: new Date(),
        qty_alert: 5,
        status: 'active',
        brand: '',
        gst: '5',  // Change from empty string to default value '5'
        shedule: '',
      }

      Object.keys(defaultValues).forEach((key) => {
        form.setValue(
          key as keyof ProductFormData,
          defaultValues[key as keyof typeof defaultValues]
        )
      })

      toast.info('New product. Please fill in the details.')
    }
  }, [existingProduct, scannedBarcode, productFetchError, isProductLoading])

  // Update product mutation
  const updateMutation = useMutation({
    mutationFn: (data: any) => {
      return updateProduct(data.barcode, { ...data, updated_by: user?.userId })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product', scannedBarcode] })
      toast.success('Product updated successfully!')
      form.reset()
      setIsUpdateMode(false)
      setScannedBarcode(null)
    },
    onError: () => {
      toast.error('Failed to update product')
    },
  })

  // Add product mutation
  const addMutation = useMutation({
    mutationFn: (data: any) => {
      return addProduct({ ...data, created_by: user?.userId })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product', scannedBarcode] })
      toast.success('Product added successfully!')
      form.reset()
      setScannedBarcode(null)
    },
    onError: () => {
      toast.error('Failed to add product')
    },
  })

  const onSubmit = (data: ProductFormData) => {
    if (isUpdateMode) {
      updateMutation.mutate(data)
    } else {
      addMutation.mutate(data)
    }
  }

  return (
    <div className='container mx-auto p-4 space-y-6'>
      <Toaster />
      <header className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold flex items-center gap-2'>
          <Package2 className='h-8 w-8' />
          Product Management
        </h1>
      </header>

      <Tabs defaultValue='single' className='w-full'>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='single' className='flex items-center gap-2'>
            <Barcode className='h-4 w-4' />
            Single Product
          </TabsTrigger>
          <TabsTrigger value='bulk' className='flex items-center gap-2'>
            <Upload className='h-4 w-4' />
            Bulk Upload
          </TabsTrigger>
        </TabsList>
        <TabsContent value='single'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Barcode className='h-6 w-6' />
                Barcode Scanner
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BarcodeSearch
                onBarcodeDetected={setScannedBarcode}
                isLoading={isProductLoading}
              />
            </CardContent>
          </Card>

          <Card className='mt-6'>
            <CardHeader>
              <CardTitle>
                {isUpdateMode ? 'Update Product' : 'Add New Product'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className='space-y-4'
                >
                  <div className='grid grid-cols-2 gap-4'>
                    <FormField
                      control={form.control}
                      name='barcode'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Barcode</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='products_name'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name='products_description'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter product description"
                            className="resize-none"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className='grid grid-cols-2 gap-4'>
                    <FormField
                      control={form.control}
                      name='gst'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>GST Rate</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value || ""}
                              defaultValue={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder='Select GST Rate' />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value='5'>5%</SelectItem>
                                <SelectItem value='12'>12%</SelectItem>
                                <SelectItem value='18'>18%</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='products_price'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                            <Input
                              type='number'
                              placeholder='Enter price'
                              {...field}
                              onChange={(e) => {
                                const value = e.target.value
                                field.onChange(value === '' ? 0 : Number(value))
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />  <FormField
                    control={form.control}
                    name='quantity'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            placeholder='Enter quantity'
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value
                              field.onChange(value === '' ? 0 : Number(value))
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <FormField
                      control={form.control}
                      name='category'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <FormControl>
                            <Select
                              disabled={categoriesLoading}
                              onValueChange={field.onChange}
                              value={field.value || ""}
                              defaultValue={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder='Select a category' />
                              </SelectTrigger>
                              <SelectContent>
                                {(categories || [])?.filter(category => {
                                  // Check if category exists, has a category property, and that property is a non-empty string
                                  return category && typeof category.category === 'string' && category.category.trim() !== '';
                                }).map((category: any) => (
                                  <SelectItem
                                    key={category.category_id}
                                    value={category.category || `category_${category.category_id}`}
                                  >
                                    {category.category}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='brand'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Manufacturer</FormLabel>
                          <FormControl>
                            <Select
                              disabled={brandsLoading}
                              onValueChange={field.onChange}
                              value={field.value || ""}
                              defaultValue={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder='Select a Manufacturer' />
                              </SelectTrigger>
                              <SelectContent>
                                {(brands || [])?.filter(brand => {
                                  // Check if brand exists, has a brand property, and that property is a non-empty string
                                  return brand && typeof brand.brand === 'string' && brand.brand.trim() !== '';
                                }).map((brand: any) => (
                                  <SelectItem
                                    key={brand.brand_id}
                                    value={brand.brand || `brand_${brand.brand_id}`}
                                  >
                                    {brand.brand}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <FormField
                      control={form.control}
                      name='supplier'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Supplier</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />{' '}
                    <FormField
                      control={form.control}
                      name='unit'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pack</FormLabel>
                          <FormControl>
                            <Select
                              disabled={unitsLoading}
                              onValueChange={field.onChange}
                              value={field.value || ""}
                              defaultValue={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder='Select a Pack' />
                              </SelectTrigger>
                              <SelectContent>
                                {(units || [])?.filter(unit => {
                                  // Check if unit exists, has a unit property, and that property is a non-empty string
                                  return unit && typeof unit.unit === 'string' && unit.unit.trim() !== '';
                                }).map((unit: any) => (
                                  <SelectItem
                                    key={unit.unit_id}
                                    value={unit.unit || `unit_${unit.unit_id}`}
                                  >
                                    {unit.unit}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <FormField
                      control={form.control}
                      name='batch_number'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Batch Number</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='qty_alert'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantity Alert</FormLabel>
                          <FormControl>
                            <Input
                              type='number'
                              placeholder='Enter alert quantity'
                              {...field}
                              onChange={(e) => {
                                const value = e.target.value
                                field.onChange(value === '' ? 0 : Number(value))
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <FormField
                      control={form.control}
                      name='manufacturing_date'
                      render={({ field }) => (
                        <FormItem className='flex flex-col'>
                          <FormLabel>Manufacturing Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={'outline'}
                                  className={cn(
                                    'w-full pl-3 text-left font-normal',
                                    !field.value && 'text-muted-foreground'
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, 'PPP')
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className='w-auto p-0'
                              align='start'
                            >
                              <Calendar
                                mode='single'
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date > new Date() ||
                                  date < new Date('1900-01-01')
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />{' '}
                    <FormField
                      control={form.control}
                      name='expiry_date'
                      render={({ field }) => (
                        <FormItem className='flex flex-col'>
                          <FormLabel>Expiry Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={'outline'}
                                  className={cn(
                                    'w-full pl-3 text-left font-normal',
                                    !field.value && 'text-muted-foreground'
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, 'PPP')
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className='w-auto p-0'
                              align='start'
                            >
                              <Calendar
                                mode='single'
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <FormField
                      control={form.control}
                      name='shedule'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Shedule</FormLabel>
                          <FormControl>
                          <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type='submit'
                    className='w-full'
                    disabled={updateMutation.isPending || addMutation.isPending}
                  >
                    {updateMutation.isPending || addMutation.isPending
                      ? 'Processing...'
                      : isUpdateMode
                        ? 'Update Product'
                        : 'Add Product'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {updateMutation.isSuccess && (
            <Alert className='mt-4'>
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>Product updated successfully!</AlertDescription>
            </Alert>
          )}

          {updateMutation.isError && (
            <Alert variant='destructive' className='mt-4'>
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Failed to update product. Please try again.
              </AlertDescription>
            </Alert>
          )}

          {addMutation.isSuccess && (
            <Alert className='mt-4'>
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>Product added successfully!</AlertDescription>
            </Alert>
          )}

          {addMutation.isError && (
            <Alert variant='destructive' className='mt-4'>
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Failed to add product. Please try again.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>
        <TabsContent value='bulk'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Upload className='h-6 w-6' />
                Bulk Product Upload
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BulkProductUpload />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ProductAdding
