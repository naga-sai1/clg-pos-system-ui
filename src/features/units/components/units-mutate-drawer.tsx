import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createUnit, updateUnit } from '@/api'
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
import { Unit } from '../data/schema'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Unit
}

const formSchema = z.object({
  unit: z.string().min(1, 'Packs is required.'),
  short_name: z.string().min(1, 'Short name is required.').nullable(),
  status: z.boolean().default(true),
})
type UnitsForm = z.infer<typeof formSchema>

export function UnitsMutateDrawer({
  open,
  onOpenChange,
  currentRow,
}: Props) {
  const isUpdate = !!currentRow

  const unitId = currentRow?.unit_id  

  const { isPending: createUnitPending, mutate: createUnitMutation } =
    useMutationData(
      ['create-unit'],
      (data: any) => createUnit(data),
      'units',
      () => {
        onOpenChange(false)
        form.reset()
        toast({
          title: 'You submitted the following values:',
          description: (
            <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
              <code className='text-white '>
                Packs created successfully.
              </code>
            </pre>
          ),
          variant: 'success',
        })
      }
    )
  const { isPending: updateUnitPending, mutate: updateUnitMutation } =
    useMutationData(
      ['update-unit'],
      (data: any) => updateUnit(unitId, data),
      'units',
      () => {
        onOpenChange(false)
        form.reset()
        toast({
          title: ` ${isUpdate ? 'Updated' : 'Created'} successfully`,
          description: (
            <pre className='mt-2 w-[340px] rounded-md bg-orange-500 p-4'>
              <code className='text-white '>
                {isUpdate
                  ? 'Packs updated successfully.'
                  : 'Packs created successfully.'}
              </code>
            </pre>
          ),
          variant: 'success',
        })
      }
    )
  console.log('isUpdate', isUpdate)
  console.log('currentRow', currentRow)

  const form = useForm<UnitsForm>({
    resolver: zodResolver(formSchema),
    defaultValues: currentRow ?? {
      unit: '',
      short_name: '',
      status: true,
    },
  })

  const onSubmit = (data: UnitsForm) => {
    // createCategoryMutation(data)
    if (isUpdate) {
      updateUnitMutation(data)
      return
    }
    createUnitMutation(data)
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
          <SheetTitle>{isUpdate ? 'Update' : 'Create'} Pack</SheetTitle>
          <SheetDescription>
            {isUpdate
              ? 'Update the packs by providing necessary info.'
              : 'Add a new packs by providing necessary info.'}
            Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            id='unit-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-5 flex-1'
          >
            <FormField
              control={form.control}
              name='unit'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Packs</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Enter a packs' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='short_name'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Short Name</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} placeholder='Enter a short name' />
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
                      Packs will be {field.value ? 'active' : 'inactive'}
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
            loading={isUpdate ? updateUnitPending : createUnitPending}
            disabled={isUpdate ? updateUnitPending : createUnitPending}
            form='unit-form'
            type='submit'
          >
            Save changes
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
