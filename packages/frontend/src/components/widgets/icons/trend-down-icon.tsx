import { ComponentProps } from "react";

const InfoIcon = (props: ComponentProps<"svg">) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g id="Info">
        <path
          id="Vector"
          d="M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          id="Vector_2"
          d="M9.375 9.375C9.54076 9.375 9.69973 9.44085 9.81694 9.55806C9.93415 9.67527 10 9.83424 10 10V13.125C10 13.2908 10.0658 13.4497 10.1831 13.5669C10.3003 13.6842 10.4592 13.75 10.625 13.75"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          id="Vector_3"
          d="M9.6875 7.5C10.2053 7.5 10.625 7.08027 10.625 6.5625C10.625 6.04473 10.2053 5.625 9.6875 5.625C9.16973 5.625 8.75 6.04473 8.75 6.5625C8.75 7.08027 9.16973 7.5 9.6875 7.5Z"
          fill="currentColor"
        />
      </g>
    </svg>
  );
};

export default InfoIcon;
