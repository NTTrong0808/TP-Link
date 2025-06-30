import { ComponentProps } from 'react'

const ArrowRightIcon = (props: ComponentProps<'svg'>) => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M11.3333 5.33325L14 7.99992M14 7.99992L11.3333 10.6666M14 7.99992H2"
        stroke="#A7A7A7"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default ArrowRightIcon
