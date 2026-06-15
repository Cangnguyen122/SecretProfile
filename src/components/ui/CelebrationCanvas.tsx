import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

type Balloon = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  hue: number;
  wobble: number;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  hue: number;
  size: number;
};

const defaultBalloonCount = 8;
const colors = [342, 322, 288, 214, 166, 48, 18];

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function resolveBalloonCollision(a: Balloon, b: Balloon) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const distance = Math.hypot(dx, dy) || 1;
  const minDistance = a.r + b.r;

  if (distance >= minDistance) return;

  const nx = dx / distance;
  const ny = dy / distance;
  const overlap = (minDistance - distance) / 2;

  a.x -= nx * overlap;
  a.y -= ny * overlap;
  b.x += nx * overlap;
  b.y += ny * overlap;

  const relativeVelocityX = b.vx - a.vx;
  const relativeVelocityY = b.vy - a.vy;
  const speed = relativeVelocityX * nx + relativeVelocityY * ny;

  if (speed > 0) return;

  const impulse = speed * 0.92;
  a.vx += impulse * nx;
  a.vy += impulse * ny;
  b.vx -= impulse * nx;
  b.vy -= impulse * ny;
}

function spawnSparkBloom(width: number, height: number, particles: Particle[]) {
  const x = rand(width * 0.12, width * 0.88);
  const y = rand(height * 0.1, height * 0.64);
  const hue = colors[Math.floor(rand(0, colors.length))];
  const count = Math.floor(rand(14, 24));

  for (let i = 0; i < count; i += 1) {
    const angle = (Math.PI * 2 * i) / count + rand(-0.18, 0.18);
    const speed = rand(1.1, 4.9);
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0,
      maxLife: rand(34, 62),
      hue: hue + rand(-18, 18),
      size: rand(1.1, 3.2),
    });
  }
}

