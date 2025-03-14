//@ts-nocheck
import { getAllBrands, getAllCategories } from '@/api'
import { useQueryData } from '@/hooks/use-query-data'
import ModernTableSkeleton from '@/components/custom/table-skeleton'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { BrandsDialogs } from './components/brands-dialogs'
import { BrandsPrimaryButtons } from './components/brands-primary-buttons'
import { columns } from './components/columns'
import { DataTable } from './components/data-table'
import BrandsProvider from './context/brands-context'

export default function Brands() {
  const { data: brands, isLoading } = useQueryData(['brands'], getAllBrands)
  console.log('brands', brands)
  return (
    <BrandsProvider>
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
            <h2 className='text-2xl font-bold tracking-tight'>Manufacturers</h2>
            <p className='text-muted-foreground'>Manage your Manufacturers</p>
          </div>
          <BrandsPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          {isLoading ? (
            <ModernTableSkeleton />
          ) : (
            <DataTable data={brands || []} columns={columns} />
          )}
        </div>
      </Main>

      <BrandsDialogs />
    </BrandsProvider>
  )
}
