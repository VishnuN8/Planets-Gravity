import { Zap, Crosshair, Play, RotateCcw, Eye, EyeOff } from 'lucide-react';

interface ControlPanelProps {
  velocity: number;
  angle: number;
  showTrajectory: boolean;
  onVelocityChange: (v: number) => void;
  onAngleChange: (a: number) => void;
  onToggleTrajectory: () => void;
  onReplay: () => void;
  onReset: () => void;
}

export default function ControlPanel({
  velocity,
  angle,
  showTrajectory,
  onVelocityChange,
  onAngleChange,
  onToggleTrajectory,
  onReplay,
  onReset,
}: ControlPanelProps) {
  return (
    <div className="flex flex-wrap items-center gap-6 rounded-2xl bg-white/[0.03] border border-white/10 px-6 py-4">
      {/* Velocity Slider */}
      <div className="flex flex-col gap-2 min-w-[180px] flex-1">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm font-medium text-white/70">
            <Zap size={14} className="text-amber-400" />
            Velocity
          </label>
          <span className="text-sm font-mono text-white font-semibold">
            {velocity.toFixed(0)} m/s
          </span>
        </div>
        <input
          type="range"
          min="1"
          max="200"
          value={velocity}
          onChange={(e) => onVelocityChange(Number(e.target.value))}
          className="slider-amber"
        />
      </div>

      {/* Angle Slider */}
      <div className="flex flex-col gap-2 min-w-[180px] flex-1">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm font-medium text-white/70">
            <Crosshair size={14} className="text-cyan-400" />
            Angle
          </label>
          <span className="text-sm font-mono text-white font-semibold">
            {angle}°
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="90"
          value={angle}
          onChange={(e) => onAngleChange(Number(e.target.value))}
          className="slider-cyan"
        />
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleTrajectory}
          className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-all"
          title="Toggle trajectory preview"
        >
          {showTrajectory ? <Eye size={16} /> : <EyeOff size={16} />}
          <span className="hidden sm:inline">Path</span>
        </button>

        <button
          onClick={onReplay}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/20"
        >
          <Play size={16} />
          <span>Launch</span>
        </button>

        <button
          onClick={onReset}
          className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-all"
          title="Reset to defaults"
        >
          <RotateCcw size={16} />
        </button>
      </div>
    </div>
  );
}
