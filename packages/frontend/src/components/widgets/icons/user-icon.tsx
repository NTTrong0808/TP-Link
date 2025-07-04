import React, { ComponentProps } from "react";

const UserIcon = (props: ComponentProps<"svg">) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M7.875 15C10.5674 15 12.75 12.8174 12.75 10.125C12.75 7.43261 10.5674 5.25 7.875 5.25C5.18261 5.25 3 7.43261 3 10.125C3 12.8174 5.18261 15 7.875 15Z"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M0.958984 18.75C1.70813 17.5982 2.73311 16.6517 3.94086 15.9965C5.14861 15.3412 6.50089 14.998 7.87492 14.998C9.24896 14.998 10.6012 15.3412 11.809 15.9965C13.0167 16.6517 14.0417 17.5982 14.7909 18.75"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.125 15C17.499 14.9992 18.8513 15.3418 20.0592 15.9967C21.267 16.6517 22.292 17.5981 23.0409 18.75"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.3145 5.59687C14.9813 5.3309 15.6987 5.2155 16.4153 5.25893C17.1319 5.30235 17.8301 5.50352 18.46 5.84806C19.0899 6.19261 19.6359 6.67202 20.059 7.25204C20.4821 7.83206 20.7718 8.49838 20.9076 9.20338C21.0433 9.90837 21.0216 10.6346 20.8441 11.3303C20.6666 12.026 20.3376 12.6738 19.8807 13.2276C19.4238 13.7814 18.8502 14.2274 18.2009 14.5338C17.5516 14.8402 16.8427 14.9994 16.1248 15"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default UserIcon;
