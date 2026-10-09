import { useEffect, useRef } from 'react';
import type { Planet } from '@/planets';
import type { SimulationResult } from '@/physics';

interface SimulationCanvasProps {
  planet: Planet;
  result: SimulationResult;
  showTrajectory: boolean;
}

export default function SimulationCanvas({
  planet,
  result,
  showTrajectory,
}: SimulationCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const progressRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    function resize() {
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    window.addEventListener('resize', resize);

    return () => window.removeEventListener('resize', resize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    cancelAnimationFrame(animRef.current);
    progressRef.current = 0;

    // Animation speed scales with gravity: low-gravity worlds feel slow and
    // floaty, high-gravity worlds feel fast and snappy. Normalized to Earth.
    const gravityRatio = Math.sqrt(planet.gravity / 9.81);
    const progressPerFrame = 0.008 * Math.max(0.15, Math.min(3, gravityRatio));

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;

    const padLeft = 60;
    const padRight = 30;
    const padTop = 40;
    const padBottom = 50;

    const simW = w - padLeft - padRight;
    const simH = h - padTop - padBottom;

    const maxX = Math.max(result.maxRange * 1.15, 10);
    const maxY = Math.max(result.maxHeight * 1.2, 5);

    const scaleX = simW / maxX;
    const scaleY = simH / maxY;
    const scale = Math.min(scaleX, scaleY);

    const groundY = padTop + simH;
    const launchX = padLeft;

    function toScreen(x: number, y: number): [number, number] {
      return [launchX + x * scale, groundY - y * scale];
    }

    function drawGrid() {
      if (!ctx) return;

      // Ground
      const groundGradient = ctx.createLinearGradient(0, groundY, 0, h);
      groundGradient.addColorStop(0, `${planet.color}33`);
      groundGradient.addColorStop(1, `${planet.color}08`);
      ctx.fillStyle = groundGradient;
      ctx.fillRect(padLeft - 10, groundY, simW + 40, h - groundY);

      // Ground line
      ctx.strokeStyle = `${planet.color}88`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(padLeft - 10, groundY);
      ctx.lineTo(padLeft + simW + 10, groundY);
      ctx.stroke();

      // Grid lines
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 1;
      ctx.font = '11px monospace';
      ctx.fillStyle = 'rgba(255,255,255,0.35)';

      const xStep = niceStep(maxX / 6);
      for (let gx = 0; gx <= maxX; gx += xStep) {
        const [sx] = toScreen(gx, 0);
        ctx.beginPath();
        ctx.moveTo(sx, padTop);
        ctx.lineTo(sx, groundY);
        ctx.stroke();
        ctx.fillText(formatDist(gx), sx + 3, groundY + 18);
      }

      const yStep = niceStep(maxY / 5);
      for (let gy = 0; gy <= maxY; gy += yStep) {
        const [, sy] = toScreen(0, gy);
        ctx.beginPath();
        ctx.moveTo(padLeft, sy);
        ctx.lineTo(padLeft + simW, sy);
        ctx.stroke();
        ctx.fillText(formatDist(gy), 5, sy - 3);
      }
    }

    function drawPlanetCurve() {
      if (!ctx) return;
      // Draw a subtle planet curvature at the bottom
      const planetRadiusPx = (planet.radiusKm * 1000) / (maxX / simW);
      if (planetRadiusPx > groundY + 500) return; // too large to draw

      ctx.strokeStyle = `${planet.color}22`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      const cx = launchX + simW / 2;
      const cy = groundY + planetRadiusPx;
      const r = planetRadiusPx;
      const startAngle = Math.PI + 0.3;
      const endAngle = Math.PI * 2 - 0.3;
      ctx.arc(cx, cy, r, startAngle, endAngle);
      ctx.stroke();
    }

    function drawTrajectory(progress: number) {
      if (!ctx || result.points.length === 0) return;

      const visibleCount = Math.floor(result.points.length * progress);
      if (visibleCount < 2) return;

      // Draw full trajectory as faint line
      if (showTrajectory) {
        ctx.strokeStyle = `${planet.color}33`;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        for (let i = 0; i < result.points.length; i++) {
          const p = result.points[i];
          const [sx, sy] = toScreen(p.x, p.y);
          if (i === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        }
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Draw animated portion as bright line
      ctx.strokeStyle = planet.color;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let i = 0; i < visibleCount; i++) {
        const p = result.points[i];
        const [sx, sy] = toScreen(p.x, p.y);
        if (i === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.stroke();

      // Glow effect
      ctx.strokeStyle = `${planet.color}44`;
      ctx.lineWidth = 6;
      ctx.beginPath();
      for (let i = 0; i < visibleCount; i++) {
        const p = result.points[i];
        const [sx, sy] = toScreen(p.x, p.y);
        if (i === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.stroke();

      // Draw projectile at current position
      if (visibleCount > 0 && visibleCount < result.points.length) {
        const p = result.points[visibleCount - 1];
        const [sx, sy] = toScreen(p.x, p.y);

        // Glow
        const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, 12);
        glow.addColorStop(0, planet.color);
        glow.addColorStop(1, `${planet.color}00`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(sx, sy, 12, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(sx, sy, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Launch point
      ctx.fillStyle = planet.color;
      ctx.beginPath();
      ctx.arc(launchX, groundY, 4, 0, Math.PI * 2);
      ctx.fill();

      // Landing point
      if (progress >= 0.98) {
        const last = result.points[result.points.length - 1];
        const [lx, ly] = toScreen(last.x, last.y);
        ctx.fillStyle = planet.color;
        ctx.beginPath();
        ctx.arc(lx, ly, 4, 0, Math.PI * 2);
        ctx.fill();

        // Impact ripple
        ctx.strokeStyle = `${planet.color}88`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(lx, ly, 8, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      drawPlanetCurve();
      drawGrid();
      drawTrajectory(progressRef.current);

      if (progressRef.current < 1) {
        progressRef.current += progressPerFrame;
        if (progressRef.current > 1) progressRef.current = 1;
        animRef.current = requestAnimationFrame(animate);
      }
    }

    animate();

    return () => cancelAnimationFrame(animRef.current);
  }, [planet, result, showTrajectory, planet.radiusKm]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block"
      style={{ background: 'transparent' }}
    />
  );
}

function niceStep(value: number): number {
  if (value <= 0) return 1;
  const mag = Math.pow(10, Math.floor(Math.log10(value)));
  const norm = value / mag;
  let step: number;
  if (norm < 1.5) step = 1;
  else if (norm < 3) step = 2;
  else if (norm < 7) step = 5;
  else step = 10;
  return step * mag;
}

function formatDist(m: number): string {
  if (m >= 1000) return `${(m / 1000).toFixed(1)}k`;
  return `${m.toFixed(0)}m`;
}
