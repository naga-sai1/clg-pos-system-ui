//@ts-nocheck
import { forwardRef } from 'react'
import { format } from 'date-fns'

interface CartItem {
  name: string
  price: number
  quantity: number
  description?: string
  sgst?: number
  cgst?: number
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

interface OrderHistoryReceiptProps {
  order: Order
}

export const OrderHistoryReceipt = forwardRef<
  HTMLDivElement,
  OrderHistoryReceiptProps
>(({ order }, ref) => {
  if (!order) {
    return null
  }

  // Calculate total amount from cart
  const totalAmount = (order.cart || []).reduce(
    (sum: number, item: CartItem) =>
      sum + (item?.quantity || 0) * (item?.price || 0),
    0
  )

  // Calculate discount if applicable
  const discountAmount = order.discount_percentage
    ? totalAmount * (order.discount_percentage / 100)
    : 0

  // Final amount after discount
  const finalAmount = totalAmount - discountAmount

  // Updated GST calculation logic
  const calculateItemGST = (item: CartItem) => {
    const itemPrice = item.price
    const itemQuantity = item.quantity
    const baseAmount = itemPrice * itemQuantity

    // Calculate GST based on item's GST rates
    return {
      sgst: (baseAmount * (item.sgst || 0)) / 100,
      cgst: (baseAmount * (item.cgst || 0)) / 100,
    }
  }

  // Calculate GST components from individual items
  const gstSummary = (order.cart || []).reduce(
    (summary: any, item: CartItem) => {
      const { sgst, cgst } = calculateItemGST(item)
      const itemTotal = item.quantity * item.price

      // Track GST rates for display
      const sgstRate = item.sgst || 0
      const cgstRate = item.cgst || 0
      if (sgstRate > 0 && !summary.sgstRates.includes(sgstRate)) {
        summary.sgstRates.push(sgstRate)
      }
      if (cgstRate > 0 && !summary.cgstRates.includes(cgstRate)) {
        summary.cgstRates.push(cgstRate)
      }

      return {
        baseAmount: summary.baseAmount + itemTotal,
        sgstAmount: summary.sgstAmount + sgst,
        cgstAmount: summary.cgstAmount + cgst,
        sgstRates: summary.sgstRates,
        cgstRates: summary.cgstRates,
      }
    },
    {
      baseAmount: 0,
      sgstAmount: 0,
      cgstAmount: 0,
      sgstRates: [],
      cgstRates: [],
    }
  )

  const { baseAmount, sgstAmount, cgstAmount, sgstRates, cgstRates } =
    gstSummary

  // Format GST rate display
  const formatGSTRates = (rates: number[]) => {
    if (rates.length === 0) return '0'
    if (rates.length === 1) return rates[0].toString()
    return `${Math.min(...rates)}-${Math.max(...rates)}`
  }

  const styles = {
    receipt: {
      color: 'black',
      padding: '16px',
      minWidth: '300px',
      width: '80mm',
      fontFamily: 'monospace',
      fontSize: '12px',
      backgroundColor: 'white',
    },
    header: {
      textAlign: 'center' as const,
      marginBottom: '16px',
    },
    title: {
      fontSize: '16px',
      fontWeight: 'bold',
      marginBottom: '4px',
    },
    headerText: {
      fontSize: '10px',
      margin: '2px 0',
    },
    orderInfo: {
      marginBottom: '8px',
      fontSize: '10px',
    },
    orderInfoRow: {
      display: 'flex',
      justifyContent: 'space-between',
      margin: '2px 0',
    },
    itemsSection: {
      borderTop: '1px solid #e5e7eb',
      borderBottom: '1px solid #e5e7eb',
      padding: '8px 0',
      marginBottom: '8px',
    },
    itemsHeader: {
      display: 'grid',
      gridTemplateColumns: 'repeat(12, 1fr)',
      gap: '4px',
      marginBottom: '4px',
      fontSize: '10px',
      fontWeight: 'bold',
    },
    itemRow: {
      display: 'grid',
      gridTemplateColumns: 'repeat(12, 1fr)',
      gap: '4px',
      fontSize: '10px',
    },
    itemDesc: {
      color: '#6b7280',
      fontSize: '10px',
    },
    totalsSection: {
      textAlign: 'right' as const,
      marginBottom: '16px',
      fontSize: '10px',
    },
    totalRow: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '4px',
    },
    finalTotal: {
      borderTop: '1px solid #e5e7eb',
      paddingTop: '4px',
      fontWeight: 'bold',
    },
    footer: {
      textAlign: 'center' as const,
      fontSize: '10px',
      marginTop: '16px',
    },
    companyLogo: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '8px',
    },
  }

