import { ComponentProps } from 'react'

const NotEmptyIcon = (props: ComponentProps<'svg'>) => {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M6 10.5C8.48528 10.5 10.5 8.48528 10.5 6C10.5 3.51472 8.48528 1.5 6 1.5C3.51472 1.5 1.5 3.51472 1.5 6C1.5 8.48528 3.51472 10.5 6 10.5Z"
        stroke="#388D3D"
        strokeWidth="1.5"
        strokeMiterlimit="10"
      />
    </svg>
  )
}

export default NotEmptyIcon
