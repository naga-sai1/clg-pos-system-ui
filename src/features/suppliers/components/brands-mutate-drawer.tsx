//@ts-nocheck
import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createBrand, updateBrand } from '@/api'
import { useMutationData } from '@/hooks/use-mutation-data'
import { toast } from '@/hooks/use-toast'
import { FileUpload } from '@/components/ui/file-upload'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/custom/button'
import { Brand } from '../data/schema'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Brand
}

const formSchema = z.object({
  brand: z.string().min(1, 'Brand is required.'),
  logo: z.instanceof(File).optional(),
  status: z.boolean().default(true),
})
type BrandsForm = z.infer<typeof formSchema>

export function BrandsMutateDrawer({ open, onOpenChange, currentRow }: Props) {
  const isUpdate = !!currentRow

  const brandId = currentRow?.brand_id

  const { isPending: createBrandPending, mutate: createBrandMutation } =
    useMutationData(
      ['create-brand'],
      (data: any) => createBrand(data),
      'brands',
      (data: any) => {
        console.log('brand data', data)
        onOpenChange(false)
        form.reset()
        setLogoPreview(null)
        toast({
          title: 'You submitted the following values:',
          description: (
            <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
              <code className='text-white '>Brand created successfully.</code>
            </pre>
          ),
          variant: 'success',
        })
      }
    )
  const { isPending: updateBrandPending, mutate: updateBrandMutation } =
    useMutationData(
      ['update-brand'],
      (data: any) => updateBrand(brandId, data),
      'brands',
      (data: any) => {
        console.log('brand data', data)
        onOpenChange(false)
        form.reset()
        toast({
          title: ` ${isUpdate ? 'Updated' : 'Created'} successfully`,
          description: (
            <pre className='mt-2 w-[340px] rounded-md bg-orange-500 p-4'>
              <code className='text-white '>
                {isUpdate
                  ? 'Brand updated successfully.'
                  : 'Brand created successfully.'}
              </code>
            </pre>
          ),
          variant: 'success',
        })
      }
    )
  console.log('isUpdate', isUpdate)
  console.log('currentRow', currentRow)
  const [logoPreview, setLogoPreview] = useState<string | null>(
    currentRow?.logo || null
  )

  const handleFileUpload = async (files: File[]) => {
    if (files.length > 0) {
      const file = files[0]
      form.setValue('logo', file)

      // Create preview URL for the new file
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const form = useForm<BrandsForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brand: currentRow?.brand ?? '',
      status: currentRow?.status ?? true,
      logo: undefined, // We'll handle the logo separately since it comes as a string URL
    },
  })

  const onSubmit = (data: BrandsForm) => {
    const formData = new FormData()
    formData.append('brand', data.brand)
    formData.append('status', String(data.status))
    console.log('data.logo', data.logo)
    if (data.logo instanceof File) {
      formData.append('logo', data.logo)
    }

    if (isUpdate) {
      updateBrandMutation(formData)
      return
    }
    createBrandMutation(formData)
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v)
        form.reset()
      }}
    >
      <SheetContent className='flex flex-col'>
        <SheetHeader className='text-left'>
          <SheetTitle>{isUpdate ? 'Update' : 'Create'} Brand</SheetTitle>
          <SheetDescription>
            {isUpdate
              ? 'Update the brand by providing necessary info.'
              : 'Add a new brand by providing necessary info.'}
            Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            id='brand-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-5 flex-1'
          >
            <FormField
              control={form.control}
              name='brand'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Brand</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Enter a brand' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='grid gap-4 py-4'>
              {logoPreview && (
                <div className='grid grid-cols-4 items-center gap-4'>
                  <FormLabel className='text-right'>Current Logo</FormLabel>
                  <div className='col-span-3'>
                    <img
                      src={logoPreview}
                      alt='Logo Preview'
                      className='h-20 w-20 rounded-md object-cover'
                    />
                  </div>
                </div>
              )}
              <FormField
                control={form.control}
                name='logo'
                render={({ field }) => (
                  <div className='items-center gap-4'>
                    <div className='col-span-3'>
                      <FileUpload onChange={handleFileUpload} />
                    </div>
                  </div>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name='status'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                  <div className='space-y-0.5'>
                    <FormLabel className='text-base'>Status</FormLabel>
                    <FormDescription>
                      Brand will be {field.value ? 'active' : 'inactive'}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant='outline'>Close</Button>
          </SheetClose>
          <Button
            loading={isUpdate ? updateBrandPending : createBrandPending}
            disabled={isUpdate ? updateBrandPending : createBrandPending}
            form='brand-form'
            type='submit'
          >
            Save changes
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
