
import React, { memo } from 'react';
import { cn } from '@/lib/utils';
import { ContributionDay } from '@/services/githubClient';

interface ContributionsChartProps {
  data?: ContributionDay[];
}

const ContributionsChart = ({ data }: ContributionsChartProps) => {
  // If no data, generate placeholder data with higher intensity for visuals
  const chartData = data && data.length > 0 ? data : Array.from({ length: 52 * 7 }, (_, i) => ({
    date: new Date(Date.now() - (52 * 7 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    count: Math.random() > 0.6 ? Math.floor(Math.random() * 10) : 0,
    level: Math.random() > 0.6 ? Math.floor(Math.random() * 5) : 0
  }));

  const getColor = (level: number) => {
    switch (level) {
      case 0: return 'bg-white/[0.08]';
      case 1: return 'bg-white/30';
      case 2: return 'bg-white/50';
      case 3: return 'bg-white/80';
      case 4: return 'bg-white shadow-[0_0_5px_rgba(255,255,255,0.4)]';
      default: return 'bg-white/[0.05]';
    }
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const days = ['Mon', 'Wed', 'Fri'];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        {/* Day Labels */}
        <div className="flex flex-col justify-between pt-10 pb-4">
          {days.map(day => (
            <span key={day} className="text-[9px] text-white uppercase tracking-tighter font-bold">{day}</span>
          ))}
        </div>

        <div className="flex-1">
          {/* Month Labels */}
          <div className="flex justify-between text-[10px] tracking-[0.2em] text-white uppercase mb-4 px-1 font-bold">
            {months.map(m => <span key={m}>{m}</span>)}
          </div>

          {/* The Grid */}
          <div className="grid grid-flow-col grid-rows-7 gap-1">
            {chartData.map((day, i) => (
              <div
                key={i}
                title={`${day.count} contributions on ${day.date}`}
                className={cn(
                  "w-[10px] h-[10px] md:w-[12px] md:h-[12px] rounded-[2px] transition-all duration-300 hover:scale-150 hover:z-20 border border-white/5",
                  getColor(day.level)
                )}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-3 mt-4 text-[9px] tracking-widest text-white uppercase font-bold">
        <span className="opacity-60">Less</span>
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4].map(l => (
            <div key={l} className={cn("w-3 h-3 rounded-[1px] border border-white/10", getColor(l))} />
          ))}
        </div>
        <span className="opacity-60">More</span>
      </div>
    </div>
  );
};

export default memo(ContributionsChart);
