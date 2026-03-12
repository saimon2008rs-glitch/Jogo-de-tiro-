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
  }
];
