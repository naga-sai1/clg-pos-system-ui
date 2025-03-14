import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"


interface ProductListProps {
  searchResponse: any | null
  loading: boolean
  addToCart: (product: any) => void
}

export function ProductList({ searchResponse, loading, addToCart }: ProductListProps) {
  if (loading) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
        <p className="mt-2">Searching...</p>
      </div>
    )
  }

  if (!searchResponse) {
    return null
  }

  if (searchResponse.count === 0) {
    return <div className="p-4 text-center text-muted-foreground">No products found. Try a different search term.</div>
  }

  return (
    <div className="max-h-[400px] overflow-y-auto">
      <div className="p-4 bg-muted/50 border-b sticky top-0 z-10">
        <p className="font-semibold">Found {searchResponse.count} result(s)</p>
      </div>
      {searchResponse.products.map((product : any) => (
        <div key={product.products_id} className="p-4 border-b last:border-b-0 hover:bg-muted/50 transition-colors">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold">{product.products_name}</h3>
              <p className="text-sm text-muted-foreground">{product.products_description}</p>
            </div>
            <Button size="sm" onClick={() => addToCart(product)}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
            <p>
              <span className="font-medium">Price:</span> ${product.products_price.toFixed(2)}
            </p>
            <p>
              <span className="font-medium">Barcode:</span> {product.barcode}
            </p>
            <p>
              <span className="font-medium">Quantity:</span> {product.quantity}
            </p>
            <p>
              <span className="font-medium">Category:</span> {product.categories_name}
            </p>
            <p>
              <span className="font-medium">Supplier:</span> {product.suppliers_name}
            </p>
            <p>
              <span className="font-medium">Expiry:</span> {product.expiry_date}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

