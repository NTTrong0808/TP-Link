import { ComponentProps } from "react";

const UserCircleIcon = (props: ComponentProps<"svg">) => {
  return (
    <svg
      width="20"
      height="21"
      viewBox="0 0 20 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g id="UserCircle">
        <path
          id="Vector"
          d="M10 17.8301C14.1421 17.8301 17.5 14.4722 17.5 10.3301C17.5 6.18794 14.1421 2.83008 10 2.83008C5.85786 2.83008 2.5 6.18794 2.5 10.3301C2.5 14.4722 5.85786 17.8301 10 17.8301Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          id="Vector_2"
          d="M10 12.8301C11.7259 12.8301 13.125 11.431 13.125 9.70508C13.125 7.97919 11.7259 6.58008 10 6.58008C8.27411 6.58008 6.875 7.97919 6.875 9.70508C6.875 11.431 8.27411 12.8301 10 12.8301Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          id="Vector_3"
          d="M4.98438 15.9058C5.45462 14.9795 6.17216 14.2016 7.05745 13.6582C7.94275 13.1148 8.96123 12.8271 10 12.8271C11.0388 12.8271 12.0572 13.1148 12.9425 13.6582C13.8278 14.2016 14.5454 14.9795 15.0156 15.9058"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

export default UserCircleIcon;
