import { ComponentProps } from 'react'

const HistoryIcon = (props: ComponentProps<'svg'>) => {
  return (
    <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M12.5 7.5V12L16.25 14.25" fill="white" />
      <path
        d="M12.5 7.5V12L16.25 14.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M7.25 9.75H3.5V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M6.8375 18.0004C8.01685 19.1132 9.49798 19.8538 11.0958 20.1297C12.6937 20.4056 14.3374 20.2045 15.8217 19.5515C17.3059 18.8986 18.5648 17.8227 19.4411 16.4584C20.3173 15.0941 20.7721 13.5017 20.7486 11.8804C20.7251 10.2591 20.2244 8.68062 19.3089 7.34226C18.3934 6.0039 17.1039 4.96499 15.6014 4.35533C14.0988 3.74568 12.45 3.59231 10.8608 3.9144C9.27157 4.23648 7.81253 5.01974 6.66594 6.1663C5.5625 7.2838 4.65125 8.33755 3.5 9.75036"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default HistoryIcon
