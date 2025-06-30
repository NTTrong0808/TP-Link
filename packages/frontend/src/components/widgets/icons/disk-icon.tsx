import { ComponentProps } from "react";

const DiskIcon = (props: ComponentProps<"svg">) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="21"
      height="20"
      viewBox="0 0 21 20"
      fill="none"
      {...props}
    >
      <path
        d="M3.625 6.50859V16.25C3.625 16.4158 3.69085 16.5747 3.80806 16.6919C3.92527 16.8092 4.08424 16.875 4.25 16.875H16.75C16.9158 16.875 17.0747 16.8092 17.1919 16.6919C17.3092 16.5747 17.375 16.4158 17.375 16.25V3.75C17.375 3.58424 17.3092 3.42527 17.1919 3.30806C17.0747 3.19085 16.9158 3.125 16.75 3.125H7.00859C6.84305 3.12508 6.68431 3.19082 6.56719 3.30781L3.80781 6.06719C3.69082 6.18431 3.62508 6.34305 3.625 6.50859Z"
        stroke="#1F1F1F"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.5 14.375C11.8807 14.375 13 13.2557 13 11.875C13 10.4943 11.8807 9.375 10.5 9.375C9.11929 9.375 8 10.4943 8 11.875C8 13.2557 9.11929 14.375 10.5 14.375Z"
        stroke="#1F1F1F"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.75 3.18125V6.25C6.75 6.41576 6.81585 6.57473 6.93306 6.69194C7.05027 6.80915 7.20924 6.875 7.375 6.875H13.625C13.7908 6.875 13.9497 6.80915 14.0669 6.69194C14.1842 6.57473 14.25 6.41576 14.25 6.25V3.125"
        stroke="#1F1F1F"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default DiskIcon;
