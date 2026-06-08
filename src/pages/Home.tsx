import { Link } from "react-router-dom";
import { ArrowRight, Gamepad2, BookOpen, GitBranch, Code2, Brain } from "lucide-react";

const features = [
  {
    icon: Gamepad2,
    title: "交互式游戏演示",
    description: "在浏览器中直接运行贪吃蛇游戏，体验完整的游戏功能，包括计分系统、碰撞检测和难度递增。",
    color: "text-snake-accent",
    bg: "bg-snake-accent/10",
    border: "border-snake-accent/20",
  },
  {
    icon: BookOpen,
    title: "逐行代码讲解",
    description: "从环境搭建到游戏逻辑，每一行代码都有详细注释和讲解，适合Python初学者循序渐进地学习。",
    color: "text-snake-warm",
    bg: "bg-snake-warm/10",
    border: "border-snake-warm/20",
  },
  {
    icon: Brain,
    title: "算法深度解析",
    description: "深入剖析贪吃蛇游戏背后的算法思想，包括路径规划、碰撞检测优化和数据结构应用。",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    border: "border-purple-400/20",
  },
];

const projectModules = [
  {
    icon: Code2,
    title: "snake_game.py",
    subtitle: "核心游戏引擎",
    description: "包含游戏循环、状态管理、键盘事件处理和渲染逻辑，是整个游戏的主干。",
    details: ["Pygame 窗口管理", "游戏状态机", "事件驱动架构"],
  },
  {
    icon: GitBranch,
    title: "游戏对象模块",
    subtitle: "Snake & Food 类",
    description: "定义了蛇的移动、生长、转向逻辑以及食物的随机生成与碰撞检测。",
    details: ["Snake 类设计", "Food 类设计", "碰撞检测算法"],
  },
  {
    icon: Brain,
    title: "算法与扩展",
    subtitle: "智能与优化",
    description: "实现自动寻路算法、游戏难度曲线优化以及性能调优技巧。",
    details: ["BFS 寻路算法", "难度递增策略", "渲染性能优化"],
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-snake-bg">
      {/* ===== Hero Section ===== */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-snake-accent/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-snake-accent/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-snake-accent/[0.02] rounded-full blur-3xl" />
        </div>

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #00d4aa 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-20 sm:pt-32 sm:pb-28">
          {/* Animated snake emoji */}
          <div className="flex justify-center mb-8">
            <span className="inline-block text-7xl sm:text-8xl animate-bounce" style={{ animationDuration: "2s" }}>
              🐍
            </span>
          </div>

          {/* Badge */}
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium border border-snake-accent/30 bg-snake-accent/5 text-snake-accent">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-snake-accent opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-snake-accent" />
              </span>
              Python 编程教学项目
            </span>
          </div>

          {/* Main heading */}
          <h1 className="text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]">
            从零构建
            <br />
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-snake-accent via-snake-accent-dark to-snake-accent bg-clip-text text-transparent">
                贪吃蛇游戏
              </span>
              <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-snake-accent/50 to-transparent rounded-full" />
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-8 text-center text-base sm:text-lg md:text-xl text-snake-text-muted max-w-2xl mx-auto leading-relaxed">
            通过一个完整的贪吃蛇游戏开发案例，系统化学习 Python 游戏编程。
            <br className="hidden sm:block" />
            从环境搭建到算法优化，带你一步步掌握游戏开发的完整流程。
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/game"
              className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-snake-accent text-snake-bg font-semibold text-sm sm:text-base transition-all duration-300 hover:bg-snake-accent-dark hover:shadow-lg hover:shadow-snake-accent/25 active:scale-[0.97]"
            >
              <Gamepad2 className="w-5 h-5" />
              试玩游戏
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              to="/tutorial"
              className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border border-snake-border bg-snake-surface/50 text-snake-text font-semibold text-sm sm:text-base transition-all duration-300 hover:border-snake-accent/50 hover:bg-snake-surface hover:text-snake-accent active:scale-[0.97]"
            >
              <BookOpen className="w-5 h-5" />
              开始学习
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Scroll indicator */}
          <div className="mt-16 flex flex-col items-center gap-2 text-snake-text-muted/40">
            <span className="text-xs">向下探索</span>
            <div className="w-5 h-8 border-2 border-snake-text-muted/20 rounded-full flex justify-center p-1">
              <div className="w-1 h-2 bg-snake-accent/40 rounded-full animate-bounce" style={{ animationDuration: "1.5s" }} />
            </div>
          </div>
        </div>
      </section>

      {/* ===== Features Section ===== */}
      <section className="relative">
        {/* Divider */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-snake-border to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          {/* Section header */}
          <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-18">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              为什么选择这个项目？
            </h2>
            <p className="mt-4 text-snake-text-muted text-base sm:text-lg leading-relaxed">
              理论与实践相结合，让你在动手 coding 的过程中真正掌握 Python 编程的核心技能。
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className={`group relative rounded-2xl border ${feature.border} ${feature.bg} p-8 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1`}
                >
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${feature.bg} ${feature.color} mb-6 transition-transform duration-300 group-hover:scale-110`}>
                    <Icon className="w-7 h-7" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-snake-text-muted text-sm leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Hover accent line */}
                  <div className={`absolute bottom-0 left-8 right-8 h-0.5 rounded-full bg-gradient-to-r from-transparent ${feature.color.replace("text-", "via-")} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== Project Structure Section ===== */}
      <section className="relative">
        {/* Divider */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-snake-border to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          {/* Section header */}
          <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-18">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              项目架构一览
            </h2>
            <p className="mt-4 text-snake-text-muted text-base sm:text-lg leading-relaxed">
              了解贪吃蛇游戏的模块划分与代码组织方式，为你的学习之旅绘制清晰的地图。
            </p>
          </div>

          {/* Architecture diagram - visual flow */}
          <div className="hidden md:flex items-center justify-center gap-0 mb-16">
            {["游戏入口", "初始化", "游戏循环", "事件处理", "渲染输出"].map((label, i) => (
              <div key={label} className="flex items-center">
                <div className="px-5 py-2.5 rounded-lg bg-snake-surface border border-snake-border text-sm text-snake-text-muted whitespace-nowrap">
                  {label}
                </div>
                {i < 4 && (
                  <div className="flex items-center px-2">
                    <div className="w-8 h-px bg-snake-accent/40" />
                    <ArrowRight className="w-3.5 h-3.5 text-snake-accent/40 -ml-1" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Module cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {projectModules.map((mod, index) => {
              const Icon = mod.icon;
              return (
                <div
                  key={mod.title}
                  className="group rounded-2xl border border-snake-border bg-snake-surface/30 p-8 transition-all duration-300 hover:border-snake-accent/30 hover:bg-snake-surface/60 hover:-translate-y-1"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-snake-accent/10 text-snake-accent transition-transform duration-300 group-hover:scale-110">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{mod.title}</h3>
                        <p className="text-xs text-snake-text-muted/70 font-mono mt-0.5">{mod.subtitle}</p>
                      </div>
                    </div>
                    {/* File icon decoration */}
                    <div className="text-snake-border/30">
                      <Code2 className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-snake-text-muted leading-relaxed mb-5">
                    {mod.description}
                  </p>

                  {/* Detail tags */}
                  <ul className="space-y-2">
                    {mod.details.map((detail) => (
                      <li
                        key={detail}
                        className="flex items-center gap-2.5 text-sm text-snake-text-muted/80"
                      >
                        <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-snake-accent/50" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 text-center">
            <Link
              to="/tutorial"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border border-snake-border bg-snake-surface/50 text-snake-text font-semibold text-sm transition-all duration-300 hover:border-snake-accent/50 hover:bg-snake-surface hover:text-snake-accent active:scale-[0.97]"
            >
              <BookOpen className="w-5 h-5" />
              查看完整教程
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
