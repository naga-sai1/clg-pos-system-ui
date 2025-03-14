import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { SubCategory } from '../data/schema'

type SubCategoriesDialogType = 'create' | 'update' | 'delete' | 'import'

interface SubCategoriesContextType {
  open: SubCategoriesDialogType | null
  setOpen: (str: SubCategoriesDialogType | null) => void
  currentRow: SubCategory | null
  setCurrentRow: React.Dispatch<React.SetStateAction<SubCategory | null>>  
}

const SubCategoriesContext = React.createContext<SubCategoriesContextType | null>(null)

interface Props {
  children: React.ReactNode 
}

export default function SubCategoriesProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<SubCategoriesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<SubCategory | null>(null)
  return (
    <SubCategoriesContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </SubCategoriesContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useSubCategories = () => {
  const subCategoriesContext = React.useContext(SubCategoriesContext)

  if (!subCategoriesContext) {
    throw new Error('useSubCategories has to be used within <SubCategoriesContext>')
  }

  return subCategoriesContext
}
