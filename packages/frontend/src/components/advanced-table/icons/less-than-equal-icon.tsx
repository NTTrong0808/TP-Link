import { ComponentProps } from 'react'

const LessThanEqualIcon = (props: ComponentProps<'svg'>) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none" {...props}>
      <path
        d="M9.375 2.25L2.25 4.875L9.375 7.5"
        stroke="#388D3D"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9.375 9.375H2.25" stroke="#388D3D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default LessThanEqualIcon
