import { ComponentProps } from 'react'

const ContainIcon = (props: ComponentProps<'svg'>) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none" {...props}>
      <path d="M6 1.875V10.125" stroke="#388D3D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2.25 3.75L9.75 8.25" stroke="#388D3D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2.25 8.25L9.75 3.75" stroke="#388D3D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default ContainIcon
