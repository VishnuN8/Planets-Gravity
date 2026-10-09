import type { Planet } from '@/planets';
import PlanetSphere from './PlanetSphere';

interface PlanetSelectorProps {
  planets: Planet[];
  selected: Planet;
  onSelect: (planet: Planet) => void;
}

export default function PlanetSelector({
  planets,
  selected,
  onSelect,
}: PlanetSelectorProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
      {planets.map((planet) => {
        const isActive = planet.id === selected.id;
        return (
          <button
            key={planet.id}
            onClick={() => onSelect(planet)}
            className={`group flex flex-col items-center gap-2 rounded-2xl px-4 py-3 min-w-[90px] transition-all duration-300 ${
              isActive
                ? 'bg-white/10 border border-white/20 scale-105'
                : 'bg-white/[0.02] border border-transparent hover:bg-white/5 hover:scale-102'
            }`}
          >
            <div
              className={`transition-transform duration-300 ${
                isActive ? 'scale-110' : 'group-hover:scale-110'
              }`}
            >
              <PlanetSphere
                gradient={planet.surfaceGradient}
                size={isActive ? 52 : 44}
                hasRings={planet.hasRings}
                atmosphere={planet.atmosphere}
                glow={isActive}
              />
            </div>
            <span
              className={`text-xs font-medium transition-colors ${
                isActive ? 'text-white' : 'text-white/50 group-hover:text-white/70'
              }`}
            >
              {planet.name}
            </span>
            <span className="text-[10px] font-mono text-white/30">
              {planet.gravity} m/s²
            </span>
          </button>
        );
      })}
    </div>
  );
}
