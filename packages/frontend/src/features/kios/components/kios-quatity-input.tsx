import { useGetMediaFile } from '@/lib/api/queries/upload/queries/use-get-media-file'
import { cn } from '@/lib/tw'
import { formatInternationalCurrency } from '@/utils/currency'
import { FormControl, FormField, FormItem } from 'hookform-field'
import isNil from 'lodash/isNil'
import { Loader2, Minus, Plus } from 'lucide-react'
import Image from 'next/image'
import { ComponentProps, useEffect, useState } from 'react'
import { ControllerRenderProps, FieldValues } from 'react-hook-form'
import { useOrderActionsLogsStore } from '../store/use-order-action-logs'

export interface KiosQuantityInputProps extends ComponentProps<typeof FormItem> {
  name: string
  min?: number
  max?: number
  disabled?: boolean
  logo?: string
  title: string
  defaultPrice: number
}

const KiosQuantityInput = ({
  className,
  name,
  min,
  max,
  disabled = false,
  logo,
  title,
  defaultPrice,
  ...props
}: KiosQuantityInputProps) => {
  /**
   * Handles incrementing or decrementing the quantity value
   * @param field The form field controller props
   * @param type Whether to increment or decrement the value
   */
  const handleOnChange = (field: ControllerRenderProps<FieldValues, string>, type: 'increment' | 'decrement') => {
    const validatedValue = Number.isNaN(Number(field.value)) ? 0 : Number(field.value)

    const newValue = type === 'increment' ? validatedValue + 1 : validatedValue - 1

    if (!isNil(min) && newValue < min) return
    if (!isNil(max) && newValue > max) return

    field.onChange(newValue)

    logAction(type === 'decrement' ? 'Giảm số lượng dịch vụ' : 'Tăng số lượng dịch vụ', {
      name: title,
      quantity: newValue,
    })
  }

  /**
   * Validates and constrains a numeric value within the min/max bounds
   * @param value The input value to validate
   * @returns The validated numeric value constrained within min/max bounds
   */
  const getValue = (value: number | string) => {
    const numericValue = Number(value)

    if (isNil(min) && isNil(max)) {
      return numericValue
    }

    if (numericValue > Number(max)) {
      return max
    }

    if (numericValue < Number(min)) {
      return min
    }

    return numericValue
  }

  const logAction = useOrderActionsLogsStore((s) => s.logAction)

  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem {...props} className={cn('rounded-md', className)}>
          <div className="p-4 flex gap-4 items-center">
            <ServiceImage image={logo} />

            <div className="flex-1 text-sm font-semibold text-pretty">
              <p className="text-neutral-grey-600">{title}</p>
              <p className="text-green-500">{formatInternationalCurrency(defaultPrice)}</p>
            </div>
            <div className="flex items-center h-8">
              <button
                type="button"
                className="size-8 shrink-0 grid place-items-center bg-green-500 rounded-l-md disabled:bg-green-100 text-neutral-white disabled:text-green-300"
                onClick={() => handleOnChange(field, 'decrement')}
                disabled={
                  isNil(min) && disabled ? true : field.value === undefined ? true : Number(field.value) <= Number(min)
                }
              >
                <Minus className="size-4 text-inherit" />
              </button>

              <FormControl>
                <input
                  defaultValue={0}
                  {...field}
                  type="number"
                  className="min-w-15 appearance-none h-full text-center flex-1 outline-none text-base border-y border-neutral-grey-200"
                  min={min}
                  max={max}
                  onKeyDown={(e) => {
                    const value = (e.target as HTMLInputElement).value
                    if (value.startsWith('0')) {
                      ;(e.target as HTMLInputElement).value = Number(value).toString()
                    }
                  }}
                  onChange={(e) => {
                    field.onChange(getValue(e.target.value))
                    logAction('Nhập số lượng dịch vụ', {
                      name: title,
                      quantity: getValue(e.target.value),
                    })
                  }}
                />
              </FormControl>

              <button
                type="button"
                className="size-8 shrink-0 grid place-items-center bg-green-500 rounded-r-md disabled:bg-green-100 text-neutral-white disabled:text-green-300"
                onClick={() => handleOnChange(field, 'increment')}
                disabled={isNil(max) && disabled ? true : Number(field.value) >= Number(max)}
              >
                <Plus className="size-4 text-inherit" />
              </button>
            </div>
          </div>
        </FormItem>
      )}
    />
  )
}

type ServiceImageProps = {
  image?: string
}
const ServiceImage = ({ image }: ServiceImageProps) => {
  const { mutateAsync: getMediaFIle, isPending } = useGetMediaFile()
  const [previewImage, setPreviewImage] = useState<string>()

  useEffect(() => {
    if (!image) return
    getMediaFIle({
      mediaId: image,
    }).then((value) => {
      if (value?.data?.previewURL) setPreviewImage(value?.data?.previewURL)
    })
  }, [image])

  return isPending ? (
    <div className="w-[60px] h-[60px] min-w-[60px] min-h-[60px] object-cover rounded-md flex items-center justify-center">
      <Loader2 className="text-neutral-grey-400 animate-spin" />
    </div>
  ) : (
    <Image
      alt="serviceIcon"
      src={previewImage ?? 'https://www.discountflooringsupplies.com.au/wp-content/uploads/blank-img.jpg'}
      width={100}
      height={100}
      objectFit="cover"
      className="w-[60px] h-[60px] min-w-[60px] min-h-[60px] object-cover rounded-md"
    />
  )
}

export default KiosQuantityInput
