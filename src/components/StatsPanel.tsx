import { TrendingUp, Maximize, Clock, Gauge } from 'lucide-react';
import type { Planet } from '@/planets';
import type { SimulationResult } from '@/physics';
import {
  formatDistance,
  formatTime,
  formatSpeed,
} from '@/physics';

interface StatsPanelProps {
  planet: Planet;
  result: SimulationResult;
}

export default function StatsPanel({ planet, result }: StatsPanelProps) {
  const stats = [
    {
      icon: <TrendingUp size={18} />,
      label: 'Max Range',
      value: formatDistance(result.maxRange),
      color: 'text-cyan-400',
    },
    {
      icon: <Maximize size={18} />,
      label: 'Max Height',
      value: formatDistance(result.maxHeight),
      color: 'text-green-400',
    },
    {
      icon: <Clock size={18} />,
      label: 'Flight Time',
      value: formatTime(result.flightTime),
      color: 'text-amber-400',
    },
    {
      icon: <Gauge size={18} />,
      label: 'Impact Speed',
      value: formatSpeed(result.impactVelocity),
      color: 'text-red-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl bg-white/[0.03] border border-white/10 px-4 py-3 hover:bg-white/[0.05] transition-colors"
        >
          <div className="flex items-center gap-2 mb-1">
            <span className={stat.color}>{stat.icon}</span>
            <span className="text-xs text-white/40 font-medium">{stat.label}</span>
          </div>
          <div className="text-lg font-mono font-bold text-white">
            {stat.value}
          </div>
        </div>
      ))}
    </div>
  );
}
