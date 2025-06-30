import { ComponentProps } from 'react'

const NotContainIcon = (props: ComponentProps<'svg'>) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none" {...props}>
      <path
        d="M6 9.125C6.13807 9.125 6.25 9.23693 6.25 9.375C6.25 9.51307 6.13807 9.625 6 9.625C5.86193 9.625 5.75 9.51307 5.75 9.375C5.75 9.23693 5.86193 9.125 6 9.125Z"
        fill="#388D3D"
        stroke="#388D3D"
      />
      <path d="M6 2.25V7.125" stroke="#388D3D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default NotContainIcon
