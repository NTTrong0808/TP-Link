import { createField } from 'hookform-field'
import dynamic from 'next/dynamic'
import { labelVariants } from './label'
import { Skeleton } from './skeleton'

const TextInput = dynamic(() => import('./input').then((r) => r.Input), {
  ssr: true,
})

const PasswordInput = dynamic(() => import('./password').then((r) => r.Password), {
  ssr: true,
})
const Search = dynamic(() => import('./search').then((r) => r.Search), {
  ssr: true,
})
const Combobox = dynamic(() => import('./combobox').then((r) => r.Combobox), {
  ssr: true,
})
const MultipleSelect = dynamic(() => import('./multiselect').then((r) => r.MultipleSelect), {
  ssr: true,
})
const RadioGroup = dynamic(() => import('./radio-group').then((r) => r.RadioGroup), {
  ssr: true,
})

const Textarea = dynamic(() => import('./textarea').then((r) => r.Textarea), {
  ssr: true,
})

const DatePicker = dynamic(() => import('./date-picker').then((r) => r.DatePicker), {
  ssr: true,
})

const Switch = dynamic(() => import('./switch').then((r) => r.Switch), {
  ssr: true,
})

export const Field = createField(
  {
    text: TextInput,
    search: Search,
    select: Combobox,
    multiselect: MultipleSelect,
    radioGroup: RadioGroup,
    textarea: Textarea,
    datepicker: DatePicker,
    switch: Switch,
    password: PasswordInput,
  },
  {
    classNames: {
      label: labelVariants({ className: 'mb-1 block' }),
      root: 'w-full [&:has(input:required)_label]:after:content-["*"] [&:has(input:required)_label]:after:ml-0.5 [&:has(input:required)_label]:after:text-semantic-danger-300 [&:has(input:required)_label]:after:font-bold',
      input: 'w-full',
      message: 'text-semantic-danger-300 text-xs mt-1',
    },
    suspenseFallback: <Skeleton className="h-10 w-full" />,
  },
)
