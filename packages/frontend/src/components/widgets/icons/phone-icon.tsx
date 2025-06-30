import { ComponentProps } from 'react'

const PhoneIcon = (props: ComponentProps<'svg'>) => {
  return (
    <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M18.5 20.25V3.75C18.5 2.92157 17.8284 2.25 17 2.25L8 2.25C7.17157 2.25 6.5 2.92157 6.5 3.75L6.5 20.25C6.5 21.0784 7.17157 21.75 8 21.75H17C17.8284 21.75 18.5 21.0784 18.5 20.25Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9.5 5.25H15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default PhoneIcon
