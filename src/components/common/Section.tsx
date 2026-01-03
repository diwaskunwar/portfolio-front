
import React, { ReactNode, forwardRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { cn } from '@/lib/utils';

interface SectionProps {
  id: string;
  className?: string;
  children: ReactNode;
}

const Section = forwardRef<HTMLDivElement, SectionProps>(
  ({ id, className, children }, ref) => {
    const [inViewRef, inView] = useInView({
      threshold: 0.1, // Reduced threshold for smoother entry
      triggerOnce: true, // Only animate in once
    });

    const setRefs = (node: HTMLDivElement) => {
      // @ts-ignore - forwardRef types can be tricky
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
      inViewRef(node);
    };

    return (
      <section
        id={id}
        ref={setRefs}
        className={cn(
          'min-h-screen w-full flex flex-col items-center justify-center transition-all duration-1000 ease-out',
          inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10',
          'bg-transparent', // Always transparent to show global background
          className
        )}
      >
        {children}
      </section>
    );
  }
);

Section.displayName = 'Section';

export default Section;
