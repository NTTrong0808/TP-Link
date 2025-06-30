import { EyeIcon } from "lucide-react";
import { ComponentProps, useState } from "react";
import { tv, VariantProps } from "tailwind-variants";
import EyeSlashIcon from "../widgets/icons/eye-slash-icon";
import { Input, inputVariants } from "./input";

export const passwordVariants = tv({
  extend: inputVariants,
  defaultVariants: {
    size: "default",
  },
});

export interface PasswordProps
  extends Omit<ComponentProps<"input">, "size">,
    VariantProps<typeof passwordVariants> {
  suffix?: React.ReactNode;
}

const Password = ({ size, ...props }: PasswordProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const SuffixIcon = isVisible ? EyeIcon : EyeSlashIcon;

  return (
    <Input
      {...props}
      type={isVisible ? "text" : "password"}
      size={size}
      suffix={
        <SuffixIcon
          className="size-5 text-neutral-grey-300"
          onClick={() => setIsVisible((prevIsVisible) => !prevIsVisible)}
        />
      }
    />
  );
};
Password.displayName = "Input";

export { Password };
