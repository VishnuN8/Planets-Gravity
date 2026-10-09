export interface TrajectoryPoint {
  x: number; // meters from launch point
  y: number; // meters above surface
  t: number; // seconds
  vx: number;
  vy: number;
}

export interface SimulationResult {
  points: TrajectoryPoint[];
  maxRange: number; // meters
  maxHeight: number; // meters
  flightTime: number; // seconds
  impactVelocity: number; // m/s
}

export function simulateProjectile(
  gravity: number,
  initialVelocity: number, // m/s
  angleDeg: number, // degrees
  dt: number = 0.005
): SimulationResult {
  const angle = (angleDeg * Math.PI) / 180;
  let vx = initialVelocity * Math.cos(angle);
  let vy = initialVelocity * Math.sin(angle);

  const points: TrajectoryPoint[] = [];
  let x = 0;
  let y = 0;
  let t = 0;
  let maxHeight = 0;

  points.push({ x, y, t, vx, vy });

  while (y >= 0 || t === 0) {
    vy -= gravity * dt;
    x += vx * dt;
    y += vy * dt;
    t += dt;

    if (y > maxHeight) maxHeight = y;

    points.push({ x, y, t, vx, vy });

    if (t > 120) break; // safety cap
  }

  // Interpolate the exact landing point
  if (points.length >= 2) {
    const last = points[points.length - 1];
    const prev = points[points.length - 2];
    if (last.y < 0 && prev.y >= 0) {
      const frac = prev.y / (prev.y - last.y);
      const landX = prev.x + frac * (last.x - prev.x);
      const landT = prev.t + frac * (last.t - prev.t);
      const landVy = prev.vy + frac * (last.vy - prev.vy);
      points[points.length - 1] = {
        x: landX,
        y: 0,
        t: landT,
        vx: last.vx,
        vy: landVy,
      };
    }
  }

  const finalPoint = points[points.length - 1];
  const impactSpeed = Math.sqrt(
    finalPoint.vx * finalPoint.vx + finalPoint.vy * finalPoint.vy
  );

  return {
    points,
    maxRange: Math.max(0, finalPoint.x),
    maxHeight,
    flightTime: finalPoint.t,
    impactVelocity: impactSpeed,
  };
}

export function formatDistance(meters: number): string {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(2)} km`;
  }
  return `${meters.toFixed(1)} m`;
}

export function formatTime(seconds: number): string {
  if (seconds >= 60) {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}m ${sec.toFixed(1)}s`;
  }
  return `${seconds.toFixed(2)} s`;
}

export function formatSpeed(metersPerSec: number): string {
  return `${metersPerSec.toFixed(1)} m/s`;
}
