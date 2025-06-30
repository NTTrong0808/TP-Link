'use client'

import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useDialoger } from '@/components/widgets/dialoger'
import { PanelViewHeader } from '@/layouts/panel/panel-view'
import { useSuspenseRoles } from '@/lib/api/queries/role/get-roles'
import { USER_STATUS } from '@/lib/api/queries/user/constant'
import { useUsers } from '@/lib/api/queries/user/get-users'
import { cn } from '@/lib/tw'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import compact from 'lodash/compact'
import { AlertCircle, FilterIcon } from 'lucide-react'
import { ComponentProps } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { useDebounce } from 'react-use'
import { z } from 'zod'
import { useFilter } from '../../../hooks/use-filter'
import { useSearch } from '../../../hooks/use-search'
import { useTotalUsers } from '../hooks/use-total-users'
import CreateUserForm from './create-user-form'

const statusOptions = [
  { value: USER_STATUS.activated, label: 'Hoạt động' },
  { value: USER_STATUS.deactivated, label: 'Tạm dừng' },
]

const statusOptionsMap = new Map(statusOptions.map((s) => [s.value, s]))

export const schema = z.object({
  search: z.string().optional(),
  status: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
  role: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
})

export interface UserListFilterProps extends ComponentProps<typeof PanelViewHeader> {}

const UserListFilter = (props: UserListFilterProps) => {
  const ql = useQueryClient()
  const { addDialoger } = useDialoger()
  const { total } = useTotalUsers()

  const { data: roles = [] } = useSuspenseRoles({
    select: (resp) =>
      resp?.data?.map((role) => ({
        value: role?._id || '',
        label: role?.name || '',
      })),
  })

  const [search, setSearch] = useSearch()
  const [filter, setFilter] = useFilter()

  const defaultStatus = filter.status?.map((s) => statusOptionsMap.get(s)) || []
  const defaultRole = filter.role.map((roleId) => roles.find((role) => role.value === roleId))

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      search: search ?? '',
      status: defaultStatus,
      role: defaultRole,
    },
  })

  const [wSearch, wStatus, wRole] = useWatch({
    control: form.control,
    name: ['search', 'status', 'role'],
  })

  useDebounce(
    () => {
      setSearch(wSearch ?? '')
    },
    200,
    [wSearch],
  )

  const handleAddUserDialog = () => {
    addDialoger({
      title: 'Thêm người dùng',
      content: (
        <CreateUserForm
          onCompleted={() => {
            ql.invalidateQueries({ queryKey: useUsers.getKey() })
          }}
        />
      ),
      variant: 'dialog',
    })
  }

  useDebounce(
    () => {
      setFilter({
        status: compact(wStatus?.map((s) => s.value) || []),
        role: compact(wRole?.map((v) => v.value) || []),
      })
    },
    200,
    [wStatus, wRole],
  )

  const hasFiltered = filter.status?.length > 0

  return (
    <ErrorBoundary
      fallback={
        <div className="text-semantic-danger-300 p-2 flex items-center gap-4">
          <AlertCircle className="size-5 mr-2" />
          Lỗi khi tải dữ liệu bộ lọc
        </div>
      }
    >
      <FormProvider {...form}>
        <PanelViewHeader
          title="Danh sách"
          // action={
          //   <Button size="lg" onClick={handleAddUserDialog}>
          //     <PlusIcon className="size-6 mr-1" />
          //     Thêm người dùng
          //   </Button>
          // }
          badge={total}
        >
          <div className="flex shrink-0 gap-3">
            <Field
              component="search"
              name="search"
              size="lg"
              placeholder="Tìm tên người dùng, sđt, email"
              containerClassName="w-[300px]"
            />

            <Popover>
              <PopoverTrigger asChild>
                <Button size="lg" variant="outline" className="bg-neutral-white">
                  <FilterIcon
                    className={cn('size-5 mr-2 text-neutral-grey-300', hasFiltered ? 'fill-neutral-grey-300' : null)}
                  />
                  Bộ lọc
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="p-0 w-[400px]">
                <section className="px-4 py-2 border-b border-low">
                  <h2 className="text-base font-medium leading-6 text-neutral-black">Bộ lọc</h2>
                </section>
                <section className="p-4">
                  <Label className="flex items-center gap-4">
                    <span className="w-20 shrink-0 font-medium">Vai trò:</span>
                    <div className="w-full">
                      <Field
                        component="multiselect"
                        name="role"
                        options={roles || []}
                        placeholder="Chọn vai trò"
                        emptyIndicator="Không có vai trò"
                        className="w-full"
                      />
                    </div>
                  </Label>
                </section>

                <section className="p-4">
                  <Label className="flex items-center gap-4">
                    <span className="w-20 shrink-0 font-medium">Trạng thái:</span>
                    <div className="w-full">
                      <Field
                        component="multiselect"
                        name="status"
                        options={statusOptions}
                        placeholder="Chọn trạng thái"
                        emptyIndicator="Không có trạng thái"
                        className="w-full"
                      />
                    </div>
                  </Label>
                </section>
              </PopoverContent>
            </Popover>
          </div>
        </PanelViewHeader>
      </FormProvider>
    </ErrorBoundary>
  )
}

export default UserListFilter
