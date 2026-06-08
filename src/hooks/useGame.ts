export const MAP_PRESETS = {
  "小型":  { cols: 25, rows: 20, width: 500, height: 400 },
  "中型":  { cols: 40, rows: 30, width: 800, height: 600 },
  "大型":  { cols: 55, rows: 40, width: 1100, height: 800 },
  "超大型": { cols: 70, rows: 50, width: 1400, height: 1000 },
};

export const SPEED_PRESETS = {
  "极慢": { interval: 200, increment: 8 },
  "慢速": { interval: 150, increment: 10 },
  "中等": { interval: 120, increment: 12 },
  "快速": { interval: 90, increment: 15 },
  "极速": { interval: 60, increment: 20 },
};

export const DEFAULT_SPEED_PRESET = "中等";
export const DEFAULT_MAP_PRESET = "中型";

type Position = { x: number; y: number };
type Direction = { dx: number; dy: number };

const DIRECTIONS = {
  UP: { dx: 0, dy: -1 },
  DOWN: { dx: 0, dy: 1 },
  LEFT: { dx: -1, dy: 0 },
  RIGHT: { dx: 1, dy: 0 },
};

const OPPOSITES = {
  UP: "DOWN",
  DOWN: "UP",
  LEFT: "RIGHT",
  RIGHT: "LEFT",
} as const;

type DirKey = keyof typeof DIRECTIONS;

const GRID_SIZE = 20;

export interface GameState {
  snake: Position[];
  direction: DirKey;
  nextDir: DirKey;
  food: Position;
  score: number;
  speed: number;
  isGameOver: boolean;
  isPaused: boolean;
  wallPass: boolean;
  speedName: string;
  mapName: string;
  gridCols: number;
  gridRows: number;
}

function randomFood(snake: Position[], gridCols: number, gridRows: number): Position {
  let pos: Position;
  do {
    pos = {
      x: Math.floor(Math.random() * gridCols),
      y: Math.floor(Math.random() * gridRows),
    };
  } while (snake.some(s => s.x === pos.x && s.y === pos.y));
  return pos;
}

export function createInitialState(config?: {
  speedName?: string;
  mapName?: string;
  wallPass?: boolean;
}): GameState {
  const speedName = config?.speedName ?? DEFAULT_SPEED_PRESET;
  const mapName = config?.mapName ?? DEFAULT_MAP_PRESET;
  const wallPass = config?.wallPass ?? false;
  const mapPreset = MAP_PRESETS[mapName as keyof typeof MAP_PRESETS] ?? MAP_PRESETS[DEFAULT_MAP_PRESET];
  const speedInterval = SPEED_PRESETS[speedName as keyof typeof SPEED_PRESETS]?.interval ?? SPEED_PRESETS[DEFAULT_SPEED_PRESET].interval;
  const gridCols = mapPreset.cols;
  const gridRows = mapPreset.rows;

  const startX = Math.floor(gridCols / 4);
  const startY = Math.floor(gridRows / 2);
  const snake: Position[] = [
    { x: startX, y: startY },
    { x: startX - 1, y: startY },
    { x: startX - 2, y: startY },
  ];
  return {
    snake,
    direction: "RIGHT",
    nextDir: "RIGHT",
    food: randomFood(snake, gridCols, gridRows),
    score: 0,
    speed: speedInterval,
    isGameOver: false,
    isPaused: false,
    wallPass,
    speedName,
    mapName,
    gridCols,
    gridRows,
  };
}

export interface GameActions {
  changeDirection: (dir: DirKey) => void;
  togglePause: () => void;
  reset: () => GameState;
}

export function tick(state: GameState): GameState {
  if (state.isGameOver || state.isPaused) return state;

  const dir = state.nextDir;
  const d = DIRECTIONS[dir];
  const head = state.snake[0];
  let newHead: Position = { x: head.x + d.dx, y: head.y + d.dy };

  // Wall collision / wall pass wrapping
  if (state.wallPass) {
    if (newHead.x < 0) newHead.x = state.gridCols - 1;
    if (newHead.x >= state.gridCols) newHead.x = 0;
    if (newHead.y < 0) newHead.y = state.gridRows - 1;
    if (newHead.y >= state.gridRows) newHead.y = 0;
  } else {
    if (newHead.x < 0 || newHead.x >= state.gridCols || newHead.y < 0 || newHead.y >= state.gridRows) {
      return { ...state, isGameOver: true };
    }
  }

  // Self collision (always checked regardless of wallPass)
  if (state.snake.some(s => s.x === newHead.x && s.y === newHead.y)) {
    return { ...state, isGameOver: true };
  }

  const ate = newHead.x === state.food.x && newHead.y === state.food.y;
  const newSnake = [newHead, ...state.snake];
  if (!ate) newSnake.pop();

  const speedPreset = SPEED_PRESETS[state.speedName as keyof typeof SPEED_PRESETS];
  const decrement = speedPreset?.increment ?? SPEED_PRESETS[DEFAULT_SPEED_PRESET].interval;
  const minSpeed = 60;

  return {
    ...state,
    snake: newSnake,
    direction: dir,
    food: ate ? randomFood(newSnake, state.gridCols, state.gridRows) : state.food,
    score: ate ? state.score + 1 : state.score,
    speed: ate ? Math.max(state.speed - decrement, minSpeed) : state.speed,
  };
}

export function changeDirection(state: GameState, dir: DirKey): GameState {
  if (OPPOSITES[dir] === state.direction) return state;
  return { ...state, nextDir: dir };
}

export function getSpeedValue(speedName: string): number {
  const preset = SPEED_PRESETS[speedName as keyof typeof SPEED_PRESETS];
  return preset?.interval ?? SPEED_PRESETS[DEFAULT_SPEED_PRESET].interval;
}

export { GRID_SIZE, DIRECTIONS, type DirKey };
