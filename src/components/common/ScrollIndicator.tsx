import React from 'react';
import { ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScrollIndicatorProps {
    targetId: string;
    className?: string;
    label?: string;
}

const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({ targetId, className, label = "Descent" }) => {
    const scrollToTarget = () => {
        const element = document.getElementById(targetId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div
            className={cn(
                "flex flex-col items-center gap-4 cursor-pointer hover:scale-110 transition-transform animate-bounce py-8 z-20",
                className
            )}
            onClick={scrollToTarget}
        >
            <span className="text-[10px] tracking-[0.4em] text-white uppercase font-bold">{label}</span>
            <ArrowDown size={14} className="text-white" />
        </div>
    );
};

export default ScrollIndicator;
