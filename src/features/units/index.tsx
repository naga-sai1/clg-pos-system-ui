//@ts-nocheck
import {  getAllUnits } from '@/api'
import { useQueryData } from '@/hooks/use-query-data'
import ModernTableSkeleton from '@/components/custom/table-skeleton'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { columns } from './components/columns'
import { DataTable } from './components/data-table'
import { UnitsDialogs } from './components/units-dialogs'
import { UnitsPrimaryButtons } from './components/units-primary-buttons'
import UnitsProvider from './context/units-context'

export default function Units() {
  const { data: units, isLoading } = useQueryData(['units'], getAllUnits)

  return (
    <UnitsProvider>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex items-center justify-between space-y-2 flex-wrap gap-x-4'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Packs</h2>
            <p className='text-muted-foreground'>Manage your packs</p>
          </div>
          <UnitsPrimaryButtons />

        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          {isLoading ? (
            <ModernTableSkeleton />
          ) : (
            <DataTable data={units || []} columns={columns} />
          )}
        </div>
      </Main>

      <UnitsDialogs />
    </UnitsProvider>
  )
}
