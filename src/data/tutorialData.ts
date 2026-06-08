export interface TutorialIssue {
  problem: string;
  solution: string;
}

export interface TutorialSubsection {
  id: string;
  title: string;
  code: string;
  codeLanguage: string;
  explanation: string;
  techNotes?: string;
  algorithmFlow?: string;
  commonIssues?: TutorialIssue[];
  tips?: string[];
}

export interface TutorialChapter {
  id: string;
  title: string;
  description: string;
  subsections: TutorialSubsection[];
}

export const tutorialChapters: TutorialChapter[] = [
  {
    id: "environment",
    title: "环境搭建",
    description: "配置Python开发环境，安装Pygame库",
    subsections: [
      {
        id: "pygame-install",
        title: "Pygame安装与项目初始化",
        codeLanguage: "python",
        code: `"""
=================================================
          贪吃蛇游戏 - 完整版 (Pygame)
=================================================
库依赖：pygame (pip install pygame)

【设计思路概览】
1. 游戏窗口是一个网格棋盘，将蛇和食物都放在网格上
2. 蛇用"坐标列表"表示，列表的每个元素是蛇的一节身体
3. 蛇移动 = 在头部方向插入新坐标 + 移除尾部坐标
4. 吃到食物 = 只插入头部，不移除尾部（长度+1）
5. 碰撞检测 = 检查头部是否撞墙或撞到自己
=================================================
"""

import pygame
import sys
import random
import os

# =============================================
# 第一步：初始化 Pygame
# =============================================
pygame.init()`,
        explanation: `
**步骤说明：**
1. **安装Pygame**：在终端执行 \`pip install pygame\`
2. **导入依赖**：
   - \`pygame\`：游戏开发框架，提供图形、声音、事件处理等功能
   - \`sys\`：系统工具，用于退出程序
   - \`random\`：随机数生成，用于食物随机位置
   - \`os\`：系统路径操作，用于加载中文字体文件
3. **初始化Pygame**：\`pygame.init()\` 必须在使用任何Pygame功能前调用

**为什么要用Pygame？**
| 方案 | 优势 | 劣势 |
|------|------|------|
| Pygame | 简单易学，适合教学 | 性能一般，不适合大型游戏 |
| Pyglet | 性能更好 | 更底层，学习曲线陡 |
| Tkinter | 内置库，无需安装 | 不适合游戏开发 |
| Arcade | 面向对象，现代API | 社区较小 |

选择Pygame的主要原因是**教学友好**——代码直观、文档丰富、社区活跃。
        `,
        techNotes: "Pygame基于SDL库，提供跨平台的多媒体功能。建议使用Python 3.8+版本。",
        commonIssues: [
          { problem: "安装失败（Windows）", solution: "尝试使用 `python -m pip install pygame`，或以管理员身份运行终端" },
          { problem: "导入报错 `ModuleNotFoundError`", solution: "确认Pygame已成功安装：`pip list | grep pygame`" },
          { problem: "macOS/Linux 权限问题", solution: "使用 `pip install --user pygame` 安装到用户目录" },
        ],
        tips: [
          "建议使用虚拟环境（venv）管理项目依赖",
          "使用 `pip freeze > requirements.txt` 导出依赖清单",
        ],
      },
      {
        id: "constants",
        title: "游戏常量定义",
        codeLanguage: "python",
        code: `# =============================================
# 第二步：定义常量（颜色、方向等）
# =============================================

# --- 颜色定义（RGB 值） ---
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)
GREEN = (0, 255, 0)
DARK_GREEN = (0, 200, 0)
RED = (255, 0, 0)
DARK_RED = (200, 0, 0)
GRAY = (100, 100, 100)
DARK_GRAY = (40, 40, 40)
LIGHT_GRAY = (180, 180, 180)
BLUE = (50, 150, 255)
DARK_BLUE = (30, 80, 180)
YELLOW = (255, 255, 0)
ORANGE = (255, 165, 0)
PURPLE = (180, 50, 200)
BG_COLOR = (20, 20, 30)       # 深蓝黑背景
PANEL_COLOR = (30, 35, 50)    # 面板底色
HIGHLIGHT = (60, 70, 100)     # 高亮色

# --- 方向常量（用向量表示方向）---
UP = (0, -1)
DOWN = (0, 1)
LEFT = (-1, 0)
RIGHT = (1, 0)

# --- 网格基础设置 ---
GRID_SIZE = 20  # 每个网格的边长（像素）

# --- 速度档位映射表 ---
SPEED_PRESETS = {
    "极慢": (5, 0.3),
    "慢速": (8, 0.4),
    "中等": (10, 0.5),
    "快速": (14, 0.6),
    "极速": (18, 0.8),
}

# --- 地图大小预设 ---
MAP_PRESETS = {
    "小型":  (25, 20, 500, 400),
    "中型":  (40, 30, 800, 600),
    "大型":  (55, 40, 1100, 800),
    "超大型": (70, 50, 1400, 1000),
}`,
        explanation: `
**关键设计决策：**

**1. 扩展的颜色系统**
从原来的8种颜色扩展到17种颜色，新增了LIGHT_GRAY、BLUE、DARK_BLUE、YELLOW、ORANGE、PURPLE、BG_COLOR、PANEL_COLOR、HIGHLIGHT，用于菜单界面和UI组件的渲染。

**2. 速度档位映射表**
\`SPEED_PRESETS\` 用字典存储5档速度：
- 键 = 档位名称（中文）
- 值 = (初始速度, 每吃一个食物增加的速度)
玩家可以在菜单中自由选择速度难度。

**3. 地图大小预设**
\`MAP_PRESETS\` 提供4种地图尺寸：
- 值 = (网格列数, 网格行数, 窗口宽度, 窗口高度)
窗口不再固定为800×600，而是根据玩家选择动态变化。

**4. 方向向量**
使用 \`(dx, dy)\` 向量表示方向，新蛇头 = 蛇头坐标 + 方向向量。
        `,
        algorithmFlow: `
\`\`\`mermaid
flowchart LR
    "速度档位" --> "极慢/慢速/中等/快速/极速"
    "速度档位" --> "(初始速度, 增速)"
    "地图预设" --> "小型/中型/大型/超大型"
    "地图预设" --> "(列数, 行数, 宽, 高)"
    "GameConfig" --> "整合速度+地图+穿墙模式"
\`\`\`
        `,
        tips: ["使用常量而非魔法数字，提高代码可读性", "将配置参数集中管理，方便后续扩展"],
      },
    ],
  },
  {
    id: "game-framework",
    title: "游戏框架",
    description: "创建游戏窗口和辅助渲染函数",
    subsections: [
      {
        id: "window-creation",
        title: "窗口创建与初始化",
        codeLanguage: "python",
        code: `# =============================================
# 第三步：加载中文字体
# =============================================
def load_chinese_font(size):
    """加载支持中文的字体"""
    font_paths = [
        "C:/Windows/Fonts/msyh.ttc",
        "C:/Windows/Fonts/msyhbd.ttc",
        "C:/Windows/Fonts/simhei.ttf",
        "C:/Windows/Fonts/simsun.ttc",
        "C:/Windows/Fonts/deng.ttf",
        "C:/Windows/Fonts/fangsong.ttf",
    ]
    for path in font_paths:
        if os.path.exists(path):
            try:
                font = pygame.font.Font(path, size)
                test_surface = font.render("测试", True, WHITE)
                if test_surface.get_width() > 0:
                    return font
            except:
                continue
    print("警告：未找到中文字体，中文可能显示为方块")
    return pygame.font.Font(None, size)


# 在程序入口处创建窗口
screen = pygame.display.set_mode((800, 600))
pygame.display.set_caption("贪吃蛇游戏")
clock = pygame.time.Clock()`,
        explanation: `
**核心概念：**

1. **中文显示问题**
Pygame默认字体不支持中文，会显示为"豆腐块"（方框）。
\`load_chinese_font()\` 函数从Windows系统字体目录加载中文字体：
   - 微软雅黑（msyh.ttc）— 首选，最清晰现代
   - 黑体（simhei.ttf）、宋体（simsun.ttc）等作为备选
   - 遍历字体路径列表，第一个能正常渲染中文的即被使用

2. **二级缓存机制**
   - 先检查字体文件是否存在 (\`os.path.exists\`)
   - 再用 \`font.render()\` 测试能否正常渲染
   - 双重保障避免加载损坏的字体文件

3. **\`pygame.display.set_mode()\`**：创建游戏窗口，返回Surface对象（画布）
4. **\`pygame.display.set_caption()\`**：设置窗口标题（不需要emoji）
5. **\`pygame.time.Clock()\`**：时钟对象，用于控制游戏帧率

**Pygame的坐标系：**
- 原点(0,0)在左上角
- x轴向右为正，y轴向下为正
- 所有图形绘制都基于这个坐标系
        `,
        commonIssues: [
          { problem: "窗口一闪而过", solution: "确保进入了游戏主循环（while循环），否则程序会立即退出" },
          { problem: "中文显示为方框", solution: "确保系统有中文字体，或手动指定字体文件路径" },
        ],
      },
      {
        id: "helper-functions",
        title: "辅助函数（绘制网格、食物、文字）",
        codeLanguage: "python",
        code: `def draw_grid(screen, grid_cols, grid_rows, window_width, window_height):
    """绘制背景网格线（装饰用）"""
    for x in range(0, window_width, GRID_SIZE):
        pygame.draw.line(screen, DARK_GRAY, (x, 0), (x, window_height))
    for y in range(0, window_height, GRID_SIZE):
        pygame.draw.line(screen, DARK_GRAY, (0, y), (window_width, y))


def get_random_food_position(snake_body, grid_cols, grid_rows):
    """随机生成食物的位置（不在蛇身上）"""
    while True:
        x = random.randint(0, grid_cols - 1)
        y = random.randint(0, grid_rows - 1)
        if (x, y) not in snake_body:
            return (x, y)


def draw_snake(screen, snake_body):
    """绘制蛇的身体（渐变颜色 + 眼睛）"""
    for i, segment in enumerate(snake_body):
        x = segment[0] * GRID_SIZE
        y = segment[1] * GRID_SIZE
        if i == 0:
            color = GREEN
        else:
            darken = min(40 * i, 120)
            color = (0, max(255 - darken, 60), 0)
        rect = pygame.Rect(x, y, GRID_SIZE, GRID_SIZE)
        pygame.draw.rect(screen, color, rect)
        pygame.draw.rect(screen, BLACK, rect, 1)
        if i == 0:
            eye_size = 3
            eye_offset = 5
            pygame.draw.circle(screen, WHITE, (x + eye_offset, y + eye_offset), eye_size)
            pygame.draw.circle(screen, WHITE, (x + GRID_SIZE - eye_offset, y + eye_offset), eye_size)


def draw_food(screen, food_pos):
    """绘制食物（红色圆点，双层立体效果）"""
    x = food_pos[0] * GRID_SIZE + GRID_SIZE // 2
    y = food_pos[1] * GRID_SIZE + GRID_SIZE // 2
    pygame.draw.circle(screen, RED, (x, y), GRID_SIZE // 2 - 2)
    pygame.draw.circle(screen, DARK_RED, (x, y), GRID_SIZE // 4)


def show_text(screen, text, font_obj, color, center_x, center_y):
    """在屏幕指定位置显示文字"""
    text_surface = font_obj.render(text, True, color)
    text_rect = text_surface.get_rect(center=(center_x, center_y))
    screen.blit(text_surface, text_rect)`,
        explanation: `
**每个函数的设计思路：**

**1. \`draw_grid()\` — 网格绘制**
- 现在接受 \`grid_cols\`、\`grid_rows\`、\`window_width\`、\`window_height\` 参数
- 不再依赖全局常量，支持动态地图尺寸

**2. \`get_random_food_position()\` — 食物定位**
- 新增 \`grid_cols\`、\`grid_rows\` 参数，适应不同大小的地图
- 使用 \`while True\` 循环直到找到有效位置
- 关键约束：食物不能出现在蛇身上

**3. \`draw_snake()\` — 蛇身绘制（新增渐变+眼睛）**
- **颜色渐变**：蛇头用亮绿色，身体每节递增暗化值（\`darken = min(40 * i, 120)\`），最大暗化120，避免全黑
- **蛇眼效果**：蛇头画两个白色小圆点作为眼睛，增加生动感
- \`eye_offset = 5\` 让眼睛位于蛇头左上角和右上角

**4. \`draw_food()\` — 食物绘制**
- 用圆形代替方形，视觉效果更好
- 双层圆形增加立体感

**5. \`show_text()\` — 通用文字显示**
- 新签名使用 \`center_x, center_y\` 参数精确定位
- 不再使用 \`y_offset\` 相对偏移，改为绝对坐标
- 去除了旧的 \`show_score()\` 函数，改为直接在主循环中用 \`font.render()\` 渲染
        `,
        algorithmFlow: `
\`\`\`mermaid
flowchart TD
    "蛇身坐标列表" --> "遍历每一节(enumerate)"
    "遍历每一节" --> "是蛇头吗？"
    "是蛇头吗？" --> |是| "亮绿色 + 画眼睛"
    "是蛇头吗？" --> |否| "计算暗化值: min(40×i, 120)"
    "计算暗化值" --> "绘制渐变色矩形+黑色边框"
\`\`\`
        `,
        tips: [
          "使用 \`pygame.Rect\` 可以方便地进行矩形操作",
          "将绘制逻辑拆分为独立函数，提高代码可维护性",
        ],
      },
    ],
  },
  {
    id: "game-logic",
    title: "游戏逻辑",
    description: "蛇的移动、碰撞检测等核心算法",
    subsections: [
      {
        id: "reset-game",
        title: "重置游戏状态",
        codeLanguage: "python",
        code: `def reset_game(config):
    """
    根据配置重置游戏到初始状态
    返回所有游戏状态变量
    """
    start_x = config.grid_cols // 4
    start_y = config.grid_rows // 2
    snake_body = [
        (start_x, start_y),       # 蛇头（索引0）
        (start_x - 1, start_y),   # 身体第1节
        (start_x - 2, start_y),   # 蛇尾
    ]

    direction = RIGHT
    next_dir = RIGHT
    food_pos = get_random_food_position(snake_body, config.grid_cols, config.grid_rows)
    score = 0
    speed = config.speed_value
    speed_increment = config.speed_increment
    game_over = False
    paused = False

    return (snake_body, direction, next_dir, food_pos,
            score, speed, speed_increment, game_over, paused)`,
        explanation: `
**从"硬编码"到"配置驱动"的升级：**

原来 \`reset_game()\` 没有参数，直接使用全局常量 \`GRID_COLS\`、\`GRID_ROWS\`、\`INITIAL_SPEED\`。
现在 \`reset_game(config)\` 接收 \`GameConfig\` 对象，根据玩家在菜单中的选择动态设置参数。

**新增的返回值和变化：**
1. \`speed\` 从 \`INITIAL_SPEED\`（固定值）变为 \`config.speed_value\`（根据速度档位选择）
2. \`speed_increment\` 是新增的返回值，每吃一个食物增加的速度也由档位决定
3. \`food_pos\` 调用时传递 \`config.grid_cols\` 和 \`config.grid_rows\`，支持不同地图大小
4. 返回元组从8个值变为9个值（新增 \`speed_increment\`）

**为什么需要"方向缓冲"(\`next_dir\`)？**
- \`next_dir\` 存储玩家按下的最新有效方向
- \`direction\` 是当前帧实际移动方向
- 每帧开始时：\`direction = next_dir\`
- 保证了蛇**每帧只能改变一次方向**，避免方向冲突
        `,
        tips: ["解包赋值：\`snake_body, direction, ... = reset_game(config)\` 让代码更简洁"],
      },
      {
        id: "snake-movement",
        title: "蛇的移动算法",
        codeLanguage: "python",
        code: `def move_snake(snake_body, direction, food_pos):
    """
    移动蛇并判断是否吃到食物

    【核心算法 - 贪吃蛇最重要的部分】
        蛇身: [(头), (身1), (身2), ..., (尾)]

        移动一步:
        步骤1：根据方向计算新蛇头坐标
        步骤2：将新蛇头插入到列表最前面
        步骤3a：吃到食物 → 不移除尾部（蛇变长）
        步骤3b：没吃到  → 移除尾部（长度不变）
    """
    # 步骤1：计算新蛇头
    head_x, head_y = snake_body[0]
    dx, dy = direction
    new_head = (head_x + dx, head_y + dy)

    # 步骤2：新蛇头插入到列表开头
    new_body = [new_head] + snake_body

    # 步骤3：检测是否吃到食物
    if new_head == food_pos:
        ate_food = True
    else:
        ate_food = False
        new_body.pop()

    return new_body, ate_food`,
        explanation: `
**这是贪吃蛇最核心的算法！**

蛇的身体是由一系列坐标组成的列表。蛇移动的本质是：
1. **头部增加一个坐标**（向移动方向前进一格）
2. **尾部移除一个坐标**（如果没吃到食物）

这就像火车前进——前面加一节，后面减一节，整条蛇就"蠕动"前进了。

**吃食物的特殊情况：**
- 当新蛇头与食物位置重合时，**不移除尾部**
- 蛇的长度增加1节

**与穿墙模式的交互：**
\`move_snake()\` 只负责"移动"这一件事。移动完成后，如果穿墙模式开启，主循环会调用 \`apply_wall_pass()\` 将越界的蛇头"传送"到另一侧。职责分离的设计让每个函数只做一件事。

**时间复杂度分析：**
- 插入头部：O(n) — Python列表头部插入需要移位
- 移除尾部：O(1) — 列表尾部弹出是常数时间
- 优化方案：可以使用 \`collections.deque\` 实现O(1)的双端操作
        `,
        algorithmFlow: `
\`\`\`mermaid
flowchart TD
    "蛇头坐标 (hx, hy)" --> "方向向量 (dx, dy)"
    "方向向量" --> "新蛇头 = (hx+dx, hy+dy)"
    "新蛇头" --> "插入到列表最前面"
    "插入到列表最前面" --> "新蛇头==食物位置？"
    "新蛇头==食物位置？" --> |是| "不移除尾部 ← 蛇变长"
    "新蛇头==食物位置？" --> |否| "移除尾部 ← 蛇滑动"
\`\`\`
        `,
        commonIssues: [
          { problem: "蛇可以原地掉头（瞬间死亡）", solution: "使用方向缓冲 + 禁止反向：\`if event.key == K_UP and direction != DOWN:\`" },
          { problem: "蛇移动卡顿/不流畅", solution: "调整 \`clock.tick(speed)\` 的参数，或使用 \`SPEED_INCREMENT\` 控制加速幅度" },
        ],
        tips: [
          `这是一种称为"队列"（Queue）的数据结构思想：先进先出`,
          "实际更高效的实现可以使用 \`collections.deque\`",
        ],
      },
      {
        id: "collision-detection",
        title: "碰撞检测",
        codeLanguage: "python",
        code: `def check_collision(snake_body, grid_cols, grid_rows, wall_pass):
    """
    碰撞检测：撞墙 或 撞自己

    参数:
        wall_pass: 是否开启穿墙模式
                   True  → 蛇穿墙从另一侧出现（不触发碰撞）
                   False → 撞墙即游戏结束
    """
    head_x, head_y = snake_body[0]

    # 1. 撞墙检测（仅在非穿墙模式下）
    if not wall_pass:
        if (head_x < 0 or head_x >= grid_cols or
            head_y < 0 or head_y >= grid_rows):
            return True

    # 2. 撞自己检测（穿墙模式也要检测）
    if snake_body[0] in snake_body[1:]:
        return True

    return False`,
        explanation: `
**碰撞检测的两种类型：**

**1. 撞墙检测 — 条件判断**
- 仅在 \`wall_pass = False\` （非穿墙模式）时才检测
- 穿墙模式下，蛇头超出边界不视为碰撞，而是由 \`apply_wall_pass()\` 处理"传送"
- 蛇头的网格坐标超出了[0, grid_cols)和[0, grid_rows)的范围

**2. 撞自己检测 — 始终生效**
- 无论是否穿墙模式，撞到自己的身体都算游戏结束
- \`snake_body[1:]\` 切片去除蛇头，只检查身体
- \`in\` 操作符会遍历列表，时间复杂度O(n)

**穿墙模式的工作流程：**
1. 主循环调用 \`move_snake()\` 移动蛇
2. 如果穿墙模式开启，调用 \`apply_wall_pass()\` 修正越界的蛇头坐标
3. 然后调用 \`check_collision()\` 检测碰撞
4. 因为蛇头坐标已被修正，撞墙检测通过，游戏继续
        `,
        algorithmFlow: `
\`\`\`mermaid
flowchart TD
    "获取蛇头坐标" --> "穿墙模式开启？"
    "穿墙模式开启？" --> |是| "跳过撞墙检测"
    "穿墙模式开启？" --> |否| "超出网格边界？"
    "超出网格边界？" --> |是| "返回 True (撞墙)"
    "超出网格边界？" --> |否| "蛇头在身体中？"
    "跳过撞墙检测" --> "蛇头在身体中？"
    "蛇头在身体中？" --> |是| "返回 True (撞自己)"
    "蛇头在身体中？" --> |否| "返回 False (安全)"
\`\`\`
        `,
        tips: [
          "可以用集合(Set)来优化撞自己的检测，将O(n)降为O(1)",
          "蛇头刚到边界的那一帧就触发了碰撞，视觉上很自然",
        ],
      },
    ],
  },
  {
    id: "game-loop",
    title: "游戏主循环",
    description: "事件处理、游戏更新、画面渲染的完整循环",
    subsections: [
      {
        id: "event-handling",
        title: "事件处理与键盘控制",
        codeLanguage: "python",
        code: `# --- 方向控制（关键：不能原地掉头）---
if not paused and not game_over:
    if event.key == pygame.K_UP and direction != DOWN:
        next_dir = UP
    elif event.key == pygame.K_DOWN and direction != UP:
        next_dir = DOWN
    elif event.key == pygame.K_LEFT and direction != RIGHT:
        next_dir = LEFT
    elif event.key == pygame.K_RIGHT and direction != LEFT:
        next_dir = RIGHT

# --- 游戏结束后的菜单返回 ---
if game_over:
    if event.key == pygame.K_r:
        # 重新开始
        snake_body, direction, ... = reset_game(config)
    elif event.key == pygame.K_q:
        # 退出游戏
        pygame.quit(); sys.exit()
    elif event.key == pygame.K_m:
        # 返回菜单
        return "menu"`,
        explanation: `
**事件驱动编程的核心概念：**

\`pygame.event.get()\` 获取所有待处理的事件队列。事件类型包括：
- \`pygame.QUIT\`：窗口关闭
- \`pygame.KEYDOWN\`：键盘按键
- \`pygame.MOUSEBUTTONDOWN\`：鼠标点击

**方向控制的陷阱——禁止原地掉头：**
如果蛇正向右走，玩家不能直接按左键。因为蛇头已经在右侧，如果立即左转，蛇头会穿过自己的身体。

**新增的 M 键功能：**
- 游戏结束后按 \`M\` 键返回主菜单
- 函数通过 \`return "menu"\` 告诉主循环切换回菜单
- 这是一个"控制流"的巧妙设计——用返回值控制程序流程

**其他控制键：**
- P：暂停/继续
- R：游戏结束后重新开始
- Q：退出游戏
        `,
        commonIssues: [
          { problem: "按键有时无响应", solution: "确认在事件循环中处理按键，而不是在事件循环外部" },
          { problem: "一帧内多次转向", solution: "使用 next_dir 缓冲方向输入，每帧只应用一次方向变化" },
        ],
        tips: [
          "可以使用 \`pygame.key.get_pressed()\` 获取持续按键状态，但这里用事件方式更适合方向控制",
          "添加按键防抖可以提升游戏体验",
        ],
      },
      {
        id: "main-loop",
        title: "主循环与帧率控制",
        codeLanguage: "python",
        code: `def game_loop(screen, clock, config):
    """游戏主循环 - 根据配置运行游戏"""
    window_width = config.window_width
    window_height = config.window_height
    grid_cols = config.grid_cols
    grid_rows = config.grid_rows
    wall_pass = config.wall_pass

    # 如果窗口尺寸变了，重新创建
    if screen.get_size() != (window_width, window_height):
        screen = pygame.display.set_mode((window_width, window_height))

    font = load_chinese_font(28)
    big_font = load_chinese_font(60)

    (snake_body, direction, next_dir, food_pos,
     score, speed, speed_increment,
     game_over, paused) = reset_game(config)

    running = True
    while running:
        # 第1步：处理事件
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False; pygame.quit(); sys.exit()
            if event.type == pygame.KEYDOWN:
                if game_over:
                    if event.key == pygame.K_r:
                        (snake_body, ...) = reset_game(config)
                    elif event.key == pygame.K_q:
                        running = False; pygame.quit(); sys.exit()
                    elif event.key == pygame.K_m:
                        return "menu"
                    continue
                if event.key == pygame.K_p:
                    paused = not paused
                # 方向控制...

        # 第2步：更新游戏状态
        if not game_over and not paused:
            direction = next_dir
            snake_body, ate_food = move_snake(snake_body, direction, food_pos)

            # 穿墙模式：蛇头出界则从另一侧穿出
            if wall_pass:
                apply_wall_pass(snake_body, grid_cols, grid_rows)

            if check_collision(snake_body, grid_cols, grid_rows, wall_pass):
                game_over = True

            if ate_food:
                score += 1
                speed += speed_increment
                food_pos = get_random_food_position(snake_body, grid_cols, grid_rows)

        # 第3步：绘制画面
        screen.fill(BLACK)
        draw_grid(screen, grid_cols, grid_rows, window_width, window_height)
        draw_snake(screen, snake_body)
        draw_food(screen, food_pos)

        score_text = font.render(f"得分: {score}", True, WHITE)
        screen.blit(score_text, (10, 10))
        speed_text = font.render(f"速度: {config.speed_name}", True, LIGHT_GRAY)
        screen.blit(speed_text, (10, 40))
        mode_text = font.render(f"穿墙: {'开' if wall_pass else '关'}", True,
                                GREEN if wall_pass else GRAY)
        screen.blit(mode_text, (10, 70))
        # ... 暂停/游戏结束覆盖层 ...

        # 第4步：刷新画面 + 控制帧率
        pygame.display.flip()
        clock.tick(speed)


def main():
    """主函数 - 程序入口"""
    initial_width = MAP_PRESETS["中型"][2]
    initial_height = MAP_PRESETS["中型"][3]
    screen = pygame.display.set_mode((initial_width, initial_height))
    pygame.display.set_caption("贪吃蛇游戏")
    clock = pygame.time.Clock()

    while True:
        config = menu_loop(screen, clock)     # 菜单 → 配置
        result = game_loop(screen, clock, config)  # 游戏 → 结果
        if result is None:
            break


if __name__ == "__main__":
    main()`,
        explanation: `
**游戏循环模式（Game Loop Pattern）**

这是所有游戏的核心架构，一个永不停歇的循环：

**第1步：处理事件（Input）**
- 获取用户输入（键盘、鼠标等）
- M键可返回菜单，实现了"菜单 ↔ 游戏"的切换

**第2步：更新状态（Update）**
- 移动蛇 → 穿墙处理 → 碰撞检测 → 食物判定
- 新增的 \`apply_wall_pass()\` 调用在 \`move_snake()\` 和 \`check_collision()\` 之间

**第3步：绘制画面（Render）**
- 使用 \`config.speed_name\` 显示速度档位名称
- 使用 \`wall_pass\` 显示穿墙模式状态（绿色=开，灰色=关）

**第4步：控制帧率（Tick）**
- \`clock.tick(speed)\` 控制每秒循环次数
- speed 会随吃食物而增加，游戏越来越快

**菜单↔游戏的双循环架构：**
\`main()\` 函数使用 \`while True\` 循环：先显示菜单获取配置，再进入游戏。游戏结束后按 M 键回到菜单，形成完整的用户体验闭环。
        `,
        algorithmFlow: `
\`\`\`mermaid
flowchart TD
    "程序启动(main)" --> "创建窗口"
    "创建窗口" --> "菜单循环"
    "菜单循环" --> "获得GameConfig"
    "获得GameConfig" --> "游戏循环"
    "游戏循环" --> "处理事件"
    "处理事件" --> "更新状态"
    "更新状态" --> "绘制画面"
    "绘制画面" --> "控制帧率"
    "控制帧率" --> "处理事件"
    "游戏结束→按M" --> "菜单循环"
    "游戏结束→按Q" --> "退出"
    "菜单→按关闭" --> "退出"
\`\`\`
        `,
        tips: [
          "游戏循环模式适用于几乎所有类型的游戏",
          "将Input/Update/Render分离，代码结构更清晰",
          "\`__name__ == '__main__'\` 确保脚本被导入时不会自动运行",
        ],
      },
    ],
  },
  {
    id: "menu-system",
    title: "菜单系统与游戏配置",
    description: "游戏配置类、UI组件、菜单循环和穿墙算法",
    subsections: [
      {
        id: "game-config",
        title: "GameConfig 配置类",
        codeLanguage: "python",
        code: `class GameConfig:
    """游戏配置类 - 存储玩家在菜单中设置的所有选项"""
    def __init__(self):
        self.speed_name = "中等"
        self.speed_value = SPEED_PRESETS[self.speed_name][0]
        self.speed_increment = SPEED_PRESETS[self.speed_name][1]
        self.map_name = "中型"
        self.grid_cols = MAP_PRESETS[self.map_name][0]
        self.grid_rows = MAP_PRESETS[self.map_name][1]
        self.window_width = MAP_PRESETS[self.map_name][2]
        self.window_height = MAP_PRESETS[self.map_name][3]
        self.wall_pass = False

    def update_speed(self, speed_name):
        self.speed_name = speed_name
        self.speed_value = SPEED_PRESETS[speed_name][0]
        self.speed_increment = SPEED_PRESETS[speed_name][1]

    def update_map(self, map_name):
        self.map_name = map_name
        self.grid_cols = MAP_PRESETS[map_name][0]
        self.grid_rows = MAP_PRESETS[map_name][1]
        self.window_width = MAP_PRESETS[map_name][2]
        self.window_height = MAP_PRESETS[map_name][3]`,
        explanation: `
**为什么需要 GameConfig 类？**

之前的版本直接将常量写在全局作用域（如 \`WINDOW_WIDTH = 800\`），这种方式的问题是：
1. 游戏配置是**固定的**，玩家无法选择
2. 代码耦合度高，修改配置需要改常量定义

**GameConfig 的优势：**
1. **菜单和游戏逻辑解耦** — 菜单只管"用户选了什么"，游戏逻辑只管"按配置运行"
2. **集中管理** — 所有配置项在一个类中，一目了然
3. **易于扩展** — 添加新选项只需要在类中加字段

**配置驱动游戏：**
- \`speed_value\` → 控制 \`clock.tick(speed)\` 的帧率
- \`speed_increment\` → 每吃一个食物增加的速度
- \`grid_cols/grid_rows\` → 控制网格范围和食物生成范围
- \`window_width/window_height\` → 控制窗口大小
- \`wall_pass\` → 控制碰撞检测逻辑
        `,
        tips: [
          "使用配置对象而非全局变量，让代码更可测试",
          "可以在 GameConfig 中添加更多设置项，如音效开关、难度等级等",
        ],
      },
      {
        id: "button-ui",
        title: "Button 与 ToggleButton UI 组件",
        codeLanguage: "python",
        code: `class Button:
    """可点击按钮组件"""
    def __init__(self, x, y, width, height, text, font,
                 color=BLUE, hover_color=DARK_BLUE, text_color=WHITE):
        self.rect = pygame.Rect(x, y, width, height)
        self.text = text
        self.font = font
        self.color = color
        self.hover_color = hover_color
        self.text_color = text_color
        self.enabled = True
        self.is_hovered = False

    def draw(self, surface):
        color = self.hover_color if self.is_hovered else self.color
        pygame.draw.rect(surface, color, self.rect, border_radius=8)
        pygame.draw.rect(surface, WHITE, self.rect, 2, border_radius=8)
        text_surf = self.font.render(self.text, True, self.text_color)
        text_rect = text_surf.get_rect(center=self.rect.center)
        surface.blit(text_surf, text_rect)

    def handle_event(self, event):
        if not self.enabled:
            return False
        if event.type == pygame.MOUSEMOTION:
            self.is_hovered = self.rect.collidepoint(event.pos)
        elif event.type == pygame.MOUSEBUTTONDOWN:
            if event.button == 1 and self.rect.collidepoint(event.pos):
                return True
        return False


class ToggleButton:
    """开关按钮 - 用于切换选项（如穿墙模式）"""
    def __init__(self, x, y, width, height, label, font,
                 color=GRAY, active_color=GREEN):
        self.rect = pygame.Rect(x, y, width, height)
        self.label = label
        self.font = font
        self.color = color
        self.active_color = active_color
        self.is_active = False
        self.is_hovered = False

    def draw(self, surface):
        bg_color = self.active_color if self.is_active else self.color
        pygame.draw.rect(surface, bg_color, self.rect, border_radius=8)
        pygame.draw.rect(surface, WHITE, self.rect, 2, border_radius=8)
        status = "开" if self.is_active else "关"
        text = f"{self.label} [ {status} ]"
        text_surf = self.font.render(text, True, WHITE)
        text_rect = text_surf.get_rect(center=self.rect.center)
        surface.blit(text_surf, text_rect)

    def handle_event(self, event):
        if event.type == pygame.MOUSEMOTION:
            self.is_hovered = self.rect.collidepoint(event.pos)
        elif event.type == pygame.MOUSEBUTTONDOWN:
            if event.button == 1 and self.rect.collidepoint(event.pos):
                self.is_active = not self.is_active
                return True
        return False`,
        explanation: `
**UI 组件的设计模式：**

**Button（普通按钮）：**
- 每个按钮包含：矩形区域（\`pygame.Rect\`）、文字、字体、颜色
- \`draw()\` 方法负责绘制按钮外观（圆角矩形 + 边框 + 居中文字）
- \`handle_event()\` 处理鼠标悬停（改变颜色）和点击事件
- 返回 \`True\` 表示被点击，调用方据此执行对应操作

**ToggleButton（开关按钮）：**
- 继承 Button 的设计思路，但增加了 \`is_active\` 状态
- 显示为 \`"穿墙模式 [ 开 ]"\` 或 \`"穿墙模式 [ 关 ]"\`
- 点击即切换状态，调用方通过 \`.is_active\` 获取当前值

**鼠标事件处理：**
- \`pygame.MOUSEMOTION\`：更新 \`is_hovered\` 状态
- \`pygame.MOUSEBUTTONDOWN\`：检测左键点击（\`event.button == 1\`）且在矩形范围内
        `,
        algorithmFlow: `
\`\`\`mermaid
flowchart TD
    "用户操作" --> "鼠标移动"
    "用户操作" --> "鼠标点击"
    "鼠标移动" --> "检测矩形碰撞"
    "检测矩形碰撞" --> "更新is_hovered"
    "更新is_hovered" --> "下一帧绘制时变色"
    "鼠标点击" --> "检测左键+矩形碰撞"
    "检测左键+矩形碰撞" --> "Button: 返回True"
    "检测左键+矩形碰撞" --> "Toggle: 切换is_active"
\`\`\`
        `,
        tips: [
          "可以为 Button 添加 set_position() 方法，方便重新布局",
          "ToggleButton 的开关状态可以通过外部代码强制设置，用于重置菜单",
        ],
      },
      {
        id: "menu-loop",
        title: "菜单循环 (menu_loop)",
        codeLanguage: "python",
        code: `def menu_loop(screen, clock):
    """游戏主菜单 - 选择配置后返回 GameConfig"""
    config = GameConfig()
    window_width, window_height = screen.get_size()

    title_font = load_chinese_font(64)
    subtitle_font = load_chinese_font(28)
    button_font = load_chinese_font(30)
    option_font = load_chinese_font(26)

    # 创建速度选项按钮
    speed_buttons = []
    speed_names = list(SPEED_PRESETS.keys())
    btn_w, btn_h = 130, 45
    start_x = (window_width - (len(speed_names) * btn_w + (len(speed_names) - 1) * 15)) // 2
    for i, name in enumerate(speed_names):
        x = start_x + i * (btn_w + 15)
        btn = Button(x, 200, btn_w, btn_h, name, option_font,
                     color=DARK_GRAY, hover_color=HIGHLIGHT)
        speed_buttons.append((btn, name))

    # 创建地图大小选项按钮
    map_buttons = []
    map_names = list(MAP_PRESETS.keys())
    start_x = (window_width - (len(map_names) * btn_w + (len(map_names) - 1) * 15)) // 2
    for i, name in enumerate(map_names):
        x = start_x + i * (btn_w + 15)
        btn = Button(x, 310, btn_w, btn_h, name, option_font,
                     color=DARK_GRAY, hover_color=HIGHLIGHT)
        map_buttons.append((btn, name))

    # 穿墙模式开关
    toggle_btn = ToggleButton(
        window_width // 2 - 150, 410, 300, 50,
        "穿墙模式", option_font
    )

    # 开始游戏按钮
    start_btn = Button(
        window_width // 2 - 120, 520, 240, 60,
        "开始游戏", button_font,
        color=GREEN, hover_color=DARK_GREEN
    )

    selected_speed = config.speed_name
    selected_map = config.map_name

    while True:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit(); sys.exit()
            for btn, name in speed_buttons:
                if btn.handle_event(event):
                    selected_speed = name; config.update_speed(name)
            for btn, name in map_buttons:
                if btn.handle_event(event):
                    selected_map = name; config.update_map(name)
            toggle_btn.handle_event(event)
            if start_btn.handle_event(event):
                config.wall_pass = toggle_btn.is_active
                return config

        # 绘制菜单...
        screen.fill(BG_COLOR)
        # ... 标题、按钮、提示信息 ...
        pygame.display.flip()
        clock.tick(60)`,
        explanation: `
**菜单循环的设计思路：**

菜单和游戏是两个**完全独立的事件循环**，各有各的绘制逻辑和事件处理。

**菜单的布局结构：**
1. 标题区域（🐍 贪吃蛇 + 副标题）
2. 速度选择区（5个按钮水平排列）
3. 地图大小选择区（4个按钮水平排列）
4. 穿墙模式开关
5. 开始游戏按钮
6. 底部提示

**选中状态的高亮：**
- \`selected_speed\` 和 \`selected_map\` 标记当前选中项
- 每帧绘制时，被选中的按钮使用 \`HIGHLIGHT\` 颜色，未被选中的用 \`DARK_GRAY\`
- 视觉上清晰区分已选和未选项

**配置传递流程：**
1. 菜单创建 \`GameConfig\` 对象（使用默认值）
2. 玩家点击速度按钮 → \`config.update_speed(name)\`
3. 玩家点击地图按钮 → \`config.update_map(name)\`
4. 点击"开始游戏" → \`config.wall_pass = toggle_btn.is_active\`
5. \`return config\` → 菜单结束，游戏开始
        `,
        algorithmFlow: `
\`\`\`mermaid
flowchart TD
    "进入菜单" --> "创建GameConfig(默认值)"
    "创建GameConfig" --> "菜单主循环"
    "菜单主循环" --> "绘制所有UI元素"
    "菜单主循环" --> "处理事件"
    "处理事件" --> "速度按钮点击?"
    "处理事件" --> "地图按钮点击?"
    "处理事件" --> "穿墙开关切换?"
    "处理事件" --> "开始按钮点击?"
    "速度按钮点击?" --> |是| "update_speed()"
    "地图按钮点击?" --> |是| "update_map()"
    "穿墙开关切换?" --> |是| "切换is_active状态"
    "开始按钮点击?" --> |是| "return config → 进入游戏"
\`\`\`
        `,
        tips: [
          "菜单使用 60 FPS 渲染，流畅的动画效果提升用户体验",
          "菜单和游戏分离的设计让代码更容易维护和扩展",
        ],
      },
      {
        id: "wall-pass",
        title: "穿墙模式算法 (apply_wall_pass)",
        codeLanguage: "python",
        code: `def apply_wall_pass(snake_body, grid_cols, grid_rows):
    """
    穿墙逻辑：如果蛇头超出边界，从另一侧穿出

    - head_x = -1   → head_x = grid_cols - 1（从最右侧出现）
    - head_x = cols → head_x = 0（从最左侧出现）
    - 同理处理 y 方向
    """
    head_x, head_y = snake_body[0]
    new_head = (head_x, head_y)
    wrapped = False

    if head_x < 0:
        new_head = (grid_cols - 1, head_y)
        wrapped = True
    elif head_x >= grid_cols:
        new_head = (0, head_y)
        wrapped = True
    elif head_y < 0:
        new_head = (head_x, grid_rows - 1)
        wrapped = True
    elif head_y >= grid_rows:
        new_head = (head_x, 0)
        wrapped = True

    if wrapped:
        snake_body[0] = new_head`,
        explanation: `
**穿墙模式的核心算法：**

当蛇头走出屏幕边界时，不是死亡，而是从另一侧"传送"回来。

**取模运算思想：**
\`apply_wall_pass\` 相当于对每个轴执行"取模"操作：
- 如果 \`head_x < 0\`，重置为 \`grid_cols - 1\`（最右侧）
- 如果 \`head_x >= grid_cols\`，重置为 \`0\`（最左侧）
- Y轴同理：超上 = 从底部出现，超下 = 从顶部出现

**与碰撞检测的协作：**
- \`move_snake()\` → 移动蛇，蛇头可能越界
- \`apply_wall_pass()\` → 修正越界的蛇头坐标
- \`check_collision()\` → 检测碰撞（穿墙模式下不检测撞墙）
这三步按顺序执行，各自负责一个独立的职责。

**为什么用 \`elif\` 而非多个 \`if\`？**
因为蛇头不可能同时超出两个方向的边界——它只有一个坐标位置。
        `,
        algorithmFlow: `
\`\`\`mermaid
flowchart TD
    "获取蛇头坐标" --> "x < 0?"
    "x < 0?" --> |是| "x = grid_cols - 1 (从右出现)"
    "x < 0?" --> |否| "x >= grid_cols?"
    "x >= grid_cols?" --> |是| "x = 0 (从左出现)"
    "x >= grid_cols?" --> |否| "y < 0?"
    "y < 0?" --> |是| "y = grid_rows - 1 (从下出现)"
    "y < 0?" --> |否| "y >= grid_rows?"
    "y >= grid_rows?" --> |是| "y = 0 (从上出现)"
    "y >= grid_rows?" --> |否| "无需处理"
\`\`\`
        `,
        tips: [
          "穿墙模式可以看作是一个环面（Torus）拓扑的游戏世界",
          "结合穿墙模式 + 加速系统，游戏后期会非常有挑战性",
        ],
      },
      {
        id: "chinese-font",
        title: "中文字体加载 (load_chinese_font)",
        codeLanguage: "python",
        code: `def load_chinese_font(size):
    """加载支持中文的字体"""
    font_paths = [
        "C:/Windows/Fonts/msyh.ttc",
        "C:/Windows/Fonts/msyhbd.ttc",
        "C:/Windows/Fonts/simhei.ttf",
        "C:/Windows/Fonts/simsun.ttc",
        "C:/Windows/Fonts/deng.ttf",
        "C:/Windows/Fonts/fangsong.ttf",
    ]
    for path in font_paths:
        if os.path.exists(path):
            try:
                font = pygame.font.Font(path, size)
                test_surface = font.render("测试", True, WHITE)
                if test_surface.get_width() > 0:
                    return font
            except:
                continue
    print("警告：未找到中文字体，中文可能显示为方块")
    return pygame.font.Font(None, size)`,
        explanation: `
**为什么需要这个函数？**

Pygame 的 \`pygame.font.Font(None, size)\` 使用默认字体，只支持英文字符。
遇到中文时会显示为方块（俗称"豆腐块"问题）。

**字体加载策略（优先级）：**
1. **微软雅黑** (msyh.ttc) — 首选，现代清晰
2. **微软雅黑粗体** (msyhbd.ttc) — 备选
3. **黑体** (simhei.ttf) — 粗体，适合标题
4. **宋体** (simsun.ttc) — 衬线字体
5. **等线** (deng.ttf) — 现代无衬线
6. **仿宋** (fangsong.ttf) — 衬线字体

**双重验证机制：**
- \`os.path.exists(path)\` 先检查文件是否存在
- \`font.render("测试", True, WHITE)\` 再测试能否正常渲染
- \`test_surface.get_width() > 0\` 确保渲染结果非空

**Fallback 处理：**
如果所有字体都加载失败，打印警告并返回 Pygame 默认字体（虽然中文仍可能显示为方块，但程序不会崩溃）。
        `,
        commonIssues: [
          { problem: "所有字体路径都找不到", solution: "检查 Windows/Fonts 目录是否存在。macOS/Linux 需要修改字体路径" },
          { problem: "字体文件损坏但 os.path.exists 返回 True", solution: "try/except 捕获异常，确保程序不会崩溃" },
        ],
        tips: [
          "在 macOS 上，字体路径为 /System/Library/Fonts/ 和 /Library/Fonts/",
          "在 Linux 上，字体路径通常为 /usr/share/fonts/",
          "可以将字体文件放在项目目录中，用相对路径加载",
        ],
      },
      {
        id: "main-entry",
        title: "程序入口 (main 函数)",
        codeLanguage: "python",
        code: `def main():
    """主函数 - 程序从这里开始"""
    initial_width = MAP_PRESETS["中型"][2]
    initial_height = MAP_PRESETS["中型"][3]
    screen = pygame.display.set_mode((initial_width, initial_height))
    pygame.display.set_caption("贪吃蛇游戏")
    clock = pygame.time.Clock()

    print("🐍 贪吃蛇游戏启动!")
    print("操作说明：")
    print("  ↑ ↓ ← →  控制方向")
    print("  P         暂停/继续")
    print("  R         重新开始（游戏结束后）")
    print("  M         返回菜单（游戏结束后）")
    print("  Q         退出")
    print("=" * 30)

    while True:
        config = menu_loop(screen, clock)       # 阶段1：菜单
        result = game_loop(screen, clock, config)  # 阶段2：游戏
        if result is None:                      # 用户退出
            break


if __name__ == "__main__":
    main()`,
        explanation: `
**程序入口的设计：**

**\`__name__ == "__main__"\` 的用途：**
- 当脚本直接被 Python 运行时，\`__name__\` 等于 \`"__main__"\`
- 当脚本被其他模块导入时，\`__name__\` 等于文件名，不会自动执行
- 这样设计可以安全地导入这个文件中的函数，而不会意外启动游戏

**主循环的"两阶段"架构：**
1. **菜单阶段**：\`menu_loop(screen, clock)\` 显示菜单，返回 \`GameConfig\`
2. **游戏阶段**：\`game_loop(screen, clock, config)\` 用配置运行游戏

**菜单↔游戏的切换：**
- \`game_loop\` 中按 M 键 → \`return "menu"\` → 回到 \`main()\` 的 while 循环
- 循环重新调用 \`menu_loop\` → 显示菜单 → 玩家可重新配置
- 这是一个优雅的"状态机"设计模式

**控制台输出操作说明：**
在终端中打印操作说明，帮助玩家快速上手。
        `,
        algorithmFlow: `
\`\`\`mermaid
flowchart TD
    "main()" --> "创建窗口(中型默认)"
    "创建窗口" --> "进入主循环"
    "进入主循环" --> "{调用menu_loop()}"
    "{调用menu_loop()}" --> "菜单循环..."
    "菜单循环..." --> "返回GameConfig"
    "返回GameConfig" --> "{调用game_loop()}"
    "{调用game_loop()}" --> "游戏循环..."
    "游戏循环..." --> "按M键→返回'menu'"
    "按M键→返回'menu'" --> "进入主循环"
    "游戏循环..." --> "按Q键/关闭窗口→返回None"
    "按Q键/关闭窗口→返回None" --> "break→程序结束"
\`\`\`
        `,
        tips: [
          `main() 函数是程序的"总指挥"，负责协调菜单和游戏两个子系统`,
          "将窗口创建放在 main() 中，菜单和游戏共享同一个 screen 和 clock",
        ],
      },
    ],
  },
  {
    id: "advanced",
    title: "功能扩展与优化",
    description: "暂停、加速、代码优化与最佳实践",
    subsections: [
      {
        id: "pause-score",
        title: "暂停、得分与加速系统",
        codeLanguage: "python",
        code: `# --- 暂停切换 ---
if event.key == pygame.K_p:
    paused = not paused

# --- 吃到食物后的处理 ---
if ate_food:
    score += 1
    speed += speed_increment       # 速度增量由速度档位决定
    food_pos = get_random_food_position(snake_body, grid_cols, grid_rows)

# --- 暂停画面 ---
if paused and not game_over:
    show_text(screen, "暂停中", big_font, WHITE,
             window_width // 2, window_height // 2 - 20)
    show_text(screen, "按 P 继续", font, GRAY,
             window_width // 2, window_height // 2 + 30)

# --- 状态信息显示（左上角）---
score_text = font.render(f"得分: {score}", True, WHITE)
screen.blit(score_text, (10, 10))

speed_text = font.render(f"速度: {config.speed_name}", True, LIGHT_GRAY)
screen.blit(speed_text, (10, 40))

mode_text = font.render(f"穿墙: {'开' if wall_pass else '关'}", True,
                        GREEN if wall_pass else GRAY)
screen.blit(mode_text, (10, 70))`,
        explanation: `
**功能扩展的设计思路：**

**暂停系统：**
- 使用 \`paused\` 布尔值控制
- 暂停时跳过 Update 步骤，但继续渲染画面
- 显示"暂停中"提示文字（使用新的 \`show_text\` 签名）

**得分系统：**
- 每吃一个食物 +1 分
- 分数显示在屏幕左上角 (\`screen.blit(score_text, (10, 10))\`)

**加速系统：**
- 每吃一个食物，速度增加 \`speed_increment\`（由速度档位决定）
- "极慢"档每吃一个食物 +0.3，"极速"档 +0.8
- 速度越快，游戏难度越大

**状态信息显示：**
- 第1行：当前得分
- 第2行：当前速度档位名称
- 第3行：穿墙模式开关状态（开启时绿色，关闭时灰色）
- 使用 \`font.render()\` 直接渲染，不再依赖 \`show_score()\` 函数

**设计原则（YAGNI）：**
- 不要过早添加不需要的功能
- 先实现核心玩法（移动+吃食物+碰撞）
- 再逐步添加"增强"功能（暂停、加速、计分、菜单）
        `,
        commonIssues: [
          { problem: "速度增加到不可玩", solution: "设置最高速度上限：\`min(speed, MAX_SPEED)\`" },
          { problem: "暂停时画面闪烁", solution: "暂停时仍然执行渲染步骤，只是跳过更新逻辑" },
        ],
        tips: [
          "可以添加最高分记录功能（使用文件或数据库）",
          "不同速度档位的增速不同（0.3~0.8），让玩家有更多选择",
        ],
      },
      {
        id: "optimization",
        title: "代码优化与最佳实践",
        codeLanguage: "python",
        code: `# 优化建议1：使用 deque 提升蛇身操作性能
from collections import deque

snake_body = deque([
    (start_x, start_y),
    (start_x - 1, start_y),
    (start_x - 2, start_y),
])
# deque 的 appendleft() 和 pop() 都是 O(1)


# 优化建议2：使用集合加速碰撞检测
snake_set = set(snake_body)  # O(1) 的查找
if snake_body[0] in snake_body[1:]:
    # 可以优化为：
    if snake_body[0] in snake_set:
        pass


# 优化建议3：面向对象重构
class Snake:
    def __init__(self):
        self.body = [...]
        self.direction = RIGHT

    def move(self):
        new_head = (self.body[0][0] + self.direction[0],
                    self.body[0][1] + self.direction[1])
        self.body.insert(0, new_head)

    def grow(self):
        # 不移除尾部 = 变长
        pass

    def shrink(self):
        self.body.pop()


# 优化建议4：使用常量枚举
from enum import Enum

class Direction(Enum):
    UP = (0, -1)
    DOWN = (0, 1)
    LEFT = (-1, 0)
    RIGHT = (1, 0)

class Color:
    BLACK = (0, 0, 0)
    GREEN = (0, 255, 0)
    RED = (255, 0, 0)`,
        explanation: `
**从"能运行"到"好代码"的进阶之路：**

**1. 性能优化：使用 deque**
Python列表的头部插入（\`list.insert(0, item)\`）是O(n)操作。
\`collections.deque\` 支持O(1)的双端操作，更适合蛇身的移动。

**2. 碰撞检测优化**
\`snake_body[0] in snake_body[1:]\` 会创建切片并遍历，时间复杂度O(n)。
用集合（Set）存储蛇身坐标，查找速度降为O(1)。

**3. 面向对象重构**
将蛇、食物、游戏状态分别封装为类，代码更模块化、可测试。
新版代码中的 \`Button\`、\`ToggleButton\`、\`GameConfig\` 已经展示了面向对象的好处。

**4. 使用枚举**
用Enum定义方向和颜色，避免"魔法值"，提高代码可读性。

**什么时候应该优化？**
- 代码正常工作后，再考虑优化
- "先让它跑起来，再让它跑得快"
- 教学目的下，可读性比性能更重要
        `,
        tips: [
          "遵循KISS原则（Keep It Simple, Stupid）",
          "遵循DRY原则（Don't Repeat Yourself）",
          `写注释解释"为什么"而不是"是什么"`,
          "使用类型提示（Type Hints）提高代码可读性",
        ],
      },
    ],
  },
];

