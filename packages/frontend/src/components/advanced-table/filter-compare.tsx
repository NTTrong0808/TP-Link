'use client'

import { cn } from '@/lib/tw'
import { forwardRef, ReactNode, useImperativeHandle, useRef, useState } from 'react'
import { Input } from '../ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { DatePicker, FilterDateProps } from './date-picker'
import CaretDownIcon from './icons/caret-down-icon'
import ContainIcon from './icons/contain-icon'
import EmptyIcon from './icons/empty-icon'
import EndWithIcon from './icons/end-with-icon'
import EqualIcon from './icons/equal-icon'
import GreaterThanEqualIcon from './icons/greater-than-equal-icon'
import GreaterThanIcon from './icons/greater-than-icon'
import LessThanEqualIcon from './icons/less-than-equal-icon'
import LessThanIcon from './icons/less-than-icon'
import NotContainIcon from './icons/not-contain-icon'
import NotEmptyIcon from './icons/not-empty-icon'
import StartWithIcon from './icons/start-with-icon'
import { IFilterDataType, IFilterOperator, IFilterOperatorType } from './types'

export interface FilterCompareProps {
  clearFilters: () => void
}

type Props = {
  type: IFilterDataType
  className?: string
  fieldName: string
  onFilterChange: (option: IFilterOperatorType) => void
  defaultValue?: IFilterOperatorType
}

type TOption = {
  value: IFilterOperator
  icon: ReactNode
  label: string
}

const mappingOperatorIcon = (operator: IFilterOperator): TOption => {
  return ([
    { label: 'Bằng', icon: <EqualIcon />, value: 'equal' },
    { label: 'Chứa', icon: <ContainIcon />, value: 'contain' },
    { label: 'Không chứa', icon: <NotContainIcon />, value: 'notContain' },
    { label: 'Bắt đầu bằng', icon: <StartWithIcon />, value: 'startWith' },
    { label: 'Kết thúc bằng', icon: <EndWithIcon />, value: 'endWith' },
    { label: 'Rỗng', icon: <EmptyIcon />, value: 'empty' },
    { label: 'Không rỗng', icon: <NotEmptyIcon />, value: 'notEmpty' },
    { label: 'Nhỏ hơn', icon: <LessThanIcon />, value: 'lessThan' },
    { label: 'Nhỏ hơn hoặc bằng', icon: <LessThanEqualIcon />, value: 'lessThanEqual' },
    { label: 'Lớn hơn', icon: <GreaterThanIcon />, value: 'greaterThan' },
    { label: 'Lớn hơn hoặc bằng', icon: <GreaterThanEqualIcon />, value: 'greaterThanEqual' },
  ].find((e) => e.value === operator) ?? { label: 'Bằng', icon: <EqualIcon />, value: 'equal' }) as TOption
}
const textCompareOptions: TOption[] = [
  { label: 'Bằng', icon: <EqualIcon />, value: 'equal' },
  { label: 'Chứa', icon: <ContainIcon />, value: 'contain' },
  { label: 'Không chứa', icon: <NotContainIcon />, value: 'notContain' },
  { label: 'Bắt đầu bằng', icon: <StartWithIcon />, value: 'startWith' },
  { label: 'Kết thúc bằng', icon: <EndWithIcon />, value: 'endWith' },
  { label: 'Rỗng', icon: <NotEmptyIcon />, value: 'empty' },
  { label: 'Không rỗng', icon: <EmptyIcon />, value: 'notEmpty' },
]

