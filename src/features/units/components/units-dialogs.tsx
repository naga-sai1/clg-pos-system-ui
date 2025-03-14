import { deleteUnit } from '@/api'
import { useMutationData } from '@/hooks/use-mutation-data'
import { toast } from '@/hooks/use-toast'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useUnits } from '../context/units-context'
import { UnitsImportDialog } from './units-import-dialog'
import { UnitsMutateDrawer } from './units-mutate-drawer'

export function UnitsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useUnits()
  const unitId = currentRow?.unit_id

  const { isPending: deleteUnitPending, mutate: deleteUnitMutation } =
    useMutationData(
      ['delete-unit'],
      (data) => deleteUnit(data.unit_id),
      'units',
      () => {
        setOpen(null)
        setCurrentRow(null)
        toast({
          title: 'Unit deleted',
          description: 'Unit has been deleted successfully',
          variant: 'success',
        })
      }
    )

  const handleDeleteUnit = () => {
    if (!unitId) return
    deleteUnitMutation({ unit_id: unitId })
  }

  return (
    <>
      <UnitsMutateDrawer
        key='unit-create'
        open={open === 'create'}
        onOpenChange={() => {
          setOpen(null)
          setCurrentRow(null)
        }}
      />

      <UnitsImportDialog
        key='units-import'
        open={open === 'import'}
        onOpenChange={() => {
          setOpen(null)
          setCurrentRow(null)
        }}
      />

      {currentRow && (
        <>
          <UnitsMutateDrawer
            key={`unit-update-${currentRow.unit_id}`}
            open={open === 'update'}
            onOpenChange={() => {
              setOpen(null)
              setCurrentRow(null)
            }}
            currentRow={currentRow}
          />

          <ConfirmDialog
            key='unit-delete'
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen(null)
              setCurrentRow(null)
            }}
            className='max-w-md'
            title={`Delete Unit`}
            desc={
              <>
                Are you sure you want to delete unit{' '}
                <strong>{currentRow.unit}</strong>? <br />
                This action cannot be undone.
              </>
            }
            confirmText='Delete'
            destructive
            isLoading={deleteUnitPending}
            handleConfirm={handleDeleteUnit}
          />
        </>
      )}
    </>
  )
}
