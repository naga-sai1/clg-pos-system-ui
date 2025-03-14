import { deleteCategory } from '@/api'
import { useMutationData } from '@/hooks/use-mutation-data'
import { toast } from '@/hooks/use-toast'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useCategories } from '../context/categories-context'
import { CategoriesImportDialog } from './categories-import-dialog'
import { CategoriesMutateDrawer } from './categories-mutate-drawer'

export function CategoriesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useCategories()
  const categoryId = currentRow?.category_id

  const { isPending: deleteCategoryPending, mutate: deleteCategoryMutation } =
    useMutationData(
      ['delete-category'],
      (data) => deleteCategory(data.category_id),
      'categories',
      () => {
        setOpen(null)
        setCurrentRow(null)
        toast({
          title: 'Category deleted',
          description: 'Category has been deleted successfully',
          variant: 'success',
        })
      }
    )

  const handleDeleteCategory = () => {
    if (!categoryId) return
    deleteCategoryMutation({ category_id: categoryId })
  }

  return (
    <>
      <CategoriesMutateDrawer
        key='category-create'
        open={open === 'create'}
        onOpenChange={() => {
          setOpen(null)
          setCurrentRow(null)
        }}
      />

      <CategoriesImportDialog
        key='categories-import'
        open={open === 'import'}
        onOpenChange={() => {
          setOpen(null)
          setCurrentRow(null)
        }}
      />

      {currentRow && (
        <>
          <CategoriesMutateDrawer
            key={`category-update-${currentRow.category_id}`}
            open={open === 'update'}
            onOpenChange={() => {
              setOpen(null)
              setCurrentRow(null)
            }}
            currentRow={currentRow}
          />

          <ConfirmDialog
            key='category-delete'
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen(null)
              setCurrentRow(null)
            }}
            className='max-w-md'
            title={`Delete Category`}
            desc={
              <>
                Are you sure you want to delete category{' '}
                <strong>{currentRow.category}</strong>? <br />
                This action cannot be undone.
              </>
            }
            confirmText='Delete'
            destructive
            isLoading={deleteCategoryPending}
            handleConfirm={handleDeleteCategory}
          />
        </>
      )}
    </>
  )
}
