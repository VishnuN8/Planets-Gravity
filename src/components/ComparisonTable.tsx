import type { Planet } from '@/planets';
import type { SimulationResult } from '@/physics';
import {
  formatDistance,
  formatTime,
  formatSpeed,
} from '@/physics';
import PlanetSphere from './PlanetSphere';

interface ComparisonRow {
  planet: Planet;
  result: SimulationResult;
}

interface ComparisonTableProps {
  rows: ComparisonRow[];
}

export default function ComparisonTable({ rows }: ComparisonTableProps) {
  const maxRange = Math.max(...rows.map((r) => r.result.maxRange), 1);

  return (
    <div className="rounded-2xl bg-white/[0.03] border border-white/10 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-white/40 text-xs uppercase tracking-wider">
              <th className="text-left px-4 py-3 font-medium">Body</th>
              <th className="text-right px-4 py-3 font-medium">Gravity</th>
              <th className="text-right px-4 py-3 font-medium">Range</th>
              <th className="text-right px-4 py-3 font-medium">Height</th>
              <th className="text-right px-4 py-3 font-medium">Time</th>
              <th className="text-right px-4 py-3 font-medium">Impact</th>
              <th className="text-left px-4 py-3 font-medium hidden md:table-cell">
                Relative
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ planet, result }) => (
              <tr
                key={planet.id}
                className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <PlanetSphere
                      gradient={planet.surfaceGradient}
                      size={28}
                      hasRings={planet.hasRings}
                    />
                    <span className="text-white font-medium">{planet.name}</span>
                  </div>
                </td>
                <td className="text-right px-4 py-3 font-mono text-white/60">
                  {planet.gravity} m/s²
                </td>
                <td className="text-right px-4 py-3 font-mono text-cyan-400 font-semibold">
                  {formatDistance(result.maxRange)}
                </td>
                <td className="text-right px-4 py-3 font-mono text-green-400">
                  {formatDistance(result.maxHeight)}
                </td>
                <td className="text-right px-4 py-3 font-mono text-amber-400">
                  {formatTime(result.flightTime)}
                </td>
                <td className="text-right px-4 py-3 font-mono text-red-400">
                  {formatSpeed(result.impactVelocity)}
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${(result.maxRange / maxRange) * 100}%`,
                          background: planet.color,
                        }}
                      />
                    </div>
                    <span className="text-xs font-mono text-white/30 w-10 text-right">
                      {((result.maxRange / maxRange) * 100).toFixed(0)}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
