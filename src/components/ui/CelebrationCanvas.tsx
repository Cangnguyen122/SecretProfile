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

type FloatingHeart = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  hue: number;
  alpha: number;
  rotate: number;
  rotateSpeed: number;
  wobble: number;
};

type Twinkle = {
  x: number;
  y: number;
  size: number;
  hue: number;
  phase: number;
  speed: number;
};

type QualityProfile = {
  balloonCount: number;
  minBalloonCount: number;

  bloomsPerWave: number;
  sparkInterval: number;
  maxParticles: number;
  particlesMin: number;
  particlesMax: number;

  heartCount: number;
  minHeartCount: number;

  twinkleCount: number;

  dprCap: number;
  drawSparkCross: boolean;
  enableShadows: boolean;
};

const colors = [342, 322, 288, 214, 166, 48, 18];

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function getQualityProfile(prefersReducedMotion: boolean): QualityProfile {
  const screenWidth = window.innerWidth;

  if (prefersReducedMotion) {
    return {
      balloonCount: 4,
      minBalloonCount: 3,

      bloomsPerWave: 1,
      sparkInterval: 1500,
      maxParticles: 80,
      particlesMin: 7,
      particlesMax: 12,

      heartCount: 4,
      minHeartCount: 2,

      twinkleCount: 8,

      dprCap: 1,
      drawSparkCross: false,
      enableShadows: false,
    };
  }

  if (screenWidth < 640) {
    return {
      balloonCount: 7,
      minBalloonCount: 4,

      bloomsPerWave: 2,
      sparkInterval: 460,
      maxParticles: 170,
      particlesMin: 8,
      particlesMax: 14,

      heartCount: 9,
      minHeartCount: 5,

      twinkleCount: 14,

      dprCap: 1.15,
      drawSparkCross: false,
      enableShadows: false,
    };
  }

  if (screenWidth < 1024) {
    return {
      balloonCount: 11,
      minBalloonCount: 6,

      bloomsPerWave: 3,
      sparkInterval: 340,
      maxParticles: 300,
      particlesMin: 10,
      particlesMax: 18,

      heartCount: 14,
      minHeartCount: 8,

      twinkleCount: 22,

      dprCap: 1.35,
      drawSparkCross: true,
      enableShadows: true,
    };
  }

  return {
    balloonCount: 16,
    minBalloonCount: 8,

    bloomsPerWave: 5,
    sparkInterval: 230,
    maxParticles: 620,
    particlesMin: 10,
    particlesMax: 18,

    heartCount: 22,
    minHeartCount: 12,

    twinkleCount: 36,

    dprCap: 1.55,
    drawSparkCross: true,
    enableShadows: true,
  };
}

function createBalloon(width: number, height: number, index: number): Balloon {
  const isSmallScreen = window.innerWidth < 640;
  const radius = isSmallScreen ? rand(18, 31) : rand(22, 40);

  return {
    x: rand(radius + 12, Math.max(radius + 24, width - radius - 12)),
    y: rand(height * 0.22, height + radius * 2),
    vx: rand(-0.52, 0.52),
    vy: rand(-0.44, -0.1),
    r: radius,
    hue: colors[index % colors.length],
    wobble: rand(0, Math.PI * 2),
  };
}

function createHeart(width: number, height: number, index: number): FloatingHeart {
  const size = window.innerWidth < 640 ? rand(10, 18) : rand(12, 24);

  return {
    x: rand(20, Math.max(40, width - 20)),
    y: rand(height * 0.35, height + 160),
    vx: rand(-0.08, 0.08),
    vy: rand(0.28, 0.78),
    size,
    hue: colors[index % colors.length],
    alpha: rand(0.22, 0.58),
    rotate: rand(-0.45, 0.45),
    rotateSpeed: rand(-0.004, 0.004),
    wobble: rand(0, Math.PI * 2),
  };
}

function createTwinkle(width: number, height: number, index: number): Twinkle {
  return {
    x: rand(width * 0.04, width * 0.96),
    y: rand(height * 0.04, height * 0.82),
    size: rand(1.2, 3.4),
    hue: colors[index % colors.length],
    phase: rand(0, Math.PI * 2),
    speed: rand(0.015, 0.035),
  };
}

function syncArrayCount<T>(
  items: T[],
  targetCount: number,
  createItem: (index: number) => T,
) {
  while (items.length < targetCount) {
    items.push(createItem(items.length));
  }

  while (items.length > targetCount) {
    items.pop();
  }
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

  const impulse = speed * 0.9;

  a.vx += impulse * nx;
  a.vy += impulse * ny;
  b.vx -= impulse * nx;
  b.vy -= impulse * ny;
}