  return (
    <div ref={ref} style={styles.receipt}>
      <div style={styles.header}>
        <div style={styles.companyLogo}>
          <img
            src='/images/main.png'
            width={30}
            height={30}
            alt='Logo'
            style={{ marginRight: '8px' }}
          />
          <h2 style={styles.title}>Avanthi</h2>
        </div>
        <p style={styles.headerText}>
        Avanthi Institute of Engineering and Technology, Narsipatnam Road, Makavarapalem, Andhra Pradesh 531113
        </p>
        <p style={styles.headerText}>Contact No: 9876543210, 9123456780</p>
        <p style={styles.headerText}>
        </p>
      </div>

      <div style={styles.orderInfo}>
        <div style={styles.orderInfoRow}>
          <span>Invoice #:</span>
          <span>{order.invoice_number || 'N/A'}</span>
        </div>
        <div style={styles.orderInfoRow}>
          <span>Order #:</span>
          <span>{order.order_id || 'N/A'}</span>
        </div>
        <div style={styles.orderInfoRow}>
          <span>Date:</span>
          <span>
            {order.order_date && order.order_time
              ? `${order.order_date} ${order.order_time}`
              : 'N/A'}
          </span>
        </div>
        {order.customerDetails && (
          <>
            {order.customerDetails.customerName && (
              <div style={styles.orderInfoRow}>
                <span>Customer:</span>
                <span>{order.customerDetails.customerName}</span>
              </div>
            )}
            {order.customerDetails.customerMobile && (
              <div style={styles.orderInfoRow}>
                <span>Phone:</span>
                <span>{order.customerDetails.customerMobile}</span>
              </div>
            )}
            {order.customerDetails.doctorName && (
              <div style={styles.orderInfoRow}>
                <span>Doctor:</span>
                <span>{order.customerDetails.doctorName}</span>
              </div>
            )}
          </>
        )}
      </div>

      <div style={styles.itemsSection}>
        <div style={styles.itemsHeader}>
          <div style={{ gridColumn: 'span 6' }}>Item</div>
          <div style={{ gridColumn: 'span 2', textAlign: 'right' }}>Qty</div>
          <div style={{ gridColumn: 'span 4', textAlign: 'right' }}>Amount</div>
        </div>
        {(order.cart || []).map((item: CartItem, index: number) => (
          <div key={index} style={styles.itemRow}>
            <div style={{ gridColumn: 'span 6' }}>
              <div>{item?.name || 'N/A'}</div>
              <div style={styles.itemDesc}>{item?.description || ''}</div>
            </div>
            <div style={{ gridColumn: 'span 2', textAlign: 'right' }}>
              {item?.quantity || 0}
            </div>
            <div style={{ gridColumn: 'span 4', textAlign: 'right' }}>
              ₹{((item?.quantity || 0) * (item?.price || 0)).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      <div style={styles.totalsSection}>
        <div style={styles.totalRow}>
          <span>Total Amount:</span>
          <span>₹{totalAmount.toFixed(2)}</span>
        </div>
        {order.discount_percentage > 0 && (
          <div style={styles.totalRow}>
            <span>Discount ({order.discount_percentage}%):</span>
            <span>-₹{discountAmount.toFixed(2)}</span>
          </div>
        )}
        <div style={styles.totalRow}>
          <span>Taxable Value:</span>
          <span>₹{(finalAmount - (cgstAmount + sgstAmount)).toFixed(2)}</span>
        </div>
        <div style={styles.totalRow}>
          <span>CGST @ {formatGSTRates(cgstRates)}%:</span>
          <span>₹{cgstAmount.toFixed(2)}</span>
        </div>
        <div style={styles.totalRow}>
          <span>SGST @ {formatGSTRates(sgstRates)}%:</span>
          <span>₹{sgstAmount.toFixed(2)}</span>
        </div>
        <div style={styles.totalRow}>
          <span>Total Tax:</span>
          <span>₹{(cgstAmount + sgstAmount).toFixed(2)}</span>
        </div>
        <div style={{ ...styles.totalRow, ...styles.finalTotal }}>
          <span>Total Amount Payable:</span>
          <span>₹{finalAmount.toFixed(2)}</span>
        </div>
        {order.paymentMethod && (
          <div style={styles.totalRow}>
            <span>Payment Method:</span>
            <span>{order.paymentMethod}</span>
          </div>
        )}
      </div>

      <div style={styles.footer}>
        <p style={{ margin: '2px 0' }}>Thank you for shopping with us!</p>
        <p style={{ margin: '2px 0' }}>Please visit again</p>
        <p style={{ margin: '8px 0 2px' }}>
          * This is a computer generated receipt
        </p>
        <p style={{ margin: '2px 0' }}>* Price includes GST</p>
      </div>
    </div>
  )
})

OrderHistoryReceipt.displayName = 'OrderHistoryReceipt'
