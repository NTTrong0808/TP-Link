import { ComponentProps } from 'react'

const ShoppingCard = (props: ComponentProps<'svg'>) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" {...props}>
      <path
        d="M16.875 3.75H3.125C2.77982 3.75 2.5 4.02982 2.5 4.375V15.625C2.5 15.9702 2.77982 16.25 3.125 16.25H16.875C17.2202 16.25 17.5 15.9702 17.5 15.625V4.375C17.5 4.02982 17.2202 3.75 16.875 3.75Z"
        stroke="#A7A7A7"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M2.5 6.25H17.5" stroke="#A7A7A7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M13.125 8.75C13.125 9.5788 12.7958 10.3737 12.2097 10.9597C11.6237 11.5458 10.8288 11.875 10 11.875C9.1712 11.875 8.37634 11.5458 7.79029 10.9597C7.20424 10.3737 6.875 9.5788 6.875 8.75"
        stroke="#A7A7A7"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default ShoppingCard
