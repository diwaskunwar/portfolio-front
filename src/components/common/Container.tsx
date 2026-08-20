
import { ReactNode, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ children, className }, ref) => {
    return (
      /* The shell grows in three steps rather than stopping at 1280px.
         Prose inside is capped by its own measure (max-w-2xl, 46ch), so a
         wider shell buys the grids and the portrait room on a large display
         without ever running a paragraph to 200 characters. Gutters grow
         with it, and tighten on a small phone where 16px of padding on each
         side of a 320px screen is a tenth of the viewport. */
      <div
        ref={ref}
        className={cn(
          'mx-auto w-full max-w-7xl xl:max-w-[1400px] 3xl:max-w-[1560px]',
          'px-4 xs:px-5 sm:px-6 lg:px-8 xl:px-12 3xl:px-16',
          className
        )}
      >
        {children}
      </div>
    );
  }
);

Container.displayName = 'Container';

export default Container;
