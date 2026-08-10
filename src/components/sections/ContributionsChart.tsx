import React, { memo, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ContributionDay } from '@/services/githubClient';
import { buildGreetingCalendar } from '@/lib/greetingCalendar';

interface ContributionsChartProps {
  data?: ContributionDay[];
  /** Drawn when no data is supplied. */
  greeting?: string;
}

const LEVEL_CLASS = [
  'bg-foreground/[0.07]',
  'bg-foreground/25',
  'bg-foreground/45',
  'bg-foreground/70',
  'bg-foreground',
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_LABELS = ['Mon', 'Wed', 'Fri'];

const ContributionsChart = ({ data, greeting = 'HELLO WORLD' }: ContributionsChartProps) => {
  const reduce = useReducedMotion();

  // Built once so re-renders never reshuffle the noise around the letters.
  const chartData = useMemo(
    () => (data && data.length > 0 ? data : buildGreetingCalendar(greeting)),
    [data, greeting]
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3">
        <div className="flex flex-col justify-around pb-5 pt-8">
          {DAY_LABELS.map((day) => (
            <span key={day} className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground">
              {day}
            </span>
          ))}
        </div>

        <div className="min-w-0 flex-1 overflow-x-auto pb-2">
          <div className="w-max">
            {/* w-full inside the w-max wrapper matches the grid's width, so
                the labels span the same distance as the 53 columns below. */}
            <div className="mb-3 flex w-full justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              {MONTHS.map((m) => (
                <span key={m}>{m}</span>
              ))}
            </div>

            <div className="grid grid-flow-col grid-rows-7 gap-[3px]">
              {chartData.map((day, i) => {
                // Column index drives the delay, so the year fills in left to
                // right and the word writes itself.
                const column = Math.floor(i / 7);
                return (
                  <motion.div
                    key={`${day.date}-${i}`}
                    title={`${day.count} on ${day.date}`}
                    initial={reduce ? false : { opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{
                      duration: 0.3,
                      ease: [0.16, 1, 0.3, 1],
                      delay: reduce ? 0 : column * 0.016,
                    }}
                    className={cn(
                      'h-[11px] w-[11px] rounded-[2px] transition-transform duration-200 hover:scale-150 md:h-[12px] md:w-[12px]',
                      LEVEL_CLASS[day.level] ?? LEVEL_CLASS[0]
                    )}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
        <span>Less</span>
        <div className="flex gap-[3px]">
          {LEVEL_CLASS.map((cls, l) => (
            <div key={l} className={cn('h-3 w-3 rounded-[2px]', cls)} />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  );
};

export default memo(ContributionsChart);
