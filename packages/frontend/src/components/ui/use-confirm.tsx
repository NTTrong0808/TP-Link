export interface ConfirmOptions {
  message: string;
}

export const useConfirm = () => {
  const confirm = (options: ConfirmOptions) => {
    return window.confirm(options.message);
  };

  return confirm;
};
