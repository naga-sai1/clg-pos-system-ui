import { deleteSubCategory } from '@/api'
import { useMutationData } from '@/hooks/use-mutation-data'
import { toast } from '@/hooks/use-toast'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useSubCategories } from '../context/sub-categories-context'
import { SubCategoriesImportDialog } from './sub-categories-import-dialog'
import { SubCategoriesMutateDrawer } from './sub-categories-mutate-drawer'

export function SubCategoriesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useSubCategories()
  const subCategoryId = currentRow?.sub_category_id

  const {
    isPending: deleteSubCategoryPending,
    mutate: deleteSubCategoryMutation,
  } = useMutationData(
    ['delete-sub-category'],
    (data) => deleteSubCategory(data.sub_category_id),
    'sub-categories',
    () => {
      setOpen(null)
      setCurrentRow(null)
      toast({
        title: 'Sub Category deleted',
        description: 'Sub Category has been deleted successfully',
        variant: 'success',
      })
    }
  )

  const handleDeleteSubCategory = () => {
    if (!subCategoryId) return
    deleteSubCategoryMutation({ sub_category_id: subCategoryId })
  }

  return (
    <>
      <SubCategoriesMutateDrawer
        key='sub-category-create'
        open={open === 'create'}
        onOpenChange={() => {
          setOpen(null)
          setCurrentRow(null)
        }}
      />

      <SubCategoriesImportDialog
        key='sub-categories-import'
        open={open === 'import'}
        onOpenChange={() => {
          setOpen(null)
          setCurrentRow(null)
        }}
      />

      {currentRow && (
        <>
          <SubCategoriesMutateDrawer
            key={`sub-category-update-${currentRow.sub_category_id}`}
            open={open === 'update'}
            onOpenChange={() => {
              setOpen(null)
              setCurrentRow(null)
            }}
            currentRow={currentRow}
          />

          <ConfirmDialog
            key='sub-category-delete'
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen(null)
              setCurrentRow(null)
            }}
            className='max-w-md'
            title={`Delete Sub Category`}
            desc={
              <>
                Are you sure you want to delete sub-category{' '}
                <strong>{currentRow.sub_category}</strong>? <br />
                This action cannot be undone.
              </>
            }
            confirmText='Delete'
            destructive
            isLoading={deleteSubCategoryPending}
            handleConfirm={handleDeleteSubCategory}
          />
        </>
      )}
    </>
  )
}
