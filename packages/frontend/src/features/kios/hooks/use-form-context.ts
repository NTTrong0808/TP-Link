import { useFormContext as useFormContextBase } from "react-hook-form";
import { KiosFormSchemaType } from "../schemas/kios-form-schema";

export const useFormContext = () => {
  return useFormContextBase<KiosFormSchemaType>();
};
