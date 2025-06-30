import { useEffect, useState } from 'react'
import { ColumnDefExtend } from '../advanced-table'
import { Button } from './button'
import { Checkbox } from './checkbox'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from './dialog'

type Props = {
  columns: ColumnDefExtend<any>[]
  onSaveColsSetting: (columns: ColumnDefExtend<any>[]) => void
}
const ColsSetting = ({ columns, onSaveColsSetting }: Props) => {
  const [updatedColumns, setUpdatedColumns] = useState<ColumnDefExtend<any>[]>(columns ?? [])
  const [openDialog, setOpenDialog] = useState<boolean>(false)

  const handleCheckOrUnCheckColumns = (accessorKey: string, check?: boolean) => {
    const temp = [...updatedColumns]
    const index = temp.findIndex((e) => (e as any)?.accessorKey === accessorKey)
    if (index !== -1) {
      temp[index].isActive = check ?? false
    }
    setUpdatedColumns(temp)
  }
  const handleSaveColsSetting = () => {
    onSaveColsSetting(updatedColumns)
    setOpenDialog(false)
  }

  useEffect(() => {
    setUpdatedColumns(columns)
  }, [columns])
  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger>
        <div className="bg-white px-3 h-[40px] rounded-md border border-neutral-grey-200 flex items-center gap-2 text-sm font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M10.3958 2.5975C10.0408 1.13417 7.95917 1.13417 7.60417 2.5975C7.37417 3.54333 6.29083 3.99167 5.46083 3.485C4.17417 2.70167 2.7025 4.17417 3.48583 5.46C3.60359 5.65313 3.67407 5.87133 3.69156 6.09685C3.70904 6.32236 3.67303 6.54882 3.58645 6.75779C3.49988 6.96676 3.36518 7.15233 3.19333 7.29941C3.02148 7.44648 2.81733 7.5509 2.5975 7.60417C1.13417 7.95917 1.13417 10.0408 2.5975 10.3958C2.81714 10.4492 3.02107 10.5537 3.19273 10.7008C3.36438 10.8479 3.49892 11.0333 3.58539 11.2422C3.67187 11.451 3.70785 11.6773 3.6904 11.9027C3.67296 12.1281 3.60258 12.3461 3.485 12.5392C2.70167 13.8258 4.17417 15.2975 5.46 14.5142C5.65313 14.3964 5.87133 14.3259 6.09685 14.3084C6.32236 14.291 6.54882 14.327 6.75779 14.4135C6.96676 14.5001 7.15233 14.6348 7.29941 14.8067C7.44648 14.9785 7.5509 15.1827 7.60417 15.4025C7.95917 16.8658 10.0408 16.8658 10.3958 15.4025C10.4492 15.1829 10.5537 14.9789 10.7008 14.8073C10.8479 14.6356 11.0333 14.5011 11.2422 14.4146C11.451 14.3281 11.6773 14.2922 11.9027 14.3096C12.1281 14.327 12.3461 14.3974 12.5392 14.515C13.8258 15.2983 15.2975 13.8258 14.5142 12.54C14.3964 12.3469 14.3259 12.1287 14.3084 11.9032C14.291 11.6776 14.327 11.4512 14.4135 11.2422C14.5001 11.0332 14.6348 10.8477 14.8067 10.7006C14.9785 10.5535 15.1827 10.4491 15.4025 10.3958C16.8658 10.0408 16.8658 7.95917 15.4025 7.60417C15.1829 7.55075 14.9789 7.44627 14.8073 7.29921C14.6356 7.15215 14.5011 6.96666 14.4146 6.75782C14.3281 6.54897 14.2922 6.32267 14.3096 6.09731C14.327 5.87195 14.3974 5.65388 14.515 5.46083C15.2983 4.17417 13.8258 2.7025 12.54 3.48583C12.3469 3.60359 12.1287 3.67407 11.9032 3.69156C11.6776 3.70904 11.4512 3.67303 11.2422 3.58645C11.0332 3.49988 10.8477 3.36518 10.7006 3.19333C10.5535 3.02148 10.4491 2.81733 10.3958 2.5975Z"
              stroke="#A7A7A7"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10.7678 10.7678C11.2366 10.2989 11.5 9.66304 11.5 9C11.5 8.33696 11.2366 7.70107 10.7678 7.23223C10.2989 6.76339 9.66304 6.5 9 6.5C8.33696 6.5 7.70107 6.76339 7.23223 7.23223C6.76339 7.70107 6.5 8.33696 6.5 9C6.5 9.66304 6.76339 10.2989 7.23223 10.7678C7.70107 11.2366 8.33696 11.5 9 11.5C9.66304 11.5 10.2989 11.2366 10.7678 10.7678Z"
              stroke="#A7A7A7"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Cài đặt hiển thị
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Cài đặt hiển thị</DialogTitle>
        <div className="flex flex-col w-full gap-8">
          <div className="flex flex-col w-full gap-3">
            <div className="flex font-medium">
              <div className="w-[80%]">Tên cột</div>
              <div className="w-[20%] flex items-center justify-center">Hiển thị</div>
            </div>
            <div className="flex w-full flex-col gap-3 max-h-[500px] overflow-auto">
              {columns.length === 0 && (
                <span className="w-full text-center text-sm text-neutral-grey-300">Không có</span>
              )}
              {updatedColumns.map((column) => (
                <div className="flex items-center" key={`cols-setting-${(column as any)?.accessorKey}`}>
                  <div className="w-[80%] px-3 py-2 rounded-md bg-[#F5F5F5]">{column.header as any}</div>
                  <div className="w-[20%] flex items-center justify-center">
                    <Checkbox
                      checked={column.isActive}
                      onCheckedChange={(checked) =>
                        handleCheckOrUnCheckColumns(
                          (column as any)?.accessorKey ?? '',
                          typeof checked === 'string' ? false : checked,
                        )
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-span-2 grid grid-cols-2 gap-4 mt-4">
            <Button
              type="button"
              variant="outline"
              className="col-span-1"
              size="lg"
              onClick={() => setOpenDialog(false)}
            >
              Huỷ
            </Button>
            <Button onClick={handleSaveColsSetting} type="submit" className="col-span-1" size="lg">
              Lưu
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ColsSetting
