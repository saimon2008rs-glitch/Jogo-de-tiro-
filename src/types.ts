export interface Target {
  id: string;
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  points: number;
  type: 'normal' | 'bonus' | 'penalty';
  color: string;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
  type: 'slowmo' | 'time' | 'double';
}

export interface GameState {
  score: number;
  coins: number;
  timeLeft: number;
  isActive: boolean;
  isGameOver: boolean;
  level: number;
  highScore: number;
  activePowerUps: {
    slowmo: number; // timestamp until it ends
    double: number; // timestamp until it ends
  };
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}
