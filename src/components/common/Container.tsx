
import { ReactNode, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ children, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8', className)}
      >
        {children}
      </div>
    );
  }
);

Container.displayName = 'Container';

export default Container;
