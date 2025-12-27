import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverEffect = true,
}) => (
  <div
    className={cn(
      'group relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur border border-slate-100 p-6 lg:p-7 shadow-lg',
      hoverEffect &&
        'hover:shadow-xl hover:-translate-y-1 transition-all duration-300',
      className
    )}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/4 via-transparent to-accent/4 opacity-0 group-hover:opacity-100 transition duration-300" />
    <div className="relative z-10">{children}</div>
  </div>
);
