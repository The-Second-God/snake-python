# 1. 架构设计

```mermaid
flowchart TB
    "用户浏览器" --> "CDN静态资源分发"
    "CDN静态资源分发" --> "Vite构建的前端应用"
    
    subgraph "前端应用层"
        "React Router" --> "首页模块"
        "React Router" --> "游戏演示模块"
        "React Router" --> "代码讲解模块"
    end
    
    subgraph "核心功能层"
        "Canvas游戏引擎" --> "贪吃蛇游戏逻辑"
        "Canvas游戏引擎" --> "动态配置系统"
        "代码高亮引擎" --> "语法着色渲染"
        "响应式布局系统" --> "多端适配"
    end
    
    subgraph "数据层"
        "游戏代码数据" --> "静态JSON/常量"
        "代码讲解内容" --> "结构化Markdown"
    end
```

## 2. 技术选型说明

| 技术 | 选择 | 理由 |
|------|------|------|
| 框架 | React 18 + Vite | 组件化开发、快速热更新、优秀的构建性能 |
| 样式 | TailwindCSS 3 | 原子化CSS、响应式设计便捷、体积小 |
| 路由 | React Router 6 | SPA路由、支持嵌套路由和懒加载 |
| 代码高亮 | Prism.js + Python语法插件 | 轻量、支持行号、主题丰富 |
| 游戏引擎 | HTML5 Canvas (原生JS) | 无需额外依赖、性能优秀、跨平台 |
| 动画 | CSS Animations | 流畅的页面过渡和交互动画 |
| 图标 | Lucide React | 简洁美观的开源图标库 |

**替代方案对比：**

| 方案 | 优势 | 劣势 | 选择理由 |
|------|------|------|---------|
| Vue 3 vs React 18 | Vue学习曲线更低 | React生态更丰富 | 选择React（组件生态更成熟） |
| Shiki vs Prism.js | Shiki服务端渲染更精确 | Prism.js更轻量、客户端友好 | 选择Prism.js（客户端渲染，无服务器开销） |
| Pyodide vs Canvas | Pyodide直接在浏览器运行Python | 加载慢、体积大、兼容性差 | 选择Canvas重写JS版（性能好、体积小） |
| SCSS vs TailwindCSS | SCSS更灵活自由 | Tailwind开发效率更高 | 选择TailwindCSS（开发效率、一致性） |

## 3. 路由定义

| 路由 | 页面 | 说明 |
|------|------|------|
| `/` | 首页 | 项目概览、导航入口 |
| `/game` | 游戏演示页 | 交互式贪吃蛇游戏（含配置面板） |
| `/tutorial` | 代码讲解区 | 总览页，列出所有章节 |
| `/tutorial/:section` | 某章节讲解 | 按章节展示代码与解析 |
| `/tutorial/:section/:subsection` | 子章节详情 | 具体代码模块的讲解 |

## 4. 组件架构

### 4.1 页面组件

```
App
├── Layout (全局布局)
│   ├── Header (顶部导航)
│   │   ├── Logo
│   │   ├── NavLinks (导航链接)
│   │   └── MobileMenu (移动端菜单)
│   ├── Breadcrumb (面包屑导航)
│   └── Footer (页脚)
├── HomePage (首页)
│   ├── HeroSection (英雄区域)
│   ├── FeatureCards (功能卡片)
│   └── ProjectOverview (项目概览)
├── GamePage (游戏演示页)
│   ├── GameCanvas (游戏画布)
│   │   ├── ConfigPanel (配置面板：速度/地图/穿墙)
│   │   ├── CanvasRenderer (Canvas渲染)
│   │   └── GameControls (控制面板)
│   ├── GameStatus (状态显示)
│   │   ├── ScoreDisplay
│   │   ├── SnakeLength
│   │   └── ModeDisplay
│   └── Instructions (操作说明)
└── TutorialPage (代码讲解页)
    ├── SideNav (侧边导航)
    ├── CodeBlock (代码展示块)
    │   ├── CodeHeader (代码标题+复制按钮)
    │   ├── CodeContent (高亮代码)
    │   └── CodeFooter (折叠/展开)
    ├── Explanation (代码解析)
    └── NavigationButtons (上下章节)
```

