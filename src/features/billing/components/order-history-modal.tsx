//@ts-nocheck

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'

import { Search, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { OrderHistoryReceiptModal } from './order-history-receipt-modal'
import { getAllOrders } from '@/api'

interface CartItem {
  name: string
  price: number
  quantity: number
}

interface CustomerDetails {
  doctorName?: string
  customerName?: string
  customerMobile?: string
}

interface Order {
  order_id: number
  invoice_number: string
  order_date: string
  order_time: string
  total: number
  paymentMethod: string
  cart: CartItem[]
  customerDetails: CustomerDetails | null
  discount_percentage: number
}

export default function OrderHistoryModal() {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false)
  const ordersPerPage = 5

  const { data, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: getAllOrders,
  })

  const orders = data?.orders || []

  // Filter orders based on search term
  const filteredOrders = orders.filter(
    (order: Order) =>
      order.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.order_date.includes(searchTerm) ||
      order.total.toString().includes(searchTerm) ||
      (order.customerDetails?.customerName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ??
        false)
  )

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    setCurrentPage(1)
  }

  const indexOfLastOrder = currentPage * ordersPerPage
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  )

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const handlePreviewClick = (order: Order) => {
    setSelectedOrder(order)
    setIsReceiptModalOpen(true)
  }

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button className='bg-blue-600 hover:bg-blue-700'>
            Show History Bills
          </Button>
        </DialogTrigger>
        <DialogContent className='max-w-4xl'>
          <DialogHeader>
            <DialogTitle className='text-2xl font-bold mb-4'>
              Order History
            </DialogTitle>
          </DialogHeader>
          <div className='mb-4'>
            <div className='relative'>
              <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Search orders...'
                className='pl-8'
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>
          {isLoading ? (
            <div className='flex justify-center items-center h-64'>
              <Loader2 className='h-8 w-8 animate-spin' />
            </div>
          ) : (
            <>
              <div className='rounded-md border'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className='font-bold'>Order ID</TableHead>
                      <TableHead className='font-bold'>
                        Invoice Number
                      </TableHead>
                      <TableHead className='font-bold'>Date & Time</TableHead>
                      <TableHead className='font-bold'>Customer</TableHead>
                      <TableHead className='font-bold'>Total</TableHead>
                      <TableHead className='font-bold'>
                        Payment Method
                      </TableHead>
                      <TableHead className='font-bold'>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentOrders.map((order : any) => (
                      <TableRow key={order.order_id}>
                        <TableCell>{order.order_id}</TableCell>
                        <TableCell>{order.invoice_number}</TableCell>
                        <TableCell>{`${order.order_date} ${order.order_time}`}</TableCell>
                        <TableCell>
                          {order.customerDetails?.customerName || 'N/A'}
                        </TableCell>
                        <TableCell>{formatCurrency(order.total)}</TableCell>
                        <TableCell className='capitalize'>
                          {order.paymentMethod}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => handlePreviewClick(order)}
                          >
                            Preview
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className='mt-4'>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href='#'
                        onClick={(e) => {
                          e.preventDefault()
                          if (currentPage > 1) paginate(currentPage - 1)
                        }}
                        className={
                          currentPage === 1
                            ? 'pointer-events-none opacity-50'
                            : ''
                        }
                      />
                    </PaginationItem>
                    {Array.from({
                      length: Math.ceil(filteredOrders.length / ordersPerPage),
                    }).map((_, index) => (
                      <PaginationItem key={index}>
                        <PaginationLink
                          href='#'
                          onClick={(e) => {
                            e.preventDefault()
                            paginate(index + 1)
                          }}
                          isActive={currentPage === index + 1}
                        >
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        href='#'
                        onClick={(e) => {
                          e.preventDefault()
                          if (
                            currentPage <
                            Math.ceil(filteredOrders.length / ordersPerPage)
                          )
                            paginate(currentPage + 1)
                        }}
                        className={
                          currentPage ===
                          Math.ceil(filteredOrders.length / ordersPerPage)
                            ? 'pointer-events-none opacity-50'
                            : ''
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <OrderHistoryReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        order={selectedOrder}
      />
    </>
  )
}