function spawnSparkBloom(
  width: number,
  height: number,
  particles: Particle[],
  profile: QualityProfile,
  qualityScale: number,
) {
  if (width <= 0 || height <= 0) return;

  const x = rand(width * 0.1, width * 0.9);
  const y = rand(height * 0.08, height * 0.62);
  const hue = colors[Math.floor(rand(0, colors.length))];

  const count = Math.max(
    6,
    Math.floor(rand(profile.particlesMin, profile.particlesMax) / Math.sqrt(qualityScale)),
  );

  for (let i = 0; i < count; i += 1) {
    const angle = (Math.PI * 2 * i) / count + rand(-0.22, 0.22);
    const speed = rand(1.2, 4.9);

    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0,
      maxLife: rand(32, 60),
      hue: hue + rand(-18, 18),
      size: rand(1, 3.1),
    });
  }
}

export function CelebrationCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    let width = 0;
    let height = 0;
    let frame = 0;

    let animationId = 0;
    let resizeAnimationId = 0;

    let lastSparkAt = 0;
    let lastFpsCheckAt = performance.now();
    let framesSinceCheck = 0;

    let qualityScale = 1;
    let isInView = true;
    let isPageVisible = !document.hidden;

    let profile = getQualityProfile(prefersReducedMotion);

    const balloons: Balloon[] = [];
    const particles: Particle[] = [];
    const hearts: FloatingHeart[] = [];
    const twinkles: Twinkle[] = [];

    const applyResponsiveCounts = () => {
      const targetBalloonCount = Math.max(
        profile.minBalloonCount,
        Math.floor(profile.balloonCount / qualityScale),
      );

      const targetHeartCount = Math.max(
        profile.minHeartCount,
        Math.floor(profile.heartCount / qualityScale),
      );

      const targetTwinkleCount = Math.floor(profile.twinkleCount / Math.sqrt(qualityScale));

      syncArrayCount(balloons, targetBalloonCount, (index) =>
        createBalloon(width, height, index),
      );

      syncArrayCount(hearts, targetHeartCount, (index) =>
        createHeart(width, height, index),
      );

      syncArrayCount(twinkles, targetTwinkleCount, (index) =>
        createTwinkle(width, height, index),
      );
    };

    const resize = () => {
      profile = getQualityProfile(prefersReducedMotion);

      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, profile.dprCap);

      width = rect.width;
      height = rect.height;

      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));

      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      qualityScale = clamp(qualityScale, 0.9, 2.35);
      applyResponsiveCounts();
    };

    const requestResize = () => {
      window.cancelAnimationFrame(resizeAnimationId);
      resizeAnimationId = window.requestAnimationFrame(resize);
    };

    const updateAdaptiveQuality = (time: number) => {
      framesSinceCheck += 1;

      if (time - lastFpsCheckAt < 1000) return;

      const fps = (framesSinceCheck * 1000) / (time - lastFpsCheckAt);

      if (fps < 42) {
        qualityScale = Math.min(2.35, qualityScale + 0.25);
      } else if (fps > 56) {
        qualityScale = Math.max(0.85, qualityScale - 0.12);
      }

      applyResponsiveCounts();

      const currentMaxParticles = Math.floor(profile.maxParticles / qualityScale);
      if (particles.length > currentMaxParticles) {
        particles.splice(0, particles.length - currentMaxParticles);
      }

      framesSinceCheck = 0;
      lastFpsCheckAt = time;
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

    const drawHeart = (heart: FloatingHeart) => {
      const wobbleX = Math.sin(frame * 0.018 + heart.wobble) * 12;
      const scale = heart.size / 32;

      context.save();
      context.translate(heart.x + wobbleX, heart.y);
      context.rotate(heart.rotate);
      context.scale(scale, scale);
      context.globalAlpha = heart.alpha;

      context.beginPath();
      context.moveTo(0, 10);
      context.bezierCurveTo(-26, -8, -34, 18, 0, 34);
      context.bezierCurveTo(34, 18, 26, -8, 0, 10);
      context.closePath();

      context.fillStyle = `hsla(${heart.hue}, 88%, 62%, 0.85)`;

      if (profile.enableShadows && qualityScale < 1.7) {
        context.shadowBlur = 14;
        context.shadowColor = `hsla(${heart.hue}, 90%, 66%, 0.5)`;
      }

      context.fill();
      context.restore();
    };

    const drawTwinkle = (twinkle: Twinkle) => {
      const pulse = (Math.sin(frame * twinkle.speed + twinkle.phase) + 1) / 2;
      const alpha = 0.12 + pulse * 0.52;
      const size = twinkle.size * (0.65 + pulse * 1.1);

      context.save();
      context.globalAlpha = alpha;
      context.strokeStyle = `hsla(${twinkle.hue}, 95%, 78%, 0.9)`;
      context.lineWidth = 1.2;

      context.beginPath();
      context.moveTo(twinkle.x - size * 2.2, twinkle.y);
      context.lineTo(twinkle.x + size * 2.2, twinkle.y);
      context.moveTo(twinkle.x, twinkle.y - size * 2.2);
      context.lineTo(twinkle.x, twinkle.y + size * 2.2);
      context.stroke();

      context.beginPath();
      context.arc(twinkle.x, twinkle.y, size * 0.72, 0, Math.PI * 2);
      context.fillStyle = `hsla(${twinkle.hue}, 95%, 84%, 0.65)`;
      context.fill();

      context.restore();
    };

    const updateBalloons = () => {
      const shouldCheckCollision = qualityScale < 1.8 || frame % 2 === 0;

      if (shouldCheckCollision) {
        for (let i = 0; i < balloons.length; i += 1) {
          for (let j = i + 1; j < balloons.length; j += 1) {
            resolveBalloonCollision(balloons[i], balloons[j]);
          }
        }
      }

      balloons.forEach((balloon) => {
        balloon.x += balloon.vx + Math.sin(frame * 0.012 + balloon.wobble) * 0.12;
        balloon.y += balloon.vy;
        balloon.vy -= 0.0015;

        if (balloon.x < balloon.r || balloon.x > width - balloon.r) {
          balloon.vx *= -0.96;
          balloon.x = clamp(balloon.x, balloon.r, width - balloon.r);
        }

        if (balloon.y < -balloon.r * 3) {
          balloon.y = height + balloon.r * 2;
          balloon.x = rand(balloon.r, Math.max(balloon.r + 1, width - balloon.r));
          balloon.vy = rand(-0.44, -0.11);
          balloon.vx = rand(-0.52, 0.52);
        }

        drawBalloon(balloon);
      });
    };

    const updateHearts = () => {
      hearts.forEach((heart, index) => {
        heart.x += heart.vx;
        heart.y -= heart.vy;
        heart.rotate += heart.rotateSpeed;

        if (heart.y < -heart.size * 4) {
          hearts[index] = createHeart(width, height, index);
          hearts[index].y = height + rand(30, 160);
        }

        if (heart.x < -40) heart.x = width + 40;
        if (heart.x > width + 40) heart.x = -40;

        drawHeart(heart);
      });
    };

    const updateParticles = () => {
      context.save();
      context.globalCompositeOperation = "lighter";

      const useGlow = profile.enableShadows && qualityScale < 1.85;

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

        if (useGlow) {
          context.shadowBlur = 7 * alpha;
          context.shadowColor = `hsl(${particle.hue}, 95%, 68%)`;
        } else {
          context.shadowBlur = 0;
        }

        context.beginPath();
        context.arc(
          particle.x,
          particle.y,
          particle.size * (1 + alpha),
          0,
          Math.PI * 2,
        );
        context.fillStyle = `hsl(${particle.hue}, 96%, ${60 + alpha * 24}%)`;
        context.fill();

        if (profile.drawSparkCross && qualityScale < 1.5 && particle.life % 4 === 0) {
          context.beginPath();
          context.moveTo(particle.x - particle.size * 3, particle.y);
          context.lineTo(particle.x + particle.size * 3, particle.y);
          context.moveTo(particle.x, particle.y - particle.size * 3);
          context.lineTo(particle.x, particle.y + particle.size * 3);
          context.strokeStyle = `hsla(${particle.hue}, 96%, 78%, ${alpha * 0.5})`;
          context.lineWidth = 0.8;
          context.stroke();
        }

        context.globalAlpha = 1;

        if (particle.life >= particle.maxLife) {
          particles.splice(i, 1);
        }
      }

      context.restore();
    };

    const tick = (time: number) => {
      if (!isInView || !isPageVisible) {
        animationId = window.requestAnimationFrame(tick);
        return;
      }

      updateAdaptiveQuality(time);

      frame += 1;
      context.clearRect(0, 0, width, height);

      twinkles.forEach(drawTwinkle);

      const currentSparkInterval = profile.sparkInterval * qualityScale;
      const currentMaxParticles = Math.floor(profile.maxParticles / qualityScale);

      if (time - lastSparkAt > currentSparkInterval) {
        const bloomCount = Math.max(
          1,
          Math.floor(profile.bloomsPerWave / Math.sqrt(qualityScale)),
        );

        for (let i = 0; i < bloomCount; i += 1) {
          spawnSparkBloom(width, height, particles, profile, qualityScale);
        }

        if (particles.length > currentMaxParticles) {
          particles.splice(0, particles.length - currentMaxParticles);
        }

        lastSparkAt = time;
      }

      updateParticles();
      updateBalloons();
      updateHearts();

      animationId = window.requestAnimationFrame(tick);
    };

    const handleVisibilityChange = () => {
      isPageVisible = !document.hidden;

      if (!isPageVisible) {
        particles.length = 0;
        context.clearRect(0, 0, width, height);
      }
    };

    resize();

    const firstBloomCount = prefersReducedMotion ? 1 : window.innerWidth < 640 ? 2 : 5;
    for (let i = 0; i < firstBloomCount; i += 1) {
      spawnSparkBloom(width, height, particles, profile, qualityScale);
    }

    animationId = window.requestAnimationFrame(tick);

    window.addEventListener("resize", requestResize);
    document.addEventListener("visibilitychange", handleVisibilityChange);

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
      window.cancelAnimationFrame(resizeAnimationId);

      window.removeEventListener("resize", requestResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
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