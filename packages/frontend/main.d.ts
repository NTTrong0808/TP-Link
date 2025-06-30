import '@tanstack/react-table'
import { ComponentProps } from 'react'

declare module '@tanstack/table-core' {
  interface ColumnMeta<TData extends RowData, TValue> {
    style: {
      textAlign: 'left' | 'center' | 'right' | 'justify' | 'start' | 'end'
      justifyContent: 'start' | 'center' | 'end' | 'evenly' | 'between' | 'around' | 'normal'
      columnClassName?: ComponentProps<'div'>['className']
    }
  }
}
