//@ts-nocheck
import { getAllCategories, getAllSubCategories } from '@/api'
import { useQueryData } from '@/hooks/use-query-data'
import ModernTableSkeleton from '@/components/custom/table-skeleton'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { SubCategoriesDialogs } from './components/sub-categories-dialogs'
import { SubCategoriesPrimaryButtons } from './components/sub-categories-primary-buttons'
import { columns } from './components/columns'
import { DataTable } from './components/data-table'
import SubCategoriesProvider from './context/sub-categories-context'

export default function SubCategories() {
  const { data: subcategories, isLoading } = useQueryData(
    ['sub-categories'],
    getAllSubCategories
  )

  return (
    <SubCategoriesProvider>
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
            <h2 className='text-2xl font-bold tracking-tight'>Sub Category</h2>
            <p className='text-muted-foreground'>Manage your sub categories</p>
          </div>
          <SubCategoriesPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          {isLoading ? (
            <ModernTableSkeleton />
          ) : (
            <DataTable data={subcategories || []} columns={columns} />
          )}
        </div>
      </Main>

      <SubCategoriesDialogs />
    </SubCategoriesProvider>
  )
}
