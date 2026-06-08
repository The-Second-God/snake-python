import Breadcrumb from "@/components/Breadcrumb";
import GameCanvas from "@/components/GameCanvas";
import { Keyboard, Target, Zap, ArrowBigUp, ArrowBigDown, ArrowBigLeft, ArrowBigRight, ArrowBigUpDash, ArrowBigDownDash, ArrowBigLeftDash, ArrowBigRightDash } from "lucide-react";

export default function Game() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Breadcrumb />

      <h1 className="text-3xl font-bold text-white mb-8">🎮 游戏演示</h1>

      {/* Introduction */}
      <section className="mb-10">
        <p className="text-snake-text-muted leading-relaxed max-w-3xl">
          这是一个使用 HTML5 Canvas 从零重写的贪吃蛇游戏，完整复现了 Python Pygame 版本的全部功能。
          你可以在下方直接试玩，体验从经典到增强的各项特性——包括多档速度、多种地图尺寸和穿墙模式。
        </p>
      </section>

      {/* Game Canvas */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-snake-accent" />
          <h2 className="text-xl font-semibold text-white">试玩</h2>
        </div>
        <GameCanvas />
      </section>

      {/* Key Controls */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <Keyboard className="w-5 h-5 text-snake-accent" />
          <h2 className="text-xl font-semibold text-white">操作说明</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* ↑↓←→ / WASD */}
          <div className="bg-snake-surface border border-snake-border/60 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex gap-1">
                <ArrowBigUp className="w-5 h-5 text-snake-accent" />
                <ArrowBigDown className="w-5 h-5 text-snake-accent" />
                <ArrowBigLeft className="w-5 h-5 text-snake-accent" />
                <ArrowBigRight className="w-5 h-5 text-snake-accent" />
              </div>
              <span className="text-snake-text-muted text-sm">/</span>
              <span className="text-sm font-mono text-snake-accent font-semibold">W A S D</span>
            </div>
            <p className="text-white text-sm">控制方向</p>
          </div>

          {/* P / Space */}
          <div className="bg-snake-surface border border-snake-border/60 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded bg-snake-accent/10 text-snake-accent font-mono font-bold text-sm">P</span>
              <span className="text-snake-text-muted text-sm">/</span>
              <span className="inline-flex items-center justify-center px-3 h-8 rounded bg-snake-accent/10 text-snake-accent font-mono font-bold text-sm">Space</span>
            </div>
            <p className="text-white text-sm">暂停/继续</p>
          </div>

          {/* Enter */}
          <div className="bg-snake-surface border border-snake-border/60 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-flex items-center justify-center px-4 h-8 rounded bg-snake-accent/10 text-snake-accent font-mono font-bold text-sm">Enter</span>
            </div>
            <p className="text-white text-sm">重新开始</p>
          </div>
        </div>
      </section>

      {/* Game Features */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-snake-accent" />
          <h2 className="text-xl font-semibold text-white">游戏特性</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Speed Presets */}
          <div className="bg-snake-surface border border-snake-border/60 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-2">⚡ 多档速度</h3>
            <p className="text-sm text-snake-text-muted">
              游戏开始前可选择 5 档速度预设：从"极慢"到"极速"，每档的初始速度和增速各不相同，新手到高手都能找到适合自己的节奏。
            </p>
          </div>

          {/* Map Sizes */}
          <div className="bg-snake-surface border border-snake-border/60 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-2">🗺️ 多种地图</h3>
            <p className="text-sm text-snake-text-muted">
              支持 4 种地图尺寸（小型 25×20 ~ 超大型 70×50），地图越大游戏空间越广阔，难度也随之变化。
            </p>
          </div>

          {/* Wall Pass */}
          <div className="bg-snake-surface border border-snake-border/60 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-2">🔄 穿墙模式</h3>
            <p className="text-sm text-snake-text-muted">
              开启穿墙模式后，蛇可以穿过墙壁从另一侧出现。这降低了撞墙死亡的概率，但自碰检测依然保留——蛇越长越需要小心。
            </p>
          </div>

          {/* Snake Eyes */}
          <div className="bg-snake-surface border border-snake-border/60 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-2">👁️ 视觉增强</h3>
            <p className="text-sm text-snake-text-muted">
              蛇头带有可爱的眼睛，蛇身从头部到尾部的颜色逐渐变暗，让游戏画面更加生动。
            </p>
          </div>
        </div>
      </section>

      {/* Game Rules */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-snake-accent" />
          <h2 className="text-xl font-semibold text-white">游戏规则</h2>
        </div>
        <div className="bg-snake-surface border border-snake-border/60 rounded-xl p-6">
          <ul className="space-y-3 text-snake-text-muted">
            <li className="flex items-start gap-3">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-snake-accent flex-shrink-0" />
              <span>使用方向键（↑↓←→）或 WASD 控制蛇的移动方向，不能原地掉头</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-snake-accent flex-shrink-0" />
              <span>当蛇头吃到红色食物时，蛇身长度增加 1，得分增加</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-snake-accent flex-shrink-0" />
              <span>蛇撞到墙壁（关闭穿墙模式时）或撞到自己则游戏结束</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-snake-accent flex-shrink-0" />
              <span>随着得分增加，蛇的移动速度会逐渐提升，挑战性越来越大</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-snake-accent flex-shrink-0" />
              <span>你可以在游戏开始前自由调整速度档位、地图大小和穿墙模式</span>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
