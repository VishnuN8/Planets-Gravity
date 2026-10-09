import { useRef, useEffect } from 'react';

interface PlanetSphereProps {
  gradient: string;
  size?: number;
  hasRings?: boolean;
  atmosphere?: string;
  className?: string;
  glow?: boolean;
}

export default function PlanetSphere({
  gradient,
  size = 48,
  hasRings = false,
  atmosphere = 'transparent',
  className = '',
  glow = false,
}: PlanetSphereProps) {
  const planetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const planet = planetRef.current;
    if (!planet) return;
    let frame: number;
    let rotation = 0;

    function rotate() {
      rotation += 0.15;
      if (planet) {
        planet.style.backgroundPosition = `${rotation}px 0`;
      }
      frame = requestAnimationFrame(rotate);
    }

    // Only animate larger planets
    if (size >= 60) {
      rotate();
    }

    return () => cancelAnimationFrame(frame);
  }, [size]);

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {glow && (
        <div
          className="absolute rounded-full"
          style={{
            width: size * 1.4,
            height: size * 1.4,
            background: atmosphere,
            filter: 'blur(8px)',
          }}
        />
      )}
      {hasRings && (
        <div
          className="absolute rounded-[50%] border-2"
          style={{
            width: size * 1.8,
            height: size * 0.5,
            borderColor: 'rgba(255, 255, 255, 0.2)',
            transform: 'rotate(-20deg)',
            borderTopColor: 'rgba(255, 255, 255, 0.35)',
            borderBottomColor: 'rgba(255, 255, 255, 0.1)',
          }}
        />
      )}
      <div
        ref={planetRef}
        className="relative rounded-full overflow-hidden"
        style={{
          width: size,
          height: size,
          background: gradient,
          backgroundSize: '200% 100%',
          boxShadow: `inset -${size * 0.15}px -${size * 0.15}px ${size * 0.3}px rgba(0,0,0,0.5), 0 0 ${size * 0.2}px ${atmosphere}`,
        }}
      >
        {/* Surface texture overlay */}
        <div
          className="absolute inset-0 rounded-full opacity-30"
          style={{
            background:
              'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.2) 0%, transparent 30%)',
          }}
        />
      </div>
    </div>
  );
}
