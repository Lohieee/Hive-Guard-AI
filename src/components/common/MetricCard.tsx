import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
    label?: string;
  };
  subtitle?: string;
  accentColor?: 'emerald' | 'amber' | 'rose' | 'slate' | 'blue';
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  icon: Icon,
  trend,
  subtitle,
  accentColor = 'emerald',
  onClick,
}) => {
  const accentStyles = {
    emerald: 'bg-emerald-50 text-emerald-800 border-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300',
    amber: 'bg-amber-50 text-amber-800 border-amber-100 dark:bg-amber-950/40 dark:text-amber-300',
    rose: 'bg-rose-50 text-rose-800 border-rose-100 dark:bg-rose-950/40 dark:text-rose-300',
    slate: 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300',
    blue: 'bg-blue-50 text-blue-800 border-blue-100 dark:bg-blue-950/40 dark:text-blue-300',
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl p-5 border border-[#E8E3D9] shadow-xs hover:shadow-md transition-all duration-200 relative overflow-hidden ${
        onClick ? 'cursor-pointer hover:border-emerald-600/30' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">{title}</p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{value}</span>
            {unit && <span className="text-sm font-semibold text-slate-500">{unit}</span>}
          </div>
        </div>
        <div className={`p-2.5 rounded-xl border ${accentStyles[accentColor]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {(trend || subtitle) && (
        <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          {trend ? (
            <div className="flex items-center gap-1.5">
              <span
                className={`inline-flex items-center px-1.5 py-0.5 rounded font-semibold ${
                  trend.isPositive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}
              >
                {trend.value}
              </span>
              <span className="text-slate-500 font-medium">{trend.label || 'vs last period'}</span>
            </div>
          ) : (
            <span className="text-slate-500 font-medium">{subtitle}</span>
          )}
        </div>
      )}
    </div>
  );
};
