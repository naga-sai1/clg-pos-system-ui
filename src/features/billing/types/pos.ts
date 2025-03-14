export interface Product {
  products_id: string
  title: string
  description: string
  originalPrice: number
  price: number
  barcode: string
}

export interface CartItem extends Product {
  quantity: number
}

export interface Transaction {
  totalItems: number
  discountItems: number
  subTotal: number
  totalTax: number
  discount: number
  totalDue: number
  totalPaid: number
  paymentMethod: string
  timestamp: string
}

