import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import ExportIcon from '@/components/widgets/icons/export-icon'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

type Props = {
  handleSubmit: (email: string) => void
  isLoading: boolean
  defaultEmail?: string
}

// Schema using zod
const emailSchema = z.object({
  email: z.string().email({ message: 'Email không hợp lệ' }),
})

type EmailForm = z.infer<typeof emailSchema>

const ExportProductVariantExcel = ({ handleSubmit, isLoading, defaultEmail }: Props) => {
  const {
    register,
    handleSubmit: formSubmit,
    formState: { errors },
    setValue,
  } = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: defaultEmail ?? '' },
  })

  useEffect(() => {
    if (defaultEmail) {
      setValue('email', defaultEmail)
    }
  }, [defaultEmail, setValue])

  const onSubmit = (data: EmailForm) => {
    handleSubmit(data.email)
  }

  return (
    <Popover>
      <PopoverTrigger>
        <Button size="lg" isLoading={isLoading} className="!bg-primary-orange-400">
          <ExportIcon className="size-6" />
          Xuất báo cáo
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <form onSubmit={formSubmit(onSubmit)} className="w-[300px] flex flex-col gap-4">
          <div className="w-full flex flex-col gap-1">
            <p className="text-sm">Nhập email nhận hóa đơn</p>
            <Input
              type="text"
              placeholder="Nhập email"
              {...register('email')}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
          </div>

          <Button type="submit" className="w-full !bg-primary-orange-400" disabled={isLoading} isLoading={isLoading}>
            Xác nhận
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  )
}

export default ExportProductVariantExcel
