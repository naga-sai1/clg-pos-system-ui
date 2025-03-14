import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createCategory, updateCategory } from '@/api'
import { useMutationData } from '@/hooks/use-mutation-data'
import { toast } from '@/hooks/use-toast'
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
import { Category } from '../data/schema'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Category
}

const formSchema = z.object({
  category: z.string().min(1, 'Category is required.'),
  category_slug: z.string().min(1, 'Category slug is required.'),
  status: z.boolean().default(true),
})
type CategoriesForm = z.infer<typeof formSchema>

export function CategoriesMutateDrawer({
  open,
  onOpenChange,
  currentRow,
}: Props) {
  const isUpdate = !!currentRow

  const categoryId = currentRow?.category_id

  const { isPending: createCategoryPending, mutate: createCategoryMutation } =
    useMutationData(
      ['create-category'],
      (data: any) => createCategory(data),
      'categories',
      () => {
        onOpenChange(false)
        form.reset()
        toast({
          title: 'You submitted the following values:',
          description: (
            <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
              <code className='text-white '>
                Category created successfully.
              </code>
            </pre>
          ),
          variant: 'success',
        })
      }
    )
  const { isPending: updateCategoryPending, mutate: updateCategoryMutation } =
    useMutationData(
      ['update-category'],
      (data: any) => updateCategory(categoryId, data),
      'categories',
      () => {
        onOpenChange(false)
        form.reset()
        toast({
          title: ` ${isUpdate ? 'Updated' : 'Created'} successfully`,
          description: (
            <pre className='mt-2 w-[340px] rounded-md bg-orange-500 p-4'>
              <code className='text-white '>
                {isUpdate
                  ? 'Category updated successfully.'
                  : 'Category created successfully.'}
              </code>
            </pre>
          ),
          variant: 'success',
        })
      }
    )
  console.log('isUpdate', isUpdate)
  console.log('currentRow', currentRow)

  const form = useForm<CategoriesForm>({
    resolver: zodResolver(formSchema),
    defaultValues: currentRow ?? {
      category: '',
      category_slug: '',
      status: true,
    },
  })

  const onSubmit = (data: CategoriesForm) => {
    // createCategoryMutation(data)
    if (isUpdate) {
      updateCategoryMutation(data)
      return
    }
    createCategoryMutation(data)
    console.log('onSubmit', data)
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
          <SheetTitle>{isUpdate ? 'Update' : 'Create'} Category</SheetTitle>
          <SheetDescription>
            {isUpdate
              ? 'Update the category by providing necessary info.'
              : 'Add a new category by providing necessary info.'}
            Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            id='category-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-5 flex-1'
          >
            <FormField
              control={form.control}
              name='category'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Enter a category' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='category_slug'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Category Slug</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Enter a category slug' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='status'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                  <div className='space-y-0.5'>
                    <FormLabel className='text-base'>Status</FormLabel>
                    <FormDescription>
                      Category will be {field.value ? 'active' : 'inactive'}
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
            loading={isUpdate ? updateCategoryPending : createCategoryPending}
            disabled={isUpdate ? updateCategoryPending : createCategoryPending}
            form='category-form'
            type='submit'
          >
            Save changes
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