### 4.2 通用组件

- `ScrollToTop`：返回顶部按钮
- `ProgressBar`：阅读进度条
- `Toast`：提示通知
- `CopyButton`：复制按钮（带反馈）

## 5. 数据模型

### 5.1 游戏配置数据结构

```typescript
interface GameConfig {
  speedName: string;      // 速度档位名："极慢"|"慢速"|"中等"|"快速"|"极速"
  mapName: string;        // 地图名："小型"|"中型"|"大型"|"超大型"
  wallPass: boolean;      // 穿墙模式
  gridCols: number;       // 网格列数（根据地图预设自动计算）
  gridRows: number;       // 网格行数
  windowWidth: number;    // 窗口宽
  windowHeight: number;   // 窗口高
}

// 速度预设
const SPEED_PRESETS = {
  "极慢": { interval: 200, increment: 8 },
  "慢速": { interval: 150, increment: 10 },
  "中等": { interval: 120, increment: 12 },
  "快速": { interval: 90, increment: 15 },
  "极速": { interval: 60, increment: 20 },
};

// 地图预设
const MAP_PRESETS = {
  "小型":  { cols: 25, rows: 20, width: 500, height: 400 },
  "中型":  { cols: 40, rows: 30, width: 800, height: 600 },
  "大型":  { cols: 55, rows: 40, width: 1100, height: 800 },
  "超大型": { cols: 70, rows: 50, width: 1400, height: 1000 },
};
```

### 5.2 代码章节数据结构

```typescript
interface TutorialChapter {
  id: string;
  title: string;
  description: string;
  subsections: TutorialSubsection[];
}

interface TutorialSubsection {
  id: string;
  title: string;
  code: string;           // Python代码
  codeLanguage: string;   // "python"
  explanation: string;    // HTML格式的解析内容
  techNotes?: string;     // 技术选型说明
  algorithmFlow?: string; // 算法流程图(Mermaid)
  commonIssues?: Issue[]; // 常见问题
  tips?: string[];        // 优化技巧
}

interface Issue {
  problem: string;
  solution: string;
}
```

### 5.3 游戏状态数据

```typescript
interface GameState {
  snake: Position[];
  direction: Direction;
  nextDir: Direction;
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
```

## 6. 讲解章节规划

| 章节 | 子章节 | 对应代码 | 讲解重点 |
|------|--------|---------|---------|
| 环境搭建 | Pygame安装, 常量定义 | `import`, 颜色常量, SPEED_PRESETS, MAP_PRESETS | 环境配置、配置化设计 |
| 游戏框架 | 窗口创建, 辅助函数 | 窗口初始化, 中文字体加载, 绘制函数 | Pygame基础、字体处理 |
| 游戏逻辑 | 重置游戏, 蛇移动, 碰撞检测 | `reset_game()`, `move_snake()`, `check_collision()`, `apply_wall_pass()` | 核心算法、数据结构、穿墙模式 |
| 菜单系统 | GameConfig, UI组件, 菜单循环, 穿墙算法, 字体加载, 程序入口 | `GameConfig`, `Button`, `ToggleButton`, `menu_loop()`, `main()` | 配置系统、面向对象、事件循环 |
| 游戏循环 | 事件处理, 主循环 | `game_loop()`, 事件驱动, 帧率控制 | 游戏循环模式、状态管理 |
| 功能扩展 | 暂停, 得分, 加速 | 暂停逻辑、速度递增、状态显示 | 功能迭代方法 |
| 优化与重构 | 代码优化, 最佳实践 | 集合优化, 面向对象重构, 枚举 | 代码质量提升 |

## 7. 性能优化策略

- 路由级代码分割（React.lazy + Suspense）
- 代码高亮使用prism的懒加载方案
- Canvas游戏使用requestAnimationFrame优化
- 图片和资源预加载
- 使用useMemo和useCallback减少不必要的渲染
- 代码讲解内容采用渐进式加载

## 8. 部署方案

- 构建工具：Vite
- 输出：纯静态文件（HTML/CSS/JS）
- 部署平台：GitHub Pages / Netlify / Vercel
- CDN：自动通过部署平台提供
