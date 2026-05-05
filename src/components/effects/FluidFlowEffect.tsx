import React from 'react';
import { cn } from '@/lib/utils';

type FlowVariant = 'water' | 'snake' | 'grid';

interface FluidFlowEffectProps {
  variant?: FlowVariant;
  className?: string;
}

interface PathDef {
  d: string;
  strokeWidth: number;
  opacity: number;
  duration: number;
  delay: number;
  dashArray: number;
}

interface BlobDef {
  cx: number;
  cy: number;
  r: number;
  duration: number;
  delay: number;
}

const variantPaths: Record<FlowVariant, { paths: PathDef[]; blobs: BlobDef[] }> = {
  water: {
    paths: [
      {
        d: 'M-100,160 C200,60 400,290 700,160 C1000,30 1200,260 1550,160',
        strokeWidth: 1,
        opacity: 0.18,
        duration: 9,
        delay: 0,
        dashArray: 2200,
      },
      {
        d: 'M-100,360 C150,240 380,490 680,360 C980,230 1250,460 1600,360',
        strokeWidth: 0.8,
        opacity: 0.12,
        duration: 11,
        delay: 1.8,
        dashArray: 2200,
      },
      {
        d: 'M-100,560 C250,440 500,680 800,560 C1100,440 1350,670 1700,560',
        strokeWidth: 0.6,
        opacity: 0.08,
        duration: 13,
        delay: 3.5,
        dashArray: 2200,
      },
      {
        d: 'M200,0 C180,180 220,380 200,560 C200,600 200,650 200,700',
        strokeWidth: 0.5,
        opacity: 0.07,
        duration: 10,
        delay: 2,
        dashArray: 1200,
      },
      {
        d: 'M900,0 C880,200 920,400 900,600',
        strokeWidth: 0.5,
        opacity: 0.06,
        duration: 12,
        delay: 4,
        dashArray: 1200,
      },
    ],
    blobs: [
      { cx: 250, cy: 200, r: 180, duration: 14, delay: 0 },
      { cx: 950, cy: 480, r: 220, duration: 18, delay: 3 },
      { cx: 1300, cy: 150, r: 150, duration: 16, delay: 6 },
    ],
  },
  snake: {
    paths: [
      {
        d: 'M0,55 H1340 Q1400,55 1400,110 H60 Q0,110 0,165 H1340 Q1400,165 1400,220 H60 Q0,220 0,275 H1340 Q1400,275 1400,330 H60 Q0,330 0,385 H1340 Q1400,385 1400,440 H60 Q0,440 0,495 H1340',
        strokeWidth: 1,
        opacity: 0.22,
        duration: 7,
        delay: 0,
        dashArray: 4000,
      },
      {
        d: 'M0,90 H1300 Q1370,90 1370,145 H100 Q30,145 30,200 H1300 Q1370,200 1370,255 H100 Q30,255 30,310 H1300 Q1370,310 1370,365 H100 Q30,365 30,420 H1300',
        strokeWidth: 0.6,
        opacity: 0.13,
        duration: 9,
        delay: 1.2,
        dashArray: 4000,
      },
      {
        d: 'M0,130 H1250 Q1320,130 1320,185 H150 Q80,185 80,240 H1250 Q1320,240 1320,295 H150 Q80,295 80,350 H1250',
        strokeWidth: 0.5,
        opacity: 0.09,
        duration: 11,
        delay: 2.5,
        dashArray: 4000,
      },
    ],
    blobs: [
      { cx: 700, cy: 350, r: 250, duration: 20, delay: 0 },
    ],
  },
  grid: {
    paths: [
      {
        d: 'M-100,120 C200,80 400,170 700,120 C1000,70 1200,160 1550,120',
        strokeWidth: 0.8,
        opacity: 0.14,
        duration: 10,
        delay: 0,
        dashArray: 2000,
      },
      {
        d: 'M-100,300 C180,240 420,370 720,300 C1020,230 1280,360 1600,300',
        strokeWidth: 0.7,
        opacity: 0.1,
        duration: 12,
        delay: 2,
        dashArray: 2000,
      },
      {
        d: 'M-100,500 C220,440 480,570 780,500 C1080,430 1320,560 1650,500',
        strokeWidth: 0.6,
        opacity: 0.08,
        duration: 14,
        delay: 4,
        dashArray: 2000,
      },
      {
        d: 'M280,0 C260,160 300,340 280,500 C280,580 280,640 280,700',
        strokeWidth: 0.6,
        opacity: 0.1,
        duration: 9,
        delay: 1,
        dashArray: 1200,
      },
      {
        d: 'M700,0 C680,180 720,380 700,560 C700,620 700,660 700,700',
        strokeWidth: 0.6,
        opacity: 0.09,
        duration: 11,
        delay: 3,
        dashArray: 1200,
      },
      {
        d: 'M1120,0 C1100,200 1140,400 1120,600',
        strokeWidth: 0.5,
        opacity: 0.08,
        duration: 13,
        delay: 5,
        dashArray: 1200,
      },
    ],
    blobs: [
      { cx: 350, cy: 250, r: 160, duration: 16, delay: 0 },
      { cx: 1050, cy: 450, r: 200, duration: 20, delay: 5 },
    ],
  },
};

const FluidFlowEffect: React.FC<FluidFlowEffectProps> = ({ variant = 'water', className }) => {
  const { paths, blobs } = variantPaths[variant];

  return (
    <div
      className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}
      aria-hidden="true"
    >
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1400 700"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Drifting soft blobs */}
        {blobs.map((blob, i) => (
          <circle
            key={`blob-${i}`}
            cx={blob.cx}
            cy={blob.cy}
            r={blob.r}
            fill="white"
            fillOpacity={0.018}
            style={{
              animation: `fluidBlobDrift${(i % 3) + 1} ${blob.duration}s ease-in-out ${blob.delay}s infinite`,
            }}
          />
        ))}

        {/* Animated flow paths */}
        {paths.map((path, i) => (
          <path
            key={`path-${i}`}
            d={path.d}
            stroke="white"
            strokeWidth={path.strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: path.dashArray,
              strokeDashoffset: path.dashArray,
              opacity: path.opacity,
              animation: `snakeFlowDraw ${path.duration}s linear ${path.delay}s infinite`,
            }}
          />
        ))}
      </svg>
    </div>
  );
};

export default FluidFlowEffect;
