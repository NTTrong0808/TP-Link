import { cn } from '@/lib/tw';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
};

const SectionContainer = ({ children, className }: Props) => {
  return (
    <div
      className={cn(
        'flex w-full flex-col gap-6 p-6 bg-white rounded-lg border-[1px] border-solid border-neutral-grey-100 max-h-[calc(100vh-73px-32px)]',
        className
      )}
    >
      {children}
    </div>
  );
};

export default SectionContainer;
