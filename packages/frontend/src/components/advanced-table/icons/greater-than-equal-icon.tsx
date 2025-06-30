import { ComponentProps } from 'react'

const GreaterThanEqualIcon = (props: ComponentProps<'svg'>) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none" {...props}>
      <path
        d="M2.625 2.25L9.75 4.875L2.625 7.5"
        stroke="#388D3D"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9.75 9.375H2.625" stroke="#388D3D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default GreaterThanEqualIcon
