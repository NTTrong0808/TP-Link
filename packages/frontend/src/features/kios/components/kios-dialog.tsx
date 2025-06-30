import { Button, ButtonProps } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { toastError } from '@/components/widgets/toast'
import { cn } from '@/lib/tw'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { DialogContentProps } from '@radix-ui/react-dialog'
import { InfoIcon, PenBoxIcon } from 'lucide-react'
import { PropsWithChildren, useState } from 'react'
import { useToggle } from 'react-use'
import { useFormContext } from '../hooks/use-form-context'
import { KiosSection } from './kios-section'

export interface KiosDialogProps extends PropsWithChildren {
  buttonLabel?: string | React.ReactNode
  dialogTitle: string | React.ReactNode
  buttonVariant?: ButtonProps['variant']
  buttonClassName?: ButtonProps['className']
  onSave?: (values: Record<string, any>) => void
  onCancel?: (values: Record<string, any>) => void
  onOpenChange?: (open: boolean, values: Record<string, any>) => void
  className?: DialogContentProps['className']
  cancelButtonLabel?: string
  saveButtonLabel?: string
  disabled?: boolean
  fields?: string[]
  dialogTriggerLabel?: string | React.ReactNode
  tooltip?: string
  saveButtonProps?: ButtonProps
  container?: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Portal>['container']
}

const KiosDialog = ({
  buttonLabel,
  dialogTitle,
  buttonVariant = 'outline',
  buttonClassName,
  onSave,
  onCancel,
  onOpenChange,
  className,
  children,
  cancelButtonLabel = 'Hủy',
  saveButtonLabel = 'Lưu',
  disabled,
  fields,
  dialogTriggerLabel,
  tooltip,
  saveButtonProps,
  container,
  ...props
}: KiosDialogProps) => {
  const {
    // formState: { errors },
    getValues,
    trigger,
    setValue,
    clearErrors,
  } = useFormContext()

  const [open, toggle] = useToggle(false)

  const [oldValues, setOldValues] = useState(getValues(fields as any))

  // const isError = fields?.some((key) => {
  //   const parts = key.split('.')
  //   let current = errors as any
  //   for (const part of parts) {
  //     current = current?.[part]
  //     if (current === undefined) return false
  //   }
  //   return true
  // })

  const dialogTrigger = dialogTriggerLabel ? (
    <div
      className={cn(
        'inline-flex gap-1 justify-center items-center text-sm font-medium text-neutral-grey-400 cursor-pointer',

        disabled && 'opacity-50 cursor-not-allowed',
      )}
    >
      <PenBoxIcon className="size-5" />
      <div>{dialogTriggerLabel}</div>
      {tooltip && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <InfoIcon className="!size-5" />
            </TooltipTrigger>
            <TooltipContent>{tooltip}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  ) : (
    <Button variant={buttonVariant} className={cn(buttonClassName)} disabled={disabled}>
      {buttonLabel}
    </Button>
  )

  if (disabled) return dialogTrigger

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(open) => {
          onOpenChange?.(open, getValues())
          toggle(open)
          if (open) {
            setOldValues(getValues(fields as any))
          }
        }}
      >
        <DialogTrigger asChild>{dialogTrigger}</DialogTrigger>
        <DialogContent
          hideCloseButton
          // container={container}
          container={container || document.getElementById('kios-form')}
          onInteractOutside={(e) => {
            e.preventDefault()
          }}
          className={cn('p-0 max-w-[600px] [&>*_label]:text-xs [&>*_label]:text-neutral-grey-500', className)}
        >
          <DialogTitle className="hidden">{buttonLabel}</DialogTitle>
          <KiosSection title={dialogTitle}>
            <div className="flex flex-col gap-6">
              {children}
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    onCancel?.(getValues())
                    toggle(false)
                    fields?.forEach((field, index) => {
                      setValue(field as any, oldValues[index])
                    })
                    clearErrors(fields as any)
                  }}
                  className="flex-1"
                  type="button"
                >
                  {cancelButtonLabel}
                </Button>
                <Button
                  onClick={(e) => {
                    saveButtonProps?.onClick?.(e)
                    if (saveButtonProps?.type !== 'submit') {
                      onSave?.(getValues())
                      trigger(fields as any)
                        ?.then((isValid: boolean) => {
                          if (isValid) {
                            toggle(false)
                          }
                        })
                        .catch((err) => {
                          toastError('Có lỗi xảy ra, vui lòng kiểm tra lại')
                        })
                    }
                  }}
                  type="button"
                  {...saveButtonProps}
                  className={cn('flex-1', saveButtonProps?.className)}
                >
                  {saveButtonLabel}
                </Button>
              </DialogFooter>
            </div>
          </KiosSection>
        </DialogContent>
      </Dialog>
      {/* {isError && (
        <p className="text-xs text-semantic-danger-300">Có trường thông tin chưa hợp lệ, vui lòng kiểm tra lại!</p>
      )} */}
    </>
  )
}

export default KiosDialog
