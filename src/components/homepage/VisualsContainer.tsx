'use client';

import React, { useEffect, useRef, useState } from 'react';

const Constellation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0 }
    );

    const currentCanvas = canvasRef.current;
    if (currentCanvas) {
      observer.observe(currentCanvas);
    }

    return () => {
      if (currentCanvas) {
        observer.unobserve(currentCanvas);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    
    // Set initial dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const primaryColor = '221 63% 45%';
    const mutedColor = '220 14% 50%';
    const particleColor = `hsl(${primaryColor})`;
    const lineColor = `hsla(${mutedColor}, 0.2)`;

    let particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
    }[] = [];

    const createParticles = () => {
        particles = [];
        const numParticles = 80;
        for (let i = 0; i < numParticles; i++) {
            particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: Math.random() * 0.3 - 0.15,
            vy: Math.random() * 0.3 - 0.15,
            radius: Math.random() * 1.2 + 0.5,
            });
        }
    }

    createParticles();

    const draw = () => {
      if(!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = particleColor;
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 0.4;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createParticles();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible]);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" />;
};


export default function VisualsContainer() {
  return (
    <div
      className="pointer-events-none absolute inset-0 h-screen w-full"
    >
      <Constellation />
    </div>
  );
}
