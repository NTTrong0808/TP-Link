import { ComponentProps } from "react";

const BarCodeIcon = (props: ComponentProps<"svg">) => {
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g id="Barcode" clipPath="url(#clip0_12027_7121)">
        <path
          id="Vector"
          opacity="0.2"
          d="M21.5 4.83008H3.5V19.8301H21.5V4.83008Z"
          fill="white"
        />
        <path
          id="Vector_2"
          d="M17.75 4.83008H21.5V8.58008"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          id="Vector_3"
          d="M7.25 19.8301H3.5V16.0801"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          id="Vector_4"
          d="M21.5 16.0801V19.8301H17.75"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          id="Vector_5"
          d="M3.5 8.58008V4.83008H7.25"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          id="Vector_6"
          d="M8 8.58008V16.0801"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          id="Vector_7"
          d="M17 8.58008V16.0801"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          id="Vector_8"
          d="M14 8.58008V16.0801"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          id="Vector_9"
          d="M11 8.58008V16.0801"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_12027_7121">
          <rect
            width="24"
            height="24"
            fill="white"
            transform="translate(0.5 0.330078)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export default BarCodeIcon;
