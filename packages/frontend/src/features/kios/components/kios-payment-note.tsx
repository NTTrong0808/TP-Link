import { Field } from '@/components/ui/form'
import { useFormContext } from '../hooks/use-form-context'
import { KiosFormSchemaType } from '../schemas/kios-form-schema'
import KiosDialog, { KiosDialogProps } from './kios-dialog'

export interface KiosPaymentNoteProps extends Partial<KiosDialogProps> {
  name?: keyof KiosFormSchemaType
  placeholder?: string
}
const KiosPaymentNote = ({
  name = 'paymentNote',
  buttonLabel = 'Ghi chú thanh toán',
  dialogTitle = 'Ghi chú thanh toán',
  placeholder = 'Nhập ghi chú thanh toán',
  buttonVariant = 'outline',
  buttonClassName,
  onCancel,
  onSave,
  ...props
}: KiosPaymentNoteProps) => {
  const form = useFormContext()
  return (
    <KiosDialog
      buttonLabel={form.getValues(name) ? 'Chỉnh sửa ' + buttonLabel : 'Tạo ' + buttonLabel}
      dialogTitle={dialogTitle}
      buttonVariant={buttonVariant}
      buttonClassName={buttonClassName}
      onCancel={() => {
        form.resetField(name)
        onCancel?.(form.getValues())
      }}
      onSave={onSave}
    >
      <Field component="textarea" name={name} placeholder={placeholder} rows={9} className="[&>textarea]:h-auto" />
      <div className="text-sm font-normal text-neutral-grey-400">
        <p>{'Vui lòng nhập tối đa 39 ký tự'}</p>
        <p>{'Không bao gồm các ký tự đặc biệt như: = ! " $ % & : * < > ; , # { } [ ] \\ ^ | ~ @)'}</p>
      </div>
    </KiosDialog>
  )
}

export default KiosPaymentNote
