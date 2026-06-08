import { useRef, useEffect, useCallback, useState } from "react";
import {
  createInitialState, tick, changeDirection, GRID_SIZE,
  MAP_PRESETS, SPEED_PRESETS, DEFAULT_SPEED_PRESET, DEFAULT_MAP_PRESET,
  type DirKey, type GameState,
} from "@/hooks/useGame";
import { RotateCcw, Play, Pause } from "lucide-react";

export interface GameConfig {
  wallPass: boolean;
  speedName: string;
  mapName: string;
}

function darkenColor(hex: string, amount: number): string {
  const r = Math.max(0, parseInt(hex.slice(1, 3), 16) - amount);
  const g = Math.max(0, parseInt(hex.slice(3, 5), 16) - amount);
  const b = Math.max(0, parseInt(hex.slice(5, 7), 16) - amount);
  return `rgb(${r}, ${g}, ${b})`;
}

function getEyePositions(
  headX: number, headY: number, dir: DirKey, size: number
): [{ x: number; y: number }, { x: number; y: number }] {
  const cx = headX + size / 2;
  const cy = headY + size / 2;
  const offset = 5;
  const eyeR = 3;

  switch (dir) {
    case "RIGHT":
      return [
        { x: cx + offset - eyeR, y: cy - offset },
        { x: cx + offset - eyeR, y: cy + offset },
      ];
    case "LEFT":
      return [
        { x: cx - offset + eyeR, y: cy - offset },
        { x: cx - offset + eyeR, y: cy + offset },
      ];
    case "UP":
      return [
        { x: cx - offset, y: cy - offset + eyeR },
        { x: cx + offset, y: cy - offset + eyeR },
      ];
    case "DOWN":
      return [
        { x: cx - offset, y: cy + offset - eyeR },
        { x: cx + offset, y: cy + offset - eyeR },
      ];
  }
}

