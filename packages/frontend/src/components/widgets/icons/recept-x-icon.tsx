import { ComponentProps } from 'react'

const ReceptXIcon = (props: ComponentProps<'svg'>) => {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M2.5 13.5V4C2.5 3.86739 2.55268 3.74021 2.64645 3.64645C2.74021 3.55268 2.86739 3.5 3 3.5H14C14.1326 3.5 14.2598 3.55268 14.3536 3.64645C14.4473 3.74021 14.5 3.86739 14.5 4V13.5L12.5 12.5L10.5 13.5L8.5 12.5L6.5 13.5L4.5 12.5L2.5 13.5Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M10 6.5L7 9.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 6.5L10 9.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default ReceptXIcon
