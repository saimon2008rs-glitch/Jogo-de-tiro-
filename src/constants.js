export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 600;
export const INITIAL_TIME = 30;
export const TARGET_RADIUS = 25;
export const SPAWN_RATE = 1000; // ms

export const COLORS = {
  background: '#0f172a',
  target: '#ef4444',
  bonus: '#10b981',
  penalty: '#f59e0b',
  text: '#f8fafc',
  accent: '#38bdf8',
};

export const SHOP_ITEMS = [
  {
    id: 'slowmo',
    name: 'Slow Motion',
    description: 'Slows down targets for 5 seconds',
    price: 50,
    icon: 'Clock',
    type: 'slowmo'
  },
  {
    id: 'time',
    name: 'Time Warp',
    description: 'Adds 10 seconds to the clock',
    price: 80,
    icon: 'Timer',
    type: 'time'
  },
  {
    id: 'double',
    name: 'Double Points',
    description: '2x points for 10 seconds',
    price: 120,
    icon: 'Zap',
    type: 'double'
  },
  {
    id: 'shield',
    name: 'Shield',
    description: 'Immune to penalty targets for 15s',
    price: 150,
    icon: 'Shield',
    type: 'shield'
  },
  {
    id: 'mega',
    name: 'Mega Target',
    description: 'Targets are 2x larger for 10s',
    price: 200,
    icon: 'Maximize',
    type: 'mega'
  },
  {
    id: 'bot',
    name: 'Auto Bot',
    description: 'Auto-hits targets for 5s',
    price: 350,
    icon: 'Bot',
    type: 'bot'
  }
];