function ConfigSelector<T extends string>({
  label, options, value, onChange, disabled,
}: {
  label: string;
  options: T[];
  value: T;
  onChange: (v: T) => void;
  disabled: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-snake-text-muted text-xs whitespace-nowrap">{label}:</span>
      <div className="flex gap-1">
        {options.map(opt => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            disabled={disabled}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
              value === opt
                ? "bg-snake-accent text-white shadow-sm"
                : "bg-white/5 text-white/70 hover:bg-white/10"
            } disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<GameState>(createInitialState());
  const animRef = useRef<number>(0);
  const lastTickRef = useRef<number>(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);

  const [config, setConfig] = useState<GameConfig>({
    wallPass: false,
    speedName: DEFAULT_SPEED_PRESET,
    mapName: DEFAULT_MAP_PRESET,
  });

  const configLocked = !gameOver && score > 0;

  const mapPreset = MAP_PRESETS[config.mapName as keyof typeof MAP_PRESETS] ?? MAP_PRESETS[DEFAULT_MAP_PRESET];
  const canvasW = mapPreset.cols * GRID_SIZE;
  const canvasH = mapPreset.rows * GRID_SIZE;

  const draw = useCallback((ctx: CanvasRenderingContext2D, state: GameState) => {
    const w = state.gridCols * GRID_SIZE;
    const h = state.gridRows * GRID_SIZE;

    // Background
    ctx.fillStyle = "#0a1628";
    ctx.fillRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = "rgba(26, 58, 92, 0.3)";
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= w; x += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y <= h; y += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Food
    const fx = state.food.x * GRID_SIZE + GRID_SIZE / 2;
    const fy = state.food.y * GRID_SIZE + GRID_SIZE / 2;
    ctx.beginPath();
    ctx.arc(fx, fy, GRID_SIZE / 2 - 2, 0, Math.PI * 2);
    ctx.fillStyle = "#ff4444";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(fx, fy, GRID_SIZE / 4, 0, Math.PI * 2);
    ctx.fillStyle = "#cc0000";
    ctx.fill();

    // Snake
    const HEAD_COLOR = "#00d4aa";
    state.snake.forEach((seg, i) => {
      const x = seg.x * GRID_SIZE;
      const y = seg.y * GRID_SIZE;

      if (i === 0) {
        // Head
        ctx.fillStyle = HEAD_COLOR;
        ctx.fillRect(x + 1, y + 1, GRID_SIZE - 2, GRID_SIZE - 2);
        ctx.strokeStyle = "#0a1628";
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 1, y + 1, GRID_SIZE - 2, GRID_SIZE - 2);

        // Snake eyes — two small white circles on the head
        const darken = Math.min(40 * i, 120);
        const eyes = getEyePositions(x, y, state.direction, GRID_SIZE);
        ctx.fillStyle = darkenColor("#ffffff", darken);
        eyes.forEach(eye => {
          ctx.beginPath();
          ctx.arc(eye.x, eye.y, 2.5, 0, Math.PI * 2);
          ctx.fill();
        });
      } else {
        // Body gradient — progressively darker toward the tail
        const darken = Math.min(40 * i, 120);
        ctx.fillStyle = darkenColor(HEAD_COLOR, darken);
        ctx.fillRect(x + 1, y + 1, GRID_SIZE - 2, GRID_SIZE - 2);
        ctx.strokeStyle = "#0a1628";
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 1, y + 1, GRID_SIZE - 2, GRID_SIZE - 2);
      }
    });

    // Game Over overlay
    if (state.isGameOver) {
      ctx.fillStyle = "rgba(10, 22, 40, 0.7)";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#ff4444";
      ctx.font = "bold 48px 'Noto Sans SC', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("游戏结束!", w / 2, h / 2 - 20);
      ctx.fillStyle = "#e8e8e8";
      ctx.font = "24px 'Noto Sans SC', sans-serif";
      ctx.fillText(`最终得分: ${state.score}`, w / 2, h / 2 + 30);
      ctx.fillStyle = "#8892b0";
      ctx.font = "18px 'Noto Sans SC', sans-serif";
      ctx.fillText("按 Enter 重新开始", w / 2, h / 2 + 70);
    }

    // Pause overlay
    if (state.isPaused && !state.isGameOver) {
      ctx.fillStyle = "rgba(10, 22, 40, 0.5)";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#e8e8e8";
      ctx.font = "bold 48px 'Noto Sans SC', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("暂停中", w / 2, h / 2 - 10);
      ctx.fillStyle = "#8892b0";
      ctx.font = "18px 'Noto Sans SC', sans-serif";
      ctx.fillText("按 P 或 空格键 继续", w / 2, h / 2 + 30);
    }
  }, []);

  const gameLoop = useCallback((timestamp: number) => {
    const state = gameRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (!state.isGameOver && !state.isPaused) {
      if (timestamp - lastTickRef.current >= state.speed) {
        gameRef.current = tick(state);
        lastTickRef.current = timestamp;
        setScore(gameRef.current.score);
        setGameOver(gameRef.current.isGameOver);
      }
    }

    draw(ctx, gameRef.current);
    animRef.current = requestAnimationFrame(gameLoop);
  }, [draw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvasW;
    canvas.height = canvasH;
    animRef.current = requestAnimationFrame(gameLoop);

    const handleKey = (e: KeyboardEvent) => {
      const dirMap: Record<string, DirKey> = {
        ArrowUp: "UP", ArrowDown: "DOWN", ArrowLeft: "LEFT", ArrowRight: "RIGHT",
        w: "UP", s: "DOWN", a: "LEFT", d: "RIGHT",
        W: "UP", S: "DOWN", A: "LEFT", D: "RIGHT",
      };

      if (dirMap[e.key]) {
        e.preventDefault();
        gameRef.current = changeDirection(gameRef.current, dirMap[e.key]);
      }

      if (e.key === "p" || e.key === "P" || e.key === " ") {
        e.preventDefault();
        const state = gameRef.current;
        if (!state.isGameOver) {
          gameRef.current = { ...state, isPaused: !state.isPaused };
          setPaused(gameRef.current.isPaused);
        }
      }

      if (e.key === "Enter" && gameRef.current.isGameOver) {
        gameRef.current = createInitialState(config);
        lastTickRef.current = 0;
        setScore(0);
        setGameOver(false);
        setPaused(false);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("keydown", handleKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameLoop, canvasW, canvasH]);

  const handleReset = () => {
    gameRef.current = createInitialState(config);
    lastTickRef.current = 0;
    setScore(0);
    setGameOver(false);
    setPaused(false);
  };

  const handlePause = () => {
    const state = gameRef.current;
    if (!state.isGameOver) {
      gameRef.current = { ...state, isPaused: !state.isPaused };
      setPaused(!state.isPaused);
    }
  };

  const speedOptions = Object.keys(SPEED_PRESETS);
  const mapOptions = Object.keys(MAP_PRESETS);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Config Selectors — disabled during active play */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <ConfigSelector
          label="地图"
          options={mapOptions}
          value={config.mapName}
          onChange={v => setConfig(prev => ({ ...prev, mapName: v }))}
          disabled={configLocked}
        />
        <ConfigSelector
          label="速度"
          options={speedOptions}
          value={config.speedName}
          onChange={v => setConfig(prev => ({ ...prev, speedName: v }))}
          disabled={configLocked}
        />
        <div className="flex items-center gap-2">
          <span className="text-snake-text-muted text-xs whitespace-nowrap">穿墙:</span>
          <button
            onClick={() => setConfig(prev => ({ ...prev, wallPass: !prev.wallPass }))}
            disabled={configLocked}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
              config.wallPass
                ? "bg-snake-accent text-white shadow-sm"
                : "bg-white/5 text-white/70 hover:bg-white/10"
            } disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            {config.wallPass ? "开启" : "关闭"}
          </button>
        </div>
      </div>

      {/* Game Canvas */}
      <div className="relative rounded-xl overflow-hidden border-2 border-snake-border/60 shadow-2xl shadow-snake-accent/5">
        <canvas
          ref={canvasRef}
          className="block max-w-full h-auto"
          style={{ width: Math.min(canvasW, 900), height: Math.min(canvasH, 700) }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={handlePause}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-white text-sm font-medium hover:bg-white/10 transition-colors"
        >
          {paused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          {paused ? "继续" : "暂停"}
        </button>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-snake-accent/10 text-snake-accent text-sm font-medium hover:bg-snake-accent/20 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          重新开始
        </button>
      </div>

      {/* Status */}
      <div className="flex gap-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-snake-text-muted">得分:</span>
          <span className="text-white font-bold font-mono">{score}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-snake-text-muted">蛇身长度:</span>
          <span className="text-white font-bold font-mono">{gameRef.current.snake.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-snake-text-muted">速度:</span>
          <span className="text-white font-bold font-mono">{gameRef.current.speedName}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-snake-text-muted">地图:</span>
          <span className="text-white font-bold font-mono">{gameRef.current.mapName}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-snake-text-muted">穿墙:</span>
          <span className="text-white font-bold font-mono">{gameRef.current.wallPass ? "开" : "关"}</span>
        </div>
      </div>
    </div>
  );
}
