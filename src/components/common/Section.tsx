import React, { ReactNode, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface SectionProps {
  id: string;
  className?: string;
  children: ReactNode;
}

/**
 * Layout only. Entrance choreography belongs to the elements inside via
 * `Reveal`, not to the section.
 *
 * This used to fade the whole section from opacity 0 as one block, which
 * defeated every per-element stagger inside it: the content was already fully
 * visible by the time the children began their own animation.
 */
const Section = forwardRef<HTMLElement, SectionProps>(
  ({ id, className, children }, ref) => (
    <section
      id={id}
      ref={ref}
      className={cn(
        'w-full bg-transparent',
        className
      )}
    >
      {children}
    </section>
  )
);

Section.displayName = 'Section';

export default Section;
