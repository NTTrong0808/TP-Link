import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { IFilterDataType, IFilterItem } from './types'

type TOption = {
  value: string
  label: string
}

export interface FilterSelectProps {
  clearFilters: () => void
}

type Props = {
  options: TOption[]
  fieldName: string
  onFilterChange: (option: IFilterItem) => void
  defaultValue?: IFilterItem
  type: IFilterDataType
}

const FilterSelect = forwardRef<FilterSelectProps, Props>(
  ({ options, onFilterChange, fieldName, defaultValue, type }, ref) => {
    const allOptions = [{ label: 'Tất cả', value: 'all' }, ...options]
    const [selectedValue, setSelectedValue] = useState<string>(defaultValue?.value?.toString() ?? 'all')

    // Sync with defaultValue when it changes
    useEffect(() => {
      setSelectedValue(defaultValue?.value?.toString() ?? 'all')
    }, [defaultValue])

    const handleChange = (value: string) => {
      setSelectedValue(value)
      onFilterChange({
        field: fieldName,
        value: value === 'all' ? null : value,
        type: type ?? 'objectId',
      })
    }

    const clearFilters = () => {
      setSelectedValue('all')
    }

    useImperativeHandle(ref, () => ({ clearFilters }))

    return (
      <Select value={selectedValue} onValueChange={handleChange}>
        <SelectTrigger className="!h-8 bg-white">
          <SelectValue placeholder="Giá trị" className="!h-8 !bg-white" />
        </SelectTrigger>
        <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2">
          {allOptions.map((option) => (
            <SelectItem key={`${fieldName}-${option.value}`} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
          {options.length === 0 && (
            <p className="text-sm text-neutral-grey-300 text-center w-full py-4 mx-auto">Không có</p>
          )}
        </SelectContent>
      </Select>
    )
  },
)

FilterSelect.displayName = 'FilterSelect'

export default FilterSelect
