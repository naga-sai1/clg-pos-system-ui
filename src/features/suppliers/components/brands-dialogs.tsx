//@ts-nocheck
import { deleteBrand, deleteCategory } from '@/api'
import { useMutationData } from '@/hooks/use-mutation-data'
import { toast } from '@/hooks/use-toast'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useBrands } from '../context/brands-context'
import { BrandsImportDialog } from './brands-import-dialog'
import { BrandsMutateDrawer } from './brands-mutate-drawer'

export function BrandsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useBrands()
  const brandId = currentRow?.brand_id

  const { isPending: deleteBrandPending, mutate: deleteBrandMutation } =
    useMutationData(
      ['delete-brand'],
      (data) => deleteBrand(data.brand_id),
      'brands',
      () => {
        setOpen(null)
        setCurrentRow(null)
        toast({
          title: 'Brand deleted',
          description: 'Brand has been deleted successfully',
          variant: 'success',
        })
      }
    )

  const handleDeleteBrand = () => {
    if (!brandId) return
    deleteBrandMutation({ brand_id: brandId })
  }

  return (
    <>
      <BrandsMutateDrawer
        key='brand-create'
        open={open === 'create'}
        onOpenChange={() => {
          setOpen(null)
          setCurrentRow(null)
        }}
      />

      <BrandsImportDialog
        key='brands-import'
        open={open === 'import'}
        onOpenChange={() => {
          setOpen(null)
          setCurrentRow(null)
        }}
      />

      {currentRow && (
        <>
          <BrandsMutateDrawer
            key={`brand-update-${currentRow.brand_id}`}
            open={open === 'update'}
            onOpenChange={() => {
              setOpen(null)
              setCurrentRow(null)
            }}
            currentRow={currentRow}
          />

          <ConfirmDialog
            key='brand-delete'
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen(null)
              setCurrentRow(null)
            }}
            className='max-w-md'
            title={`Delete Brand`}
            desc={
              <>
                Are you sure you want to delete brand{' '}
                <strong>{currentRow.brand}</strong>? <br />
                This action cannot be undone.
              </>
            }
            confirmText='Delete'
            destructive
            isLoading={deleteBrandPending}
            handleConfirm={handleDeleteBrand}
          />
        </>
      )}
    </>
  )
}
