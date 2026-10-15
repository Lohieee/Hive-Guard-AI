import React from 'react';
import { AlertSeverity, ConnectionStatus, RiskLevel } from '../../types';

interface StatusBadgeProps {
  status: AlertSeverity | ConnectionStatus | RiskLevel | 'active' | 'resolved' | 'acknowledged' | string;
  size?: 'sm' | 'md';
  pulse?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  pulse = false,
}) => {
  const norm = status.toLowerCase();

  let bg = 'bg-slate-100 text-slate-700 border-slate-200';
  let dot = 'bg-slate-400';
  let label = status;

  if (norm === 'normal' || norm === 'online' || norm === 'active' || norm === 'resolved' || norm === 'calm' || norm === 'success') {
    bg = 'bg-emerald-50 text-emerald-800 border-emerald-200';
    dot = 'bg-emerald-500';
    if (norm === 'normal') label = 'Normal';
    if (norm === 'online') label = 'Online';
    if (norm === 'resolved') label = 'Resolved';
  } else if (norm === 'warning' || norm === 'spotty' || norm === 'nervous' || norm === 'trialing') {
    bg = 'bg-amber-50 text-amber-800 border-amber-200';
    dot = 'bg-amber-500';
    if (norm === 'warning') label = 'Warning';
  } else if (norm === 'critical' || norm === 'high_risk' || norm === 'aggressive' || norm === 'failed' || norm === 'past_due') {
    bg = 'bg-rose-50 text-rose-800 border-rose-200';
    dot = 'bg-rose-500';
    if (norm === 'high_risk') label = 'High Risk';
    if (norm === 'critical') label = 'Critical';
  } else if (norm === 'offline' || norm === 'inactive' || norm === 'archived' || norm === 'insufficient_data') {
    bg = 'bg-slate-100 text-slate-600 border-slate-200';
    dot = 'bg-slate-400';
    if (norm === 'insufficient_data') label = 'Insufficient Data';
    if (norm === 'offline') label = 'Offline';
  } else if (norm === 'acknowledged') {
    bg = 'bg-blue-50 text-blue-800 border-blue-200';
    dot = 'bg-blue-500';
    label = 'Acknowledged';
  }

  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-semibold';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border shadow-2xs font-medium capitalize tracking-wide transition-colors ${padding} ${bg}`}
    >
      <span className="relative flex h-2 w-2">
        {pulse && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dot}`}
          />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${dot}`} />
      </span>
      {label}
    </span>
  );
};
