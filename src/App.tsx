import { useState, useMemo, useCallback } from 'react';
import { Rocket, BarChart3, Sparkles } from 'lucide-react';
import { planets, type Planet } from '@/planets';
import { simulateProjectile } from '@/physics';
import Starfield from '@/components/Starfield';
import PlanetSelector from '@/components/PlanetSelector';
import ControlPanel from '@/components/ControlPanel';
import SimulationCanvas from '@/components/SimulationCanvas';
import StatsPanel from '@/components/StatsPanel';
import PlanetInfo from '@/components/PlanetInfo';
import ComparisonTable from '@/components/ComparisonTable';

type Mode = 'simulator' | 'comparison';

export default function App() {
  const [mode, setMode] = useState<Mode>('simulator');
  const [selected, setSelected] = useState<Planet>(planets[2]); // Earth
  const [velocity, setVelocity] = useState(50);
  const [angle, setAngle] = useState(45);
  const [showTrajectory, setShowTrajectory] = useState(true);
  const [replayKey, setReplayKey] = useState(0);

  const result = useMemo(
    () => simulateProjectile(selected.gravity, velocity, angle),
    [selected, velocity, angle]
  );

  const comparisonRows = useMemo(
    () =>
      planets.map((planet) => ({
        planet,
        result: simulateProjectile(planet.gravity, velocity, angle),
      })),
    [velocity, angle]
  );

  const handleReplay = useCallback(() => setReplayKey((k) => k + 1), []);
  const handleReset = useCallback(() => {
    setVelocity(50);
    setAngle(45);
  }, []);

  return (
    <div className="min-h-screen bg-[#05070d] text-white relative overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 20% 0%, rgba(30,60,120,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 100%, rgba(80,30,60,0.1) 0%, transparent 50%)',
        }}
      />

      <Starfield count={180} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Rocket size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold leading-tight">
                Gravity Lab
              </h1>
              <p className="text-xs text-white/40 leading-tight">
                Projectile motion across the solar system
              </p>
            </div>
          </div>

          {/* Mode Toggle */}
          <div className="flex items-center gap-1 rounded-xl bg-white/[0.03] border border-white/10 p-1">
            <button
              onClick={() => setMode('simulator')}
              className={`flex items-center gap-2 rounded-lg px-3 sm:px-4 py-2 text-sm font-medium transition-all ${
                mode === 'simulator'
                  ? 'bg-white/10 text-white'
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              <Sparkles size={14} />
              <span className="hidden sm:inline">Simulator</span>
            </button>
            <button
              onClick={() => setMode('comparison')}
              className={`flex items-center gap-2 rounded-lg px-3 sm:px-4 py-2 text-sm font-medium transition-all ${
                mode === 'comparison'
                  ? 'bg-white/10 text-white'
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              <BarChart3 size={14} />
              <span className="hidden sm:inline">Compare All</span>
            </button>
          </div>
        </header>

        {/* Planet Selector */}
        <div className="mb-6">
          <PlanetSelector
            planets={planets}
            selected={selected}
            onSelect={setSelected}
          />
        </div>

        {/* Controls */}
        <div className="mb-6">
          <ControlPanel
            velocity={velocity}
            angle={angle}
            showTrajectory={showTrajectory}
            onVelocityChange={setVelocity}
            onAngleChange={setAngle}
            onToggleTrajectory={() => setShowTrajectory((s) => !s)}
            onReplay={handleReplay}
            onReset={handleReset}
          />
        </div>

        {/* Main Content */}
        {mode === 'simulator' ? (
          <div className="flex flex-col gap-4">
            <PlanetInfo planet={selected} />

            <div className="rounded-2xl bg-white/[0.02] border border-white/10 overflow-hidden h-[380px] sm:h-[440px] relative">
              <SimulationCanvas
                key={`${selected.id}-${velocity}-${angle}-${replayKey}`}
                planet={selected}
                result={result}
                showTrajectory={showTrajectory}
              />
              <div className="absolute top-3 right-4 text-xs font-mono text-white/30">
                v₀ = {velocity} m/s · θ = {angle}° · g = {selected.gravity} m/s²
              </div>
            </div>

            <StatsPanel planet={selected} result={result} />
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl bg-white/[0.03] border border-white/10 px-6 py-4">
              <p className="text-sm text-white/50">
                Launching a projectile at{' '}
                <span className="text-white font-semibold">{velocity} m/s</span>{' '}
                at <span className="text-white font-semibold">{angle}°</span> on
                every body in the solar system. See how far it would travel on
                each one.
              </p>
            </div>
            <ComparisonTable rows={comparisonRows} />
          </div>
        )}

        {/* Footer */}
        <footer className="mt-8 text-center text-xs text-white/20">
          Physics: projectile motion with constant gravity · No air resistance ·
          Flat surface approximation
        </footer>
      </div>
    </div>
  );
}