const numberOrDateCompareOptions: TOption[] = [
  { label: 'Bằng', icon: <EqualIcon />, value: 'equal' },
  { label: 'Nhỏ hơn', icon: <LessThanIcon />, value: 'lessThan' },
  { label: 'Nhỏ hơn hoặc bằng', icon: <LessThanEqualIcon />, value: 'lessThanEqual' },
  { label: 'Lớn hơn', icon: <GreaterThanIcon />, value: 'greaterThan' },
  { label: 'Lớn hơn hoặc bằng', icon: <GreaterThanEqualIcon />, value: 'greaterThanEqual' },
  { label: 'Rỗng', icon: <NotEmptyIcon />, value: 'empty' },
  { label: 'Không rỗng', icon: <EmptyIcon />, value: 'notEmpty' },
]
const FilterCompare = forwardRef<FilterCompareProps, Props>(
  ({ type, className, fieldName, onFilterChange, defaultValue }, ref) => {
    const dateRef = useRef<FilterDateProps>(null)

    const [choosenOption, setChoosenOption] = useState<TOption>(
      defaultValue?.operator
        ? mappingOperatorIcon(defaultValue?.operator)
        : type === 'date' || type === 'dateUnix' || type === 'dateString'
        ? {
            label: 'Bằng',
            icon: <EqualIcon />,
            value: 'equal',
          }
        : type === 'number'
        ? { label: 'Nhỏ hơn hoặc bằng', icon: <LessThanEqualIcon />, value: 'lessThanEqual' }
        : { label: 'Chứa', icon: <ContainIcon />, value: 'contain' },
    )
    const [openPopOver, setOpenPopover] = useState<boolean>(false)
    const [inputValue, setInputValue] = useState<string | number | null>(defaultValue?.value ?? '')

    const handleSubmit = (value: string | number | null = inputValue, option: TOption = choosenOption) => {
      onFilterChange({
        field: fieldName,
        operator: option.value,
        type: type as IFilterDataType,
        value:
          option?.value === 'empty' || option?.value === 'notEmpty'
            ? ''
            : value
            ? type === 'string'
              ? `${value}`?.trim()
              : type === 'number'
              ? Number(value)
              : value
            : null,
      })
    }

    const handleChangeOption = (option: TOption) => {
      setChoosenOption(option)
      setOpenPopover(false)
      handleSubmit(inputValue, option) // Submit with new option and current input
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value)
    }

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleSubmit()
      }
    }

    const clearFilters = () => {
      setInputValue('')
      dateRef?.current?.clearFilters()
    }

    useImperativeHandle(ref, () => ({ clearFilters }))

    return (
      <div className={cn('bg-white h-8 rounded-sm flex items-center border border-neutral-grey-200', className)}>
        <Popover open={openPopOver} onOpenChange={setOpenPopover}>
          <PopoverTrigger>
            <div className="p-2 flex items-center gap-2 border-r-[1px] border-neutral-grey-200 h-8">
              <div className="w-5 h-5 flex items-center justify-center rounded-sm bg-green-50">
                {choosenOption.icon}
              </div>
              <CaretDownIcon />
            </div>
          </PopoverTrigger>
          <PopoverContent className="p-2">
            {(type === 'string' ? textCompareOptions : numberOrDateCompareOptions).map((option, index, arr) => (
              <div className="flex flex-col gap-2" key={option.value}>
                <div
                  className="flex items-center gap-1 hover:cursor-pointer"
                  onClick={() => handleChangeOption(option)}
                >
                  <div className="p-1 rounded-sm bg-green-50">{option.icon}</div>
                  <span>{option.label}</span>
                </div>
                {index !== arr.length - 1 && <div className="w-full h-[1px] bg-neutral-grey-100"></div>}
              </div>
            ))}
          </PopoverContent>
        </Popover>

        {(type === 'date' || type === 'dateUnix' || type === 'dateString') && (
          <DatePicker
            ref={dateRef}
            clearable
            defaultValue={defaultValue?.value ?? undefined}
            value={inputValue}
            onChange={(value) => {
              setInputValue(value as any)
              handleSubmit(value as any)
            }}
          />
        )}

        {(type === 'string' || type === 'number') && (
          <Input
            defaultValue={defaultValue?.value ?? undefined}
            type={type === 'number' ? 'number' : 'text'}
            disabled={choosenOption?.value === 'empty' || choosenOption?.value === 'notEmpty'}
            className="h-8 outline-none !border-l-[0px] !border-r-[0px] border-t-[1px] border-b-[1px] rounded-l-none rounded-r-sm max-w-full"
            value={inputValue ?? ''}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
          />
        )}
      </div>
    )
  },
)

FilterCompare.displayName = 'FilterCompare'

export default FilterCompare
