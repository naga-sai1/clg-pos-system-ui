//@ts-nocheck
import { useState, useRef, useEffect } from 'react'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { getProductByBarcode, checkOut } from '@/api'
import { RootState } from '@/store'
import {
  addItem,
  removeItem,
  incrementQuantity,
  decrementQuantity,
  updateQuantity,
  setTax,
  setDiscount,
  resetBilling,
} from '@/store/slices/billingSlice'
import { motion } from 'framer-motion'
import {
  Menu,
  Search,
  Plus,
  Minus,
  Barcode,
  Edit2,
  Loader2,
  PauseCircle,
} from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Sonner } from '@/components/ui/sonner'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import AdvancedSearch from './components/advanced-search'
import { CheckoutModal } from './components/checkoutmodal'
import { CustomerDetailsForm } from './components/customer-details-form'
import { DiscountForm } from './components/discount-form'
import { HeldBills } from './components/heldbills'
import { HoldBillModal } from './components/holdbillmodal'
import { Numpad } from './components/numpad'
import OrderHistoryModal from './components/order-history-modal'
import { PaymentInfo } from './components/paymentInfo'
import { PaymentMethods } from './components/paymentmethods'
import { ProductTable } from './components/producttable'
import { QuantityEditModal } from './components/quantityeditmodal'
import { QuickActions } from './components/quickactions'
import { QuickOptions } from './components/quickoptions'
import { Receipt } from './components/receipt'
import { ReceiptPreviewModal } from './components/receiptpreviewmodal'
import { TransactionSummary } from './components/transactionsummary'
import { useBarcodeScanner } from './hooks/use-barcode-scanner'

