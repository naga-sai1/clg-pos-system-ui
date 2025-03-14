import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface BillingItem {
  barcode: string
  name: string
  description: string
  price: number
  quantity: number
  batch_number?: string
  manufacturing_date?: string
  expiry_date?: string
  brand?: string
  unit?: string
  sgst?: number
  cgst?: number
  shedule?: string
}

interface HeldBill {
  id: string
  referenceNumber: string
  items: BillingItem[]
  total: number
  tax: number
  discount: number
  finalAmount: number
  timestamp: string
}

interface CustomerDetails {
  doctorName: string
  customerName: string
  customerMobile: string
}

export interface CheckoutData {
  cart: BillingItem[]
  total: number
  paymentMethod: string
  customerDetails: CustomerDetails
}

interface BillingState {
  items: BillingItem[]
  total: number
  tax: number
  discount: number
  finalAmount: number
  heldBills: HeldBill[]
}

const initialState: BillingState = {
  items: [],
  total: 0,
  tax: 0,
  discount: 0,
  finalAmount: 0,
  heldBills: [],
}

const billingSlice = createSlice({
  name: 'billing',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<BillingItem>) => {
      const existingItem = state.items.find(
        (item) => item.barcode === action.payload.barcode
      )
      if (existingItem) {
        existingItem.quantity += action.payload.quantity
      } else {
        state.items.push(action.payload)
      }
      state.total = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      )
      state.finalAmount = state.total + state.tax - state.discount
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.barcode !== action.payload)
      state.total = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      )
      state.finalAmount = state.total + state.tax - state.discount
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ barcode: string; quantity: number }>
    ) => {
      const item = state.items.find((item) => item.barcode === action.payload.barcode)
      if (item) {
        item.quantity = Math.max(1, action.payload.quantity)
        state.total = state.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        )
        state.finalAmount = state.total + state.tax - state.discount
      }
    },
    incrementQuantity: (
      state,
      action: PayloadAction<string>
    ) => {
      const item = state.items.find((item) => item.barcode === action.payload)
      if (item) {
        item.quantity += 1
        state.total = state.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        )
        state.finalAmount = state.total + state.tax - state.discount
      }
    },
    decrementQuantity: (
      state,
      action: PayloadAction<string>
    ) => {
      const item = state.items.find((item) => item.barcode === action.payload)
      if (item && item.quantity > 1) {
        item.quantity -= 1
        state.total = state.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        )
        state.finalAmount = state.total + state.tax - state.discount
      }
    },
    setTax: (state, action: PayloadAction<number>) => {
      state.tax = action.payload
      state.finalAmount = state.total + state.tax - state.discount
    },
    setDiscount: (state, action: PayloadAction<number>) => {
      state.discount = action.payload
      state.finalAmount = state.total + state.tax - state.discount
    },
    holdBill: (state, action: PayloadAction<{ referenceNumber: string }>) => {
      const heldBill: HeldBill = {
        id: Date.now().toString(),
        referenceNumber: action.payload.referenceNumber,
        items: [...state.items],
        total: state.total,
        tax: state.tax,
        discount: state.discount,
        finalAmount: state.finalAmount,
        timestamp: new Date().toISOString(),
      }
      state.heldBills.push(heldBill)
      // Reset the current cart after holding the bill
      state.items = []
      state.total = 0
      state.tax = 0
      state.discount = 0
      state.finalAmount = 0
    },
    retrieveHeldBill: (state, action: PayloadAction<string>) => {
      const heldBill = state.heldBills.find(
        (bill) => bill.id === action.payload
      )
      if (heldBill) {
        state.items = [...heldBill.items]
        state.total = heldBill.total
        state.tax = heldBill.tax
        state.discount = heldBill.discount
        state.finalAmount = heldBill.finalAmount
        state.heldBills = state.heldBills.filter(
          (bill) => bill.id !== action.payload
        )
      }
    },
    resetBilling: (state) => {
      return { ...initialState, heldBills: state.heldBills }
    },
  },
})

export const {
  addItem,
  removeItem,
  updateQuantity,
  incrementQuantity,
  decrementQuantity,
  setTax,
  setDiscount,
  resetBilling,
  holdBill,
  retrieveHeldBill,
} = billingSlice.actions

export default billingSlice.reducer
