import { Plus, Minus, Edit2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface ProductTableProps {
  items: any[]
  onQuantityChange: (barcode: string, change: number) => void
  onEditQuantity: (barcode: string) => void
  onRemoveItem: (barcode: string) => void
}

export function ProductTable({
  items,
  onQuantityChange,
  onEditQuantity,
  onRemoveItem,
}: ProductTableProps) {
  console.log('cart in product table', items)
  return (
    <div className='w-full overflow-auto'>
      <Table>
        <TableHeader>
          <TableRow className='bg-muted/50'>
            <TableHead className='w-[100px]'>Item #</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className='text-right'>Price</TableHead>
            <TableHead className='w-[150px]'>Quantity</TableHead>
            <TableHead className='text-right'>SGST</TableHead>
            <TableHead className='text-right'>CGST</TableHead>
            <TableHead className='text-right'>Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow
              key={item.barcode}
              className='hover:bg-muted/30 transition-colors'
            >
              <TableCell className='font-medium'>{item.barcode}</TableCell>
              <TableCell>
                <div>{item.name}</div>
                <div className='text-sm text-muted-foreground'>
                  {item.description}
                </div>
              </TableCell>
              <TableCell className='text-right'>
                ₹{item.price.toFixed(2)}
              </TableCell>
              <TableCell>
                <div className='flex items-center justify-end gap-2'>
                  <Button
                    variant='outline'
                    size='icon'
                    className='h-8 w-8'
                    onClick={() => onQuantityChange(item.barcode, -1)}
                    disabled={item.quantity <= 1}
                  >
                    <Minus className='h-4 w-4' />
                  </Button>
                  <span className='w-12 text-center font-medium'>
                    {item.quantity}
                  </span>
                  <Button
                    variant='outline'
                    size='icon'
                    className='h-8 w-8'
                    onClick={() => onQuantityChange(item.barcode, 1)}
                  >
                    <Plus className='h-4 w-4' />
                  </Button>
                  <div className='flex gap-1 ml-2'>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-8 w-8'
                      onClick={() => onEditQuantity(item.barcode)}
                    >
                      <Edit2 className='h-4 w-4' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-8 w-8 text-red-500 hover:text-red-600'
                      onClick={() => {
                        if (
                          window.confirm(
                            `Are you sure you want to remove ${item.name}?`
                          )
                        ) {
                          onRemoveItem(item.barcode)
                        }
                      }}
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
              </TableCell>
              <TableCell className='text-right'>
                ₹
                {(
                  (item.price * item.quantity * (item.sgst || 0)) /
                  100
                ).toFixed(2)}
              </TableCell>
              <TableCell className='text-right'>
                ₹
                {(
                  (item.price * item.quantity * (item.cgst || 0)) /
                  100
                ).toFixed(2)}
              </TableCell>
              <TableCell className='text-right font-medium'>
                ₹{(item.price * item.quantity).toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
