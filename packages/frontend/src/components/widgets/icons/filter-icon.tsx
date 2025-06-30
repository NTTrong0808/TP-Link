import { ComponentProps } from "react";

const FilterIcon = (props: ComponentProps<"svg">) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M4.35683 4.35651C4.23528 4.47806 4.16699 4.64292 4.16699 4.81482V6.49093C4.16703 6.66282 4.23534 6.82765 4.3569 6.94917L8.51412 11.1064C8.63568 11.2279 8.70399 11.3927 8.70403 11.5646V15.8333L11.2966 13.2407V11.5646C11.2967 11.3927 11.365 11.2279 11.4865 11.1064L15.6438 6.94917C15.7653 6.82765 15.8336 6.66282 15.8337 6.49093V4.81482C15.8337 4.64292 15.7654 4.47806 15.6438 4.35651C15.5223 4.23496 15.3574 4.16667 15.1855 4.16667H4.81514C4.64324 4.16667 4.47838 4.23496 4.35683 4.35651Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default FilterIcon;
