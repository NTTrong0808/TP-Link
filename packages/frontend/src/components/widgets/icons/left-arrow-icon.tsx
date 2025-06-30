import { ComponentProps } from "react";

const LeftArrowIcon = (props: ComponentProps<"svg">) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g id="Back Arrow Icon">
        <path
          id="Vector"
          d="M3 12H21M7 16L3 12L7 16ZM3 12L7 8L3 12Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

export default LeftArrowIcon;