export function CelebrationCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let width = 0;
    let height = 0;
    let frame = 0;
    let animationId = 0;
    let lastSparkAt = 0;
    let isInView = true;
    const isSmallScreen = window.innerWidth < 640;
    const activeBalloonCount = prefersReducedMotion ? 4 : isSmallScreen ? 5 : defaultBalloonCount;
    const sparkInterval = prefersReducedMotion ? 1500 : isSmallScreen ? 520 : 300;
    const maxParticles = prefersReducedMotion ? 90 : isSmallScreen ? 170 : 320;
    const balloons: Balloon[] = [];
    const particles: Particle[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (balloons.length === 0) {
        for (let i = 0; i < activeBalloonCount; i += 1) {
          balloons.push({
            x: rand(60, Math.max(80, width - 60)),
            y: rand(height * 0.22, height * 0.92),
            vx: rand(-0.58, 0.58),
            vy: rand(-0.42, -0.08),
            r: rand(22, 39),
            hue: colors[i % colors.length],
            wobble: rand(0, Math.PI * 2),
          });
        }
      }
    };

    const drawBalloon = (balloon: Balloon) => {
      const wobbleX = Math.sin(frame * 0.018 + balloon.wobble) * 6;
      const x = balloon.x + wobbleX;
      const y = balloon.y;
      const gradient = context.createRadialGradient(
        x - balloon.r * 0.35,
        y - balloon.r * 0.45,
        2,
        x,
        y,
        balloon.r * 1.2,
      );
      gradient.addColorStop(0, "rgba(255,255,255,0.95)");
      gradient.addColorStop(0.35, `hsla(${balloon.hue}, 92%, 78%, 0.92)`);
      gradient.addColorStop(1, `hsla(${balloon.hue}, 76%, 48%, 0.9)`);

      context.save();
      context.translate(x, y);
      context.beginPath();
      context.ellipse(0, 0, balloon.r * 0.82, balloon.r * 1.04, 0, 0, Math.PI * 2);
      context.fillStyle = gradient;
      context.fill();
      context.globalAlpha = 0.35;
      context.beginPath();
      context.arc(-balloon.r * 0.28, -balloon.r * 0.36, balloon.r * 0.18, 0, Math.PI * 2);
      context.fillStyle = "#fff";
      context.fill();
      context.globalAlpha = 0.38;
      context.beginPath();
      context.moveTo(0, balloon.r * 1.02);
      context.bezierCurveTo(10, balloon.r * 1.55, -10, balloon.r * 2.05, 3, balloon.r * 2.7);
      context.strokeStyle = `hsla(${balloon.hue}, 48%, 35%, 0.55)`;
      context.lineWidth = 1.2;
      context.stroke();
      context.restore();
    };

    const tick = (time: number) => {
      if (!isInView || document.hidden) {
        animationId = window.requestAnimationFrame(tick);
        return;
      }

      frame += 1;
      context.clearRect(0, 0, width, height);

      if (time - lastSparkAt > sparkInterval) {
        spawnSparkBloom(width, height, particles);
        if (particles.length > maxParticles) {
          particles.splice(0, particles.length - maxParticles);
        }
        lastSparkAt = time;
      }

      for (let i = 0; i < balloons.length; i += 1) {
        for (let j = i + 1; j < balloons.length; j += 1) {
          resolveBalloonCollision(balloons[i], balloons[j]);
        }
      }

      balloons.forEach((balloon) => {
        balloon.x += balloon.vx + Math.sin(frame * 0.012 + balloon.wobble) * 0.12;
        balloon.y += balloon.vy;
        balloon.vy -= 0.0015;

        if (balloon.x < balloon.r || balloon.x > width - balloon.r) {
          balloon.vx *= -0.96;
          balloon.x = Math.max(balloon.r, Math.min(width - balloon.r, balloon.x));
        }

        if (balloon.y < -balloon.r * 3) {
          balloon.y = height + balloon.r * 2;
          balloon.x = rand(balloon.r, width - balloon.r);
          balloon.vy = rand(-0.42, -0.1);
          balloon.vx = rand(-0.58, 0.58);
        }

        drawBalloon(balloon);
      });

      context.save();
      context.globalCompositeOperation = "lighter";
      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const particle = particles[i];
        particle.life += 1;
        particle.vy += 0.018;
        particle.vx *= 0.988;
        particle.vy *= 0.988;
        particle.x += particle.vx;
        particle.y += particle.vy;

        const alpha = Math.max(0, 1 - particle.life / particle.maxLife);
        context.globalAlpha = alpha;
        context.shadowBlur = 8 * alpha;
        context.shadowColor = `hsl(${particle.hue}, 95%, 68%)`;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.size * (1 + alpha), 0, Math.PI * 2);
        context.fillStyle = `hsl(${particle.hue}, 96%, ${60 + alpha * 24}%)`;
        context.fill();

        if (!isSmallScreen && particle.life % 3 === 0) {
          context.beginPath();
          context.moveTo(particle.x - particle.size * 3, particle.y);
          context.lineTo(particle.x + particle.size * 3, particle.y);
          context.moveTo(particle.x, particle.y - particle.size * 3);
          context.lineTo(particle.x, particle.y + particle.size * 3);
          context.strokeStyle = `hsla(${particle.hue}, 96%, 78%, ${alpha * 0.55})`;
          context.lineWidth = 0.8;
          context.stroke();
        }
        context.globalAlpha = 1;

        if (particle.life >= particle.maxLife) particles.splice(i, 1);
      }
      context.restore();

      animationId = window.requestAnimationFrame(tick);
    };

    resize();
    for (let i = 0; i < (isSmallScreen ? 2 : 3); i += 1) {
      spawnSparkBloom(width, height, particles);
    }
    animationId = window.requestAnimationFrame(tick);
    window.addEventListener("resize", resize);
    const observer = new IntersectionObserver(
      ([entry]) => {
        isInView = entry.isIntersecting;
        if (!isInView) {
          particles.length = 0;
          context.clearRect(0, 0, width, height);
        }
      },
      { threshold: 0.12 },
    );
    observer.observe(canvas);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, [prefersReducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
