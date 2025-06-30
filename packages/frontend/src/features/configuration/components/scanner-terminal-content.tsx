import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent } from '@/components/ui/popover'
import { useDialoger } from '@/components/widgets/dialoger'
import FilterIcon from '@/components/widgets/icons/filter-icon'
import PlusIcon from '@/components/widgets/icons/plus-icon'
import { useGetScannerTerminals } from '@/lib/api/queries/scanner-terminal/get-scanner-terminals'
import { ScannerTerminalStatus } from '@/lib/api/queries/scanner-terminal/schema'
import { useCanAccess } from '@/lib/auth/casl'
import { CASL_ACCESS_KEY } from '@/lib/auth/casl-key'
import { cn } from '@/lib/tw'
import { PopoverTrigger } from '@radix-ui/react-popover'
import { useQueryClient } from '@tanstack/react-query'
import compact from 'lodash/compact'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { useDebounce } from 'react-use'
import { useFilter } from '../hooks/use-filter'
import AddScannerTerminal from './add-scanner-terminal'
import ScannerTerminalList from './scanner-terminal-list'

const statusOptions = [
  {
    value: ScannerTerminalStatus.ACTIVED,
    label: 'Đang hoạt động',
  },
  {
    value: ScannerTerminalStatus.INACTIVED,
    label: 'Ngừng hoạt động',
  },
  {
    value: ScannerTerminalStatus.MAINTENANCE,
    label: 'Bảo trì',
  },
]

const ScannerTerminalContent = () => {
  const ql = useQueryClient()
  const { addDialoger } = useDialoger()
  const isCanAccess = useCanAccess()

  const isHavePermissionCreateScanner = isCanAccess(CASL_ACCESS_KEY.TICKET_SCANNER_TERMINAL_CREATE)

  const [filter, setFilter] = useFilter()
  const methods = useForm({
    defaultValues: {
      search: filter?.search ?? '',
      status: statusOptions.filter((status) => filter?.status.includes(status.value)),
    },
  })

  const handleAddScannerTerminal = () => {
    addDialoger({
      title: 'Thêm Scanner',
      content: (
        <AddScannerTerminal
          onCompleted={async () => {
            await Promise.all([ql.invalidateQueries({ queryKey: useGetScannerTerminals.getKey() })])
          }}
        />
      ),
      variant: 'dialog',
    })
  }

  const [wSearch, wStatus] = useWatch({
    control: methods.control,
    name: ['search', 'status'],
  })

  useDebounce(
    () => {
      setFilter({
        status: wStatus ? compact(wStatus?.map((s: any) => s.value) || []) : [],
        search: wSearch ?? '',
      })
    },
    200,
    [wStatus, wSearch],
  )

  const hasFiltered = filter.status?.length > 0

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <div className="w-full flex items-center justify-between">
        <FormProvider {...methods}>
          <div className="flex items-center gap-3">
            <Field component="text" name="search" placeholder="Tìm ID, Tên máy scanner" className="max-w-[300px]" />
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
                <section className="p-4 flex flex-col gap-4">
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
        </FormProvider>
        {isHavePermissionCreateScanner && (
          <Button onClick={handleAddScannerTerminal} className="text-sm font-semibold">
            <PlusIcon className="w-6 h-6 min-w-6 min-h-6 text-white [&_path]:stroke-white" />
            Thêm Scanner
          </Button>
        )}
      </div>
      <ScannerTerminalList />
    </div>
  )
}

export default ScannerTerminalContent
