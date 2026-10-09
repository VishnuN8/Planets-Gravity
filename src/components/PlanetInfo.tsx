import { Thermometer, Moon as MoonIcon, Globe } from 'lucide-react';
import type { Planet } from '@/planets';
import PlanetSphere from './PlanetSphere';

interface PlanetInfoProps {
  planet: Planet;
}

export default function PlanetInfo({ planet }: PlanetInfoProps) {
  const facts = [
    {
      icon: <Globe size={14} />,
      label: 'Radius',
      value: `${planet.radiusKm.toLocaleString()} km`,
    },
    {
      icon: <Thermometer size={14} />,
      label: 'Avg Temp',
      value: `${planet.tempC > 0 ? '+' : ''}${planet.tempC}°C`,
    },
    {
      icon: <MoonIcon size={14} />,
      label: 'Moons',
      value: planet.moons.toString(),
    },
  ];

  return (
    <div className="flex items-start gap-4 rounded-2xl bg-white/[0.03] border border-white/10 p-5">
      <PlanetSphere
        gradient={planet.surfaceGradient}
        size={72}
        hasRings={planet.hasRings}
        atmosphere={planet.atmosphere}
        glow
      />
      <div className="flex-1">
        <div className="flex items-baseline gap-3">
          <h3 className="text-xl font-bold text-white">{planet.name}</h3>
          <span className="text-sm font-mono text-white/40">
            g = {planet.gravity} m/s²
          </span>
        </div>
        <p className="text-sm text-white/50 mt-1 leading-relaxed">
          {planet.description}
        </p>
        <div className="flex gap-4 mt-3">
          {facts.map((fact) => (
            <div key={fact.label} className="flex items-center gap-1.5">
              <span className="text-white/30">{fact.icon}</span>
              <span className="text-xs text-white/40">{fact.label}:</span>
              <span className="text-xs font-mono text-white/70 font-medium">
                {fact.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
