import { Field } from '@/components/ui/form'
import { useFormContext, useWatch } from 'react-hook-form'
import { KiosFormSchemaType } from '../schemas/kios-form-schema'
import KiosDialog, { KiosDialogProps } from './kios-dialog'

export interface KiosNoteProps extends Partial<KiosDialogProps> {
  name?: keyof KiosFormSchemaType
  placeholder?: string
  extra?: React.ReactNode | React.ReactNode[] | string
  maxLength?: number
  disabled?: boolean
  rows?: number
  tooltip?: string
}
const KiosNote = ({
  name = 'note',
  buttonLabel,
  dialogTriggerLabel = 'Ghi chú đơn hàng',
  dialogTitle = 'Ghi chú',
  placeholder = 'Nhập ghi chú',
  extra,
  maxLength,
  onCancel,
  onSave,
  rows = 9,
  ...props
}: KiosNoteProps) => {
  const form = useFormContext()
  const [wFieldValue] = useWatch({
    control: form.control,
    name: [name],
  })

  return (
    <KiosDialog
      dialogTriggerLabel={
        dialogTriggerLabel ? (
          wFieldValue ? (
            <span>Chỉnh sửa {dialogTriggerLabel}</span>
          ) : (
            dialogTriggerLabel
          )
        ) : (
          dialogTitle
        )
      }
      buttonLabel={
        buttonLabel ? wFieldValue ? <span>Chỉnh sửa {buttonLabel}</span> : <span>Tạo {buttonLabel}</span> : dialogTitle
      }
      dialogTitle={dialogTitle}
      onCancel={() => {
        onCancel?.(form.getValues())
      }}
      onSave={onSave}
      fields={[name]}
      {...props}
    >
      <Field
        component="textarea"
        name={name}
        placeholder={placeholder}
        rows={rows}
        className="[&>textarea]:h-auto"
        maxLength={maxLength}
      />
      {extra}
    </KiosDialog>
  )
}

export default KiosNote
