import { ComponentProps } from "react";

const ClockIcon = (props: ComponentProps<"svg">) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <path
        d="M12 7.5V12L15.75 14.25"
        stroke="#A7A7A7"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.75 9.75H3V6"
        stroke="#A7A7A7"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.3375 18.0004C7.51685 19.1132 8.99798 19.8538 10.5958 20.1297C12.1937 20.4056 13.8374 20.2045 15.3217 19.5515C16.8059 18.8986 18.0648 17.8227 18.9411 16.4584C19.8173 15.0941 20.2721 13.5017 20.2486 11.8804C20.2251 10.2591 19.7244 8.68062 18.8089 7.34226C17.8934 6.0039 16.6039 4.96499 15.1014 4.35533C13.5988 3.74568 11.95 3.59231 10.3608 3.9144C8.77157 4.23648 7.31253 5.01974 6.16594 6.1663C5.0625 7.2838 4.15125 8.33755 3 9.75036"
        stroke="#A7A7A7"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ClockIcon;
