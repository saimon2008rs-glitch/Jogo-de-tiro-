import React, { useEffect, useRef, useState } from 'react';
import { Target, Particle } from '../types';
import { GAME_WIDTH, GAME_HEIGHT, TARGET_RADIUS, COLORS } from '../constants';

interface GameCanvasProps {
  onScoreUpdate: (points: number) => void;
  onGameOver: () => void;
  isActive: boolean;
  level: number;
  isSlowMo: boolean;
  isDoublePoints: boolean;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ 
  onScoreUpdate, 
  onGameOver, 
  isActive, 
  level,
  isSlowMo,
  isDoublePoints
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const targetsRef = useRef<Target[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const requestRef = useRef<number>(null);
  const lastSpawnRef = useRef<number>(0);

  const spawnTarget = () => {
    const side = Math.floor(Math.random() * 4);
    let x, y, vx, vy;
    const speed = 2 + level * 0.5;

    if (side === 0) { // Top
      x = Math.random() * GAME_WIDTH;
      y = -TARGET_RADIUS;
      vx = (Math.random() - 0.5) * speed;
      vy = Math.random() * speed + 1;
    } else if (side === 1) { // Right
      x = GAME_WIDTH + TARGET_RADIUS;
      y = Math.random() * GAME_HEIGHT;
      vx = -(Math.random() * speed + 1);
      vy = (Math.random() - 0.5) * speed;
    } else if (side === 2) { // Bottom
      x = Math.random() * GAME_WIDTH;
      y = GAME_HEIGHT + TARGET_RADIUS;
      vx = (Math.random() - 0.5) * speed;
      vy = -(Math.random() * speed + 1);
    } else { // Left
      x = -TARGET_RADIUS;
      y = Math.random() * GAME_HEIGHT;
      vx = Math.random() * speed + 1;
      vy = (Math.random() - 0.5) * speed;
    }

    const typeRand = Math.random();
    let type: Target['type'] = 'normal';
    let color = COLORS.target;
    let points = 10;

    if (typeRand > 0.9) {
      type = 'bonus';
      color = COLORS.bonus;
      points = 50;
    } else if (typeRand > 0.8) {
      type = 'penalty';
      color = COLORS.penalty;
      points = -20;
    }

    const newTarget: Target = {
      id: Math.random().toString(36).substr(2, 9),
      x, y, vx, vy, radius: TARGET_RADIUS, points, type, color
    };

    targetsRef.current.push(newTarget);
  };

  const createExplosion = (x: number, y: number, color: string) => {
    for (let i = 0; i < 10; i++) {
      particlesRef.current.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        life: 1,
        color
      });
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    let hit = false;
    targetsRef.current = targetsRef.current.filter(target => {
      const dist = Math.sqrt((mouseX - target.x) ** 2 + (mouseY - target.y) ** 2);
      if (dist < target.radius) {
        const finalPoints = isDoublePoints ? target.points * 2 : target.points;
        onScoreUpdate(finalPoints);
        createExplosion(target.x, target.y, target.color);
        hit = true;
        return false;
      }
      return true;
    });
  };

  const update = (time: number) => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    // Spawn logic
    if (time - lastSpawnRef.current > Math.max(200, 1000 - level * 100)) {
      spawnTarget();
      lastSpawnRef.current = time;
    }

    // Clear
    ctx.fillStyle = COLORS.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Slow mo effect overlay
    if (isSlowMo) {
      ctx.fillStyle = 'rgba(56, 189, 248, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Grid effect
    ctx.strokeStyle = isSlowMo ? 'rgba(56, 189, 248, 0.1)' : 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 50) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // Update targets
    targetsRef.current.forEach(target => {
      const speedMult = isSlowMo ? 0.3 : 1;
      target.x += target.vx * speedMult;
      target.y += target.vy * speedMult;

      // Draw target
      ctx.beginPath();
      ctx.arc(target.x, target.y, target.radius, 0, Math.PI * 2);
      ctx.fillStyle = target.color;
      ctx.fill();
      
      // Rings
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      ctx.beginPath();
      ctx.arc(target.x, target.y, target.radius * 0.6, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.arc(target.x, target.y, target.radius * 0.2, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Remove off-screen targets
    targetsRef.current = targetsRef.current.filter(t => 
      t.x > -100 && t.x < GAME_WIDTH + 100 && t.y > -100 && t.y < GAME_HEIGHT + 100
    );

    // Update particles
    particlesRef.current.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.02;

      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, 4, 4);
    });
    ctx.globalAlpha = 1;
    particlesRef.current = particlesRef.current.filter(p => p.life > 0);

    requestRef.current = requestAnimationFrame(update);
  };

  useEffect(() => {
    if (isActive) {
      requestRef.current = requestAnimationFrame(update);
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isActive, level]);

  return (
    <canvas
      ref={canvasRef}
      width={GAME_WIDTH}
      height={GAME_HEIGHT}
      onClick={handleCanvasClick}
      className="w-full h-auto max-w-4xl rounded-lg shadow-2xl cursor-crosshair border-4 border-slate-800"
      id="game-canvas"
    />
  );
};

export default GameCanvas;
