import { ComponentProps } from 'react'

const EmptyIcon = (props: ComponentProps<'svg'>) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none" {...props}>
      <path
        d="M6 10.125C8.27817 10.125 10.125 8.27817 10.125 6C10.125 3.72183 8.27817 1.875 6 1.875C3.72183 1.875 1.875 3.72183 1.875 6C1.875 8.27817 3.72183 10.125 6 10.125Z"
        stroke="#388D3D"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.75 1.875L2.25 10.125"
        stroke="#388D3D"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default EmptyIcon
