import { ComponentProps } from 'react'

const PieChartIcon = (props: ComponentProps<'svg'>) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M6.39278 4.95892C7.7187 3.90301 9.31582 3.24294 11.0003 3.05469V12.9997H20.9453C20.7571 14.6842 20.097 16.2813 19.0411 17.6072C17.9852 18.9332 16.5763 19.934 14.9767 20.4945C13.3771 21.0551 11.6517 21.1526 9.9991 20.7758C8.34651 20.399 6.8339 19.5632 5.63536 18.3647C4.43681 17.1661 3.60104 15.6535 3.22425 14.0009C2.84745 12.3483 2.94493 10.6229 3.50548 9.02331C4.06603 7.42368 5.06685 6.01484 6.39278 4.95892Z"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 8.99972H20.488C20.0391 7.73433 19.3135 6.58506 18.3641 5.63566C17.4147 4.68625 16.2654 3.96065 15 3.51172V8.99972Z"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default PieChartIcon
