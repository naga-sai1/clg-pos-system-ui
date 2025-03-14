import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { Unit } from '../data/schema'

type UnitsDialogType = 'create' | 'update' | 'delete' | 'import'

interface UnitsContextType {
  open: UnitsDialogType | null
  setOpen: (str: UnitsDialogType | null) => void
  currentRow: Unit | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Unit | null>>  
}

const UnitsContext = React.createContext<UnitsContextType | null>(null)

interface Props {
  children: React.ReactNode 
}

export default function UnitsProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<UnitsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Unit | null>(null)
  return (
    <UnitsContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </UnitsContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useUnits = () => {
  const unitsContext = React.useContext(UnitsContext) 

  if (!unitsContext) {
    throw new Error('useUnits has to be used within <UnitsContext>')
  }

  return unitsContext
}
