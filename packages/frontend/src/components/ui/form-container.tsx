import InfoContainer from "@/layouts/info";
import { cn } from "@/lib/tw";
import React, { ComponentProps } from "react";
import { Button } from "./button";

interface FormContainerProps extends React.ComponentProps<"form"> {
  className?: ComponentProps<"form">["className"];
  children?: React.ReactNode;
  title?: string;
  isSubmitting?: boolean;
  submitText?: string;
  buttonProps?: typeof Button;
}

const FormContainer = ({
  children,
  title,
  isSubmitting,
  submitText,
  buttonProps,
  className,
  ...props
}: FormContainerProps) => {
  return (
    <InfoContainer title={title}>
      <form {...props} className={cn("flex flex-col", className)}>
        {children}
        {submitText && (
          <Button
            type="submit"
            variant="default"
            size="xl"
            className="mt-6"
            disabled={isSubmitting}
            {...buttonProps}
          >
            {isSubmitting ? "Đang xử lý..." : submitText}
          </Button>
        )}
      </form>
    </InfoContainer>
  );
};

export default FormContainer;