export default function BillingSystem() {
  const dispatch = useDispatch()
  const {
    items: cart,
    total,
    tax,
    discount,
    finalAmount,
  } = useSelector((state: RootState) => state.billing)
  console.log('cart in billing', cart)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cash')
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false)
  const [isQuantityModalOpen, setIsQuantityModalOpen] = useState(false)
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const [newQuantity, setNewQuantity] = useState('')
  const [scannedBarcode, setScannedBarcode] = useState<string | null>(null)
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [checkoutData, setCheckoutData] = useState<any>(null)
  const [isReceiptPreviewOpen, setIsReceiptPreviewOpen] = useState(false)
  const [isHoldBillModalOpen, setIsHoldBillModalOpen] = useState(false)
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false)
  const [customerDetails, setCustomerDetails] = useState({
    doctorName: '',
    customerName: '',
    customerMobile: '',
  })
  const [discountPercentage, setDiscountPercentage] = useState(0)
  const [invoiceDetails, setInvoiceDetails] = useState<{
    invoice_number: string
    order_date: string
    order_time: string
  } | null>(null)

  const queryClient = useQueryClient()

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

  // Watch for loading state
  useEffect(() => {
    if (isProductLoading) {
      toast.loading('Checking product details...', {
        id: 'product-loading',
      })
    } else {
      toast.dismiss('product-loading')
    }
  }, [isProductLoading])

  // Watch for changes in existingProduct
  useEffect(() => {
    if (existingProduct?.product) {
      const productData = existingProduct.product
      // Check if the product already exists in the cart
      const existingCartItem = cart.find(
        (item) => item.barcode === productData.barcode
      )
      const sgst = parseFloat(productData.gst) / 2
      const cgst = parseFloat(productData.gst) / 2

      dispatch(
        addItem({
          barcode: productData.barcode,
          name: productData.products_name,
          description: productData.products_description,
          price: productData.products_price,
          quantity: 1,
          batch_number: productData.batch_number,
          manufacturing_date: productData.manufacturing_date,
          expiry_date: productData.expiry_date,
          brand: productData.brand,
          shedule: productData.shedule,
          unit: productData.unit,
          sgst: sgst,
          cgst: cgst,
        })
      )
      toast.success(`Added ${productData.products_name} to cart`)

      // Only open quantity modal if this is the first time adding the product
      if (!existingCartItem) {
        setEditingItemId(productData.barcode)
        setNewQuantity('1')
        setIsQuantityModalOpen(true)
      }
      setScannedBarcode(null)
    } else if (scannedBarcode && !productFetchError) {
      toast.dismiss('product-loading')
      toast.error('Product not found')
      setScannedBarcode(null)
    }
  }, [existingProduct, scannedBarcode, productFetchError, dispatch, cart])

  const handleScannedBarcode = async (barcode: string) => {
    try {
      const product = await getProductByBarcode(barcode)
      console.log('Product found:', product)
      const productData = product.product

      // Check if the product already exists in the cart
      const existingCartItem = cart.find(
        (item) => item.barcode === productData.barcode
      )
      const sgst = parseFloat(productData.gst) / 2
      const cgst = parseFloat(productData.gst) / 2

      dispatch(
        addItem({
          barcode: productData.barcode,
          name: productData.products_name,
          description: productData.products_description,
          price: productData.products_price,
          quantity: 1,
          batch_number: productData.batch_number,
          manufacturing_date: productData.manufacturing_date,
          expiry_date: productData.expiry_date,
          brand: productData.brand,
          shedule: productData.shedule,
          unit: productData.unit,
          sgst: sgst,
          cgst: cgst,
        })
      )
      toast.success(`Added ${productData.products_name} to cart`)

      // Only open quantity modal if this is the first time adding the product
      if (!existingCartItem) {
        setEditingItemId(productData.barcode)
        setNewQuantity('1')
        setIsQuantityModalOpen(true)
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      toast.error('Product not found')
    }
  }

  const receiptRef = useRef<HTMLDivElement>(null)

  const calculateTotalGST = () => {
    return cart.reduce((total, item) => {
      const itemTotal = item.price * item.quantity
      // Calculate base amount first
      const baseAmount =
        itemTotal / (1 + ((item.sgst || 0) + (item.cgst || 0)) / 100)
      const sgst = (baseAmount * (item.sgst || 0)) / 100
      const cgst = (baseAmount * (item.cgst || 0)) / 100
      return total + sgst + cgst
    }, 0)
  }

  const calculateSubTotal = () => {
    return cart.reduce((total, item) => {
      const itemTotal = item.price * item.quantity
      // Return the total including GST since price includes GST
      return total + itemTotal
    }, 0)
  }

  const calculateBaseAmount = () => {
    // Calculate total base amount (before GST)
    return cart.reduce((total, item) => {
      const itemTotal = item.price * item.quantity
      return (
        total + itemTotal / (1 + ((item.sgst || 0) + (item.cgst || 0)) / 100)
      )
    }, 0)
  }

  const calculateGrandTotal = () => {
    const subTotal = calculateSubTotal()
    const discountAmount = (subTotal * discountPercentage) / 100
    return subTotal - discountAmount
  }

  const handleQuantityChange = (barcode: string, change: number) => {
    if (change > 0) {
      dispatch(incrementQuantity(barcode))
    } else if (change < 0) {
      dispatch(decrementQuantity(barcode))
    }
  }

  const handleDirectQuantityUpdate = (barcode: string, newQuantity: number) => {
    if (newQuantity > 0) {
      dispatch(
        updateQuantity({
          barcode,
          quantity: newQuantity,
        })
      )
      return true
    }
    return false
  }

  const handleNumpadPress = (key: string) => {
    if (key === 'clear') {
      setNewQuantity('')
    } else if (key === 'enter') {
      if (editingItemId && newQuantity) {
        const quantity = parseInt(newQuantity, 10)
        if (handleDirectQuantityUpdate(editingItemId, quantity)) {
          setIsQuantityModalOpen(false)
          setEditingItemId(null)
          setNewQuantity('')
          toast.success('Quantity updated successfully')
        } else {
          toast.error('Quantity must be greater than 0')
        }
      }
    } else {
      setNewQuantity((prev) => prev + key)
    }
  }

  const handleQuantityModalUpdate = () => {
    if (editingItemId && newQuantity) {
      const quantity = Number.parseInt(newQuantity, 10)
      if (quantity > 0) {
        handleDirectQuantityUpdate(editingItemId, quantity)
        setIsQuantityModalOpen(false)
        setEditingItemId(null)
        setNewQuantity('')
        toast.success('Quantity updated')
      } else {
        toast.error('Quantity must be greater than 0')
      }
    }
  }

  const handleRemoveItem = (barcode: string) => {
    dispatch(removeItem(barcode))
    toast.success('Item removed from cart')
  }

  const { isScanning, startScanning, stopScanning } = useBarcodeScanner({
    onScan: handleScannedBarcode,
    options: {
      format: 'ANY',
      showToast: true,
      minLength: 4,
      maxLength: 48,
      resetTimeout: 30,
    },
  })

  const toggleScanner = () => {
    if (isScanning) {
      stopScanning()
      toast.info('Barcode scanner deactivated')
    } else {
      startScanning()
      toast.info('Barcode scanner activated')
    }
  }

  const checkoutMutation = useMutation({
    mutationFn: (checkoutData: any) => checkOut(checkoutData),
    onSuccess: (data: any) => {
      setShowConfirmationDialog(false)
      setShowSuccessDialog(true)
      setInvoiceDetails({
        invoice_number: data.data.invoice_number,
        order_date: data.data.order_date,
        order_time: data.data.order_time,
      })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message
      if (errorMessage) {
        toast.error(errorMessage)
      } else {
        toast.error(`Checkout failed. Please try again.`)
      }
      console.error('Checkout error:', error)
    },
  })

  const handleCheckout = (data: any) => {
    setCheckoutData(data)
    setShowConfirmationDialog(true)
  }

  const confirmCheckout = () => {
    if (cart.length === 0) {
      toast.error('Cart is empty')
      return
    }

    if (!selectedPaymentMethod) {
      toast.error('Please select a payment method')
      return
    }

    // console.log("checkout this ", checkoutData)
    checkoutMutation.mutate(checkoutData)
  }

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false)
    setIsReceiptPreviewOpen(true)
  }

  const handlePrintComplete = () => {
    setIsReceiptPreviewOpen(false)
    dispatch(resetBilling())
    setIsCheckoutModalOpen(false)
  }

  const handleSuspend = () => {
    dispatch(resetBilling())
    toast.success('Bill suspended successfully')
    setIsSuspendModalOpen(false)
  }

  return (
    <div className='flex h-screen flex-col overflow-hidden bg-gray-50'>
      <Sonner />

      {/* Header */}
      <header className='bg-white shadow-md'>
        <div className='container mx-auto px-4 py-4 flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <Button variant='ghost' size='icon' className='h-10 w-10'></Button>
            <img src='/images/main.png' alt='Logo' className='w-10 h-10' />
          </div>

          <AdvancedSearch />
          <OrderHistoryModal />

          <div className='flex items-center gap-4'>
            <Button
              onClick={toggleScanner}
              variant={isScanning ? 'default' : 'outline'}
              className='flex items-center gap-2'
            >
              <Barcode className='h-4 w-4' />
              {isScanning ? 'Stop Scanner' : 'Start Scanner'}
            </Button>

            <ThemeSwitch />

            <ProfileDropdown />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='flex-1 overflow-hidden container mx-auto px-4 py-6'>
        <div className='h-full grid grid-cols-1 lg:grid-cols-[1fr,300px] gap-6'>
          {/* Left Column */}
          <div
            className='space-y-6 overflow-y-auto pr-4'
            style={{ maxHeight: 'calc(100vh - 200px)' }}
          >
            <Card className='shadow-lg'>
              <CardContent className='p-0'>
                <ProductTable
                  items={cart}
                  onQuantityChange={handleQuantityChange}
                  onEditQuantity={(barcode) => {
                    setEditingItemId(barcode)
                    setIsQuantityModalOpen(true)
                    setNewQuantity('')
                  }}
                  onRemoveItem={(barcode) => {
                    const item = cart.find((item) => item.barcode === barcode)
                    if (item) {
                      if (
                        window.confirm(
                          `Are you sure you want to remove ${item.name} from the cart?`
                        )
                      ) {
                        dispatch(removeItem(barcode))
                        toast.success('Item removed from cart')
                      }
                    }
                  }}
                />
              </CardContent>
            </Card>

            {/* <QuickActions /> */}

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <TransactionSummary
                cart={cart}
                total={calculateGrandTotal()}
                subTotal={calculateSubTotal()}
                totalGST={calculateTotalGST()}
                discountPercentage={discountPercentage}
              />
              <DiscountForm onDiscountChange={setDiscountPercentage} />
            </div>

            <div className='flex flex-col gap-6'>
              <PaymentInfo
                timestamp={new Date().toLocaleString()}
                method={selectedPaymentMethod}
                amount={calculateGrandTotal()}
                notes={''}
              />
            </div>
          </div>

          {/* Right Column */}
          <div
            className='space-y-6 overflow-y-auto pr-4'
            style={{ maxHeight: 'calc(100vh - 200px)' }}
          >
            <Numpad
              totalAmount={calculateGrandTotal()}
              onPaymentComplete={(paidAmount) => {
                const change = paidAmount - calculateGrandTotal()
                toast.success(`Change due: ₹${change.toFixed(2)}`)
              }}
            />
            <HeldBills />
            <PaymentMethods
              selectedMethod={selectedPaymentMethod}
              onSelect={setSelectedPaymentMethod}
            />
            {/* <QuickOptions /> */}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className='bg-white border-t p-4'>
        <div className='container mx-auto flex gap-4'>
          <Button
            variant='destructive'
            className='flex-1 h-16 text-lg hover:bg-destructive/90 transition-colors'
            onClick={() => setIsSuspendModalOpen(true)}
          >
            Suspend
          </Button>
          <Button
            variant='outline'
            className='flex-1 h-16 text-lg hover:bg-muted/50 transition-colors'
            onClick={() => setIsHoldBillModalOpen(true)}
            disabled={cart.length === 0}
          >
            Hold
          </Button>
          <Button
            className='flex-1 h-16 text-lg bg-[#33A9FF] hover:bg-[#33A9FF]/90 text-white transition-colors'
            onClick={() => setIsCheckoutModalOpen(true)}
            disabled={cart.length === 0}
          >
            Checkout
          </Button>
        </div>
      </footer>

      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        cart={cart}
        onCheckout={handleCheckout}
        customerDetails={customerDetails}
        onCustomerDetailsChange={setCustomerDetails}
        discountPercentage={discountPercentage}
      />

      <HoldBillModal
        isOpen={isHoldBillModalOpen}
        onClose={() => setIsHoldBillModalOpen(false)}
        total={calculateGrandTotal()}
      />

      <AlertDialog
        open={isSuspendModalOpen}
        onOpenChange={setIsSuspendModalOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Suspend</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to suspend this bill? This will clear the
              current cart.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSuspend}>
              Confirm Suspend
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={showConfirmationDialog}
        onOpenChange={setShowConfirmationDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Checkout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to proceed with the checkout? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmCheckout}
              disabled={checkoutMutation.isPending}
            >
              {checkoutMutation.isPending ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Processing...
                </>
              ) : (
                'Confirm'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Order Successful!</AlertDialogTitle>
            <AlertDialogDescription>
              Your order has been successfully processed. Thank you for your
              purchase!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleSuccessDialogClose}>
              Continue to Receipt
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <QuantityEditModal
        isOpen={isQuantityModalOpen}
        onClose={() => {
          setIsQuantityModalOpen(false)
          setEditingItemId(null)
          setNewQuantity('')
        }}
        onConfirm={handleQuantityModalUpdate}
        quantity={newQuantity}
        onQuantityChange={setNewQuantity}
        onNumpadPress={handleNumpadPress}
      />

      <ReceiptPreviewModal
        isOpen={isReceiptPreviewOpen}
        onClose={handlePrintComplete}
        cart={cart}
        total={calculateGrandTotal()}
        customerDetails={customerDetails}
        discountPercentage={discountPercentage}
        invoiceDetails={invoiceDetails || undefined}
      />

      <div style={{ display: 'none' }}>
        <Receipt ref={receiptRef} cart={cart} total={calculateGrandTotal()} />
      </div>
    </div>
  )
}
