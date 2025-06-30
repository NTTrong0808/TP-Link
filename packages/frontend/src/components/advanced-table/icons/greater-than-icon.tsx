import { ComponentProps } from 'react'

const GreaterThanIcon = (props: ComponentProps<'svg'>) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none" {...props}>
      <path
        d="M3 2.625L10.125 6L3 9.375"
        stroke="#388D3D"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default GreaterThanIcon