export const gameSections = [
  { id: "environment", title: "环境搭建", subs: ["pygame-install", "constants"] },
  { id: "game-framework", title: "游戏框架", subs: ["window-creation", "helper-functions"] },
  { id: "game-logic", title: "游戏逻辑", subs: ["reset-game", "snake-movement", "collision-detection"] },
  { id: "game-loop", title: "游戏主循环", subs: ["event-handling", "main-loop"] },
  { id: "menu-system", title: "菜单系统与游戏配置", subs: ["game-config", "button-ui", "menu-loop", "wall-pass", "chinese-font", "main-entry"] },
  { id: "advanced", title: "功能扩展与优化", subs: ["pause-score", "optimization"] },
];

export function getChapter(id: string): TutorialChapter | undefined {
  return tutorialChapters.find(c => c.id === id);
}

export function getSubsection(chapterId: string, subsectionId: string): TutorialSubsection | undefined {
  const chapter = getChapter(chapterId);
  return chapter?.subsections.find(s => s.id === subsectionId);
}

export function getNextSubsection(chapterId: string, subsectionId: string): { chapterId: string; subsectionId: string } | null {
  for (let i = 0; i < tutorialChapters.length; i++) {
    const ch = tutorialChapters[i];
    for (let j = 0; j < ch.subsections.length; j++) {
      if (ch.id === chapterId && ch.subsections[j].id === subsectionId) {
        if (j + 1 < ch.subsections.length) {
          return { chapterId: ch.id, subsectionId: ch.subsections[j + 1].id };
        }
        if (i + 1 < tutorialChapters.length) {
          return { chapterId: tutorialChapters[i + 1].id, subsectionId: tutorialChapters[i + 1].subsections[0].id };
        }
        return null;
      }
    }
  }
  return null;
}

export function getPrevSubsection(chapterId: string, subsectionId: string): { chapterId: string; subsectionId: string } | null {
  for (let i = 0; i < tutorialChapters.length; i++) {
    const ch = tutorialChapters[i];
    for (let j = 0; j < ch.subsections.length; j++) {
      if (ch.id === chapterId && ch.subsections[j].id === subsectionId) {
        if (j > 0) {
          return { chapterId: ch.id, subsectionId: ch.subsections[j - 1].id };
        }
        if (i > 0) {
          const prevCh = tutorialChapters[i - 1];
          return { chapterId: prevCh.id, subsectionId: prevCh.subsections[prevCh.subsections.length - 1].id };
        }
        return null;
      }
    }
  }
  return null;
}
