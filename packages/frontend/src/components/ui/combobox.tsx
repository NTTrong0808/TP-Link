/* eslint-disable jsx-a11y/role-has-required-aria-props */
'use client'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { fuzzyString } from '@/helper/string'
import { cn } from '@/lib/tw'
import { CheckIcon, ChevronDownIcon, PlusIcon, XIcon } from 'lucide-react'
import { ReactNode, useEffect, useId, useState } from 'react'

export interface ComboboxOption {
  label: ReactNode
  value: string
}

export type IReactNodeFunction = (option?: ComboboxOption) => ReactNode

export interface ComboboxProps {
  // defaultValue?: string;
  options: ComboboxOption[]
  placeholder?: string

  noDataFoundLabel?: string
  searchPlaceholder?: string

  addNewOptionLabel?: string
  onAddNewOption?: () => void

  value?: any
  onChange?: (value: any) => void

  className?: string
  customTriggerReactNode?: ReactNode | IReactNodeFunction
  allowClear?: boolean
  disabled?: boolean
}

export const Combobox = ({
  options,
  placeholder,
  searchPlaceholder,
  addNewOptionLabel,
  onAddNewOption,
  noDataFoundLabel,
  value: defaultValue,
  onChange,
  customTriggerReactNode,
  allowClear = true,
  ...props
}: ComboboxProps) => {
  const id = useId()
  const [open, setOpen] = useState<boolean>(false)
  const [value, setValue] = useState<string>(defaultValue ?? '')

  useEffect(() => {
    if (!defaultValue) return
    setValue(defaultValue)
  }, [defaultValue])

  const button = customTriggerReactNode ? (
    typeof customTriggerReactNode === 'function' ? (
      customTriggerReactNode(options.find((option) => option.value === value))
    ) : (
      customTriggerReactNode
    )
  ) : (
    <div
      id={id}
      role="combobox"
      aria-expanded={open}
      className={cn(
        'bg-neutral-white flex gap-1 items-center hover:cursor-pointer hover:bg-neutral-white rounded-md border-[1px] border-neutral-grey-200 w-full justify-between px-3 py-[6px] text-sm font-normal outline-offset-0 outline-none focus-visible:outline-[3px]',
        props?.disabled && 'cursor-not-allowed opacity-50 md:text-sm',
        props?.className,
      )}
    >
      <span className={cn('line-clamp-1', !value && 'text-neutral-grey-300')}>
        {value ? options.find((option) => option.value === value)?.label : placeholder ?? 'Select an option'}
      </span>
      {allowClear && (
        <div className="flex items-center gap-1">
          {value ? (
            <XIcon
              onClick={() => {
                const newValue = ''
                setValue(newValue)
                onChange?.(newValue)
                setOpen(false)
              }}
              aria-hidden="true"
              role="button"
              className="text-muted-foreground/80 shrink-0 size-4"
            />
          ) : null}

          <ChevronDownIcon size={16} className="text-muted-foreground/80 shrink-0 size-4" aria-hidden="true" />
        </div>
      )}
    </div>
  )
  if (props.disabled) return button
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{button}</PopoverTrigger>
      <PopoverContent
        className="border-neutral-grey-200 w-full min-w-[var(--radix-popper-anchor-width)] p-0"
        align="start"
      >
        <Command
          filter={(value, search, keywords) => {
            if (keywords?.some((keyword) => fuzzyString(search).test(keyword) || fuzzyString(search).test(value)))
              return 1
            return 0
          }}
        >
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{noDataFoundLabel ?? 'No data found'}</CommandEmpty>
            <CommandGroup>
              {options.map((organization) => (
                <CommandItem
                  key={organization.value}
                  value={organization.value}
                  onSelect={(currentValue: any) => {
                    const newValue = currentValue === value ? (allowClear ? '' : value) : currentValue
                    setValue(newValue)
                    onChange?.(newValue)
                    setOpen(false)
                  }}
                  keywords={[organization?.label?.toString() || '']}
                >
                  {organization.label}
                  {value === organization.value && <CheckIcon size={16} className="ml-auto" />}
                </CommandItem>
              ))}
            </CommandGroup>
            {onAddNewOption ? (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <Button variant="ghost" className="w-full justify-start font-normal">
                    <PlusIcon size={16} className="-ms-2 opacity-60" aria-hidden="true" />
                    {addNewOptionLabel ?? 'Add new option'}
                  </Button>
                </CommandGroup>
              </>
            ) : null}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
