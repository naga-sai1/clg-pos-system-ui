//@ts-nocheck
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createSubCategory, getAllCategories, updateSubCategory } from '@/api'
import { storage } from '@/lib/storage'
import { useMutationData } from '@/hooks/use-mutation-data'
import { useQueryData } from '@/hooks/use-query-data'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/custom/button'
import { SubCategory } from '../data/schema'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: SubCategory
}

const formSchema = z.object({
  sub_category: z.string().min(1, 'Sub category is required.'),
  description: z.string(),
  status: z.boolean().default(true),
  category: z.string(),
})
type SubCategoriesForm = z.infer<typeof formSchema>

export function SubCategoriesMutateDrawer({
  open,
  onOpenChange,
  currentRow,
}: Props) {
  const isUpdate = !!currentRow

  const { data: categories, isLoading: categoriesLoading } = useQueryData(
    ['categories'],
    getAllCategories
  )

  const subCategoryId = currentRow?.sub_category_id
  const user = storage.getUser()
  const {
    isPending: createSubCategoryPending,
    mutate: createSubCategoryMutation,
  } = useMutationData(
    ['create-sub-category'],
    (data: any) => createSubCategory(data),
    'sub-categories',
    () => {
      onOpenChange(false)
      form.reset()
      toast({
        title: 'You submitted the following values:',
        description: (
          <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
            <code className='text-white '>
              Sub Category created successfully.
            </code>
          </pre>
        ),
        variant: 'success',
      })
    }
  )
  const {
    isPending: updateSubCategoryPending,
    mutate: updateSubCategoryMutation,
  } = useMutationData(
    ['update-sub-category'],
    (data: any) => updateSubCategory(subCategoryId, data),
    'sub-categories',
    () => {
      onOpenChange(false)
      form.reset()
      toast({
        title: ` ${isUpdate ? 'Updated' : 'Created'} successfully`,
        description: (
          <pre className='mt-2 w-[340px] rounded-md bg-orange-500 p-4'>
            <code className='text-white '>
              {isUpdate
                ? 'Sub Category updated successfully.'
                : 'Sub Category created successfully.'}
            </code>
          </pre>
        ),
        variant: 'success',
      })
    }
  )
  console.log('isUpdate', isUpdate)
  console.log('currentRow', currentRow)

  const form = useForm<SubCategoriesForm>({
    resolver: zodResolver(formSchema),
    defaultValues: currentRow ?? {
      sub_category: '',
      description: '',
      status: true,
      category: '',
    },
  })

  const onSubmit = (data: SubCategoriesForm) => {
    console.log('data', data)
    // createCategoryMutation(data)
    if (isUpdate) {
      updateSubCategoryMutation(data)
      return
    }
    const createSubCategoryData = {
      ...data,
      created_by: user?.userId,
    }
    createSubCategoryMutation(createSubCategoryData)
    console.log('onSubmit', createSubCategoryData)
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
          <SheetTitle>{isUpdate ? 'Update' : 'Create'} Sub Category</SheetTitle>
          <SheetDescription>
            {isUpdate
              ? 'Update the sub category by providing necessary info.'
              : 'Add a new sub category by providing necessary info.'}
            Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            id='sub-category-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-5 flex-1'
          >
            <FormField
              control={form.control}
              name='sub_category'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Sub Category</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Enter a sub category' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Sub Category Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder='Enter a sub category description'
                      className='min-h-[100px]'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='category'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Parent Category</FormLabel>
                  <Select
                    disabled={categoriesLoading}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select a parent category' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories
                        ?.filter((category) => category.category && category.category.trim() !== '')
                        .map((category: any) => (
                          <SelectItem
                            key={category.category_id}
                            value={category.category}
                          >
                            {category.category}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
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
                      Sub Category will be {field.value ? 'active' : 'inactive'}
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
            loading={
              isUpdate ? updateSubCategoryPending : createSubCategoryPending
            }
            disabled={
              isUpdate ? updateSubCategoryPending : createSubCategoryPending
            }
            form='sub-category-form'
            type='submit'
          >
            Save changes
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
