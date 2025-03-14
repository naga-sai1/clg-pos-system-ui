//@ts-nocheck
import type React from 'react'
import { useState, useCallback } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { bulkUploadProducts } from '@/api'
import { Upload, FileText, Loader, Download } from 'lucide-react'
import Papa from 'papaparse'
import { useDropzone } from 'react-dropzone'
import { storage } from '@/lib/storage'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface Product {
  barcode: string
  products_name: string
  products_description: string
  products_price: number
  category: string
  supplier_name: string
  quantity: number
  unit: string
  batch_number: string
  manufacturing_date: string
  expiry_date: string
  qty_alert: number
  brand: string
  gst: number
  shedule: string
}

const BulkProductUpload: React.FC = () => {
  const [csvData, setCsvData] = useState<Product[]>([])
  const user = storage.getUser()
  const userId = user?.userId
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const bulkUploadMutation = useMutation({
    mutationFn: (data: any) => bulkUploadProducts(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast({
        title: 'Success',
        description: 'Products uploaded successfully!',
      })
      setCsvData([])
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to upload products',
        variant: 'destructive',
      })
    },
  })

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    Papa.parse(file, {
      complete: (result) => {
        console.log('result in on drop', result.data.slice(1))
        const parsedData = result.data.slice(1).map((row: any) => ({
          products_name: row[0],
          products_description: row[1] || '',
          products_price: Number.parseFloat(row[2]),
          category: row[3],
          supplier_name: row[4] || '',
          barcode: row[5],
          quantity: Number.parseInt(row[6]),
          unit: row[7],
          batch_number: row[8],
          manufacturing_date: row[9],
          expiry_date: row[10],
          qty_alert: Number.parseInt(row[11]),
          brand: row[12],
          gst: row[13],
          shedule: row[14],
        }))
        setCsvData(parsedData)
      },

      header: false,
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
  })

  const handleUpload = () => {
    if (csvData.length === 0) {
      toast({
        title: 'Error',
        description: 'Please upload a CSV file first',
        variant: 'destructive',
      })
      return
    }
    console.log('csvData', csvData)
    const payload = {
      products: csvData,
      createdBy: user?.userId,
    }
    bulkUploadMutation.mutate(payload)
  }

  const handleDownloadTemplate = () => {
    const csvContent = [
      'Product Name,Description,Price,Category,Supplier,Barcode,Quantity,Unit,Batch Number,Manufacturing Date,Expiry Date,Quantity Alert,Brand,GST,Shedule',
      'Paracetamol 500mg,Headache relief,5.99,Medicines,Supplier A,890123456789,100,Tablets,BATCH001,2024-01-01,2025-01-01,50,PharmaCo,5,Schedule H',
      'Vitamin C 1000mg,Immune support,12.99,Supplements,Supplier B,890987654321,50,Capsules,BATCH002,2024-02-01,2025-02-01,20,VitaHealth,12,Non-Scheduled',
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'applepharmacybulkproducts-sheet.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className='space-y-4'>
      {/* Download Template Button - Always visible */}
      <div className='text-center'>
        <Button
          variant='outline'
          onClick={handleDownloadTemplate}
          className='space-x-2 mb-4'
        >
          <Download className='h-4 w-4' />
          <span>Download CSV Template</span>
        </Button>
      </div>

      {/* Upload Section */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed p-8 text-center cursor-pointer rounded-lg ${
          isDragActive ? 'border-primary' : 'border-gray-300'
        }`}
      >
        <Input {...getInputProps()} />
        {isDragActive ? (
          <p className='text-primary'>Drop the CSV file here ...</p>
        ) : (
          <div className='space-y-2'>
            <Upload className='mx-auto h-12 w-12 text-gray-400' />
            <p className='text-lg font-semibold'>
              Drag 'n' drop a CSV file here, or click to select one
            </p>
            <p className='text-sm text-gray-500'>Supported format: CSV</p>
          </div>
        )}
      </div>

      {/* Preview Section - Only shows after upload */}
      {csvData.length > 0 && (
        <>
          <div className='bg-gray-50 p-4 rounded-lg'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-2 text-sm text-gray-600'>
                <FileText className='h-5 w-5' />
                <span>{csvData.length} products loaded</span>
              </div>
            </div>
          </div>

          <div className='border rounded-lg'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Barcode</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Batch Number</TableHead>
                  <TableHead>Manufacturing Date</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Quantity Alert</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Gst</TableHead>
                  <TableHead>Shedule</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {csvData.map((product, index) => (
                  <TableRow key={index}>
                    <TableCell>{product.barcode}</TableCell>
                    <TableCell>{product.products_name}</TableCell>
                    <TableCell>{product.products_description}</TableCell>
                    <TableCell>${product.products_price.toFixed(2)}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.supplier_name}</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell>{product.unit}</TableCell>
                    <TableCell>{product.batch_number}</TableCell>
                    <TableCell>{product.manufacturing_date}</TableCell>
                    <TableCell>{product.expiry_date}</TableCell>
                    <TableCell>{product.qty_alert}</TableCell>
                    <TableCell>{product.brand}</TableCell>
                    <TableCell>{product.gst}</TableCell>
                    <TableCell>{product.shedule}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className='flex justify-end'>
            <Button
              onClick={handleUpload}
              disabled={bulkUploadMutation.isPending}
            >
              {bulkUploadMutation.isPending ? (
                <Loader className='h-4 w-4 animate-spin' />
              ) : (
                'Upload Products'
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

export default BulkProductUpload
