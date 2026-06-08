"""
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
pygame.init()

# =============================================
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
# 键 = 档位名, 值 = (初始速度, 每吃一个食物增加的速度)
SPEED_PRESETS = {
    "极慢": (5, 0.3),
    "慢速": (8, 0.4),
    "中等": (10, 0.5),
    "快速": (14, 0.6),
    "极速": (18, 0.8),
}

# --- 地图大小预设 ---
# 键 = 名称, 值 = (列数, 行数, 窗口宽, 窗口高)
# 每格 20x20 像素
MAP_PRESETS = {
    "小型":  (25, 20, 500, 400),
    "中型":  (40, 30, 800, 600),
    "大型":  (55, 40, 1100, 800),
    "超大型": (70, 50, 1400, 1000),
}


# =============================================
# 第三步：加载中文字体（解决"豆腐块"问题）
# =============================================
def load_chinese_font(size):
    """
    加载支持中文的字体

    【为什么会出现"豆腐块"？】
    pygame.font.Font(None, size) 使用的是 Pygame 默认字体
    它只支持英文字符，遇到中文就会显示为方块

    【解决方案】
    从 Windows 系统字体目录加载中文字体
    按优先级尝试多个常见中文字体
    """
    # Windows 系统字体路径
    font_paths = [
        # Microsoft YaHei（微软雅黑）— 最清晰现代
        "C:/Windows/Fonts/msyh.ttc",
        "C:/Windows/Fonts/msyhbd.ttc",
        # SimHei（黑体）— 粗体清晰
        "C:/Windows/Fonts/simhei.ttf",
        # SimSun（宋体）
        "C:/Windows/Fonts/simsun.ttc",
        # DengXian（等线）
        "C:/Windows/Fonts/deng.ttf",
        # FangSong（仿宋）
        "C:/Windows/Fonts/fangsong.ttf",
    ]

    for path in font_paths:
        if os.path.exists(path):
            try:
                font = pygame.font.Font(path, size)
                # 测试是否能正常渲染中文
                test_surface = font.render("测试", True, WHITE)
                if test_surface.get_width() > 0:
                    return font
            except:
                continue

    # 如果找不到中文字体，fallback 到默认字体
    # （这时中文还是会显示为方块，但至少程序不会崩溃）
    print("警告：未找到中文字体，中文可能显示为方块")
    return pygame.font.Font(None, size)


# =============================================
# 第四步：游戏配置类
# =============================================

class GameConfig:
    """
    游戏配置类 - 存储玩家在菜单中设置的所有选项

    这样做的好处：
    1. 菜单和游戏逻辑解耦，菜单只管"用户选了什么"
    2. 游戏逻辑只管"按配置来运行"
    3. 以后添加新选项只需要在这里加字段
    """
    def __init__(self):
        # 速度设置
        self.speed_name = "中等"       # 速度档位名称
        self.speed_value = SPEED_PRESETS[self.speed_name][0]   # 初始速度值
        self.speed_increment = SPEED_PRESETS[self.speed_name][1]  # 增速

        # 地图设置
        self.map_name = "中型"         # 地图名称
        self.grid_cols = MAP_PRESETS[self.map_name][0]   # 网格列数
        self.grid_rows = MAP_PRESETS[self.map_name][1]   # 网格行数
        self.window_width = MAP_PRESETS[self.map_name][2]   # 窗口宽度
        self.window_height = MAP_PRESETS[self.map_name][3]  # 窗口高度

        # 游戏模式
        self.wall_pass = False         # 穿墙模式（默认关闭）

    def update_speed(self, speed_name):
        """更新速度设置"""
        self.speed_name = speed_name
        self.speed_value = SPEED_PRESETS[speed_name][0]
        self.speed_increment = SPEED_PRESETS[speed_name][1]

    def update_map(self, map_name):
        """更新地图设置"""
        self.map_name = map_name
        self.grid_cols = MAP_PRESETS[map_name][0]
        self.grid_rows = MAP_PRESETS[map_name][1]
        self.window_width = MAP_PRESETS[map_name][2]
        self.window_height = MAP_PRESETS[map_name][3]


# =============================================
# 第五步：UI 组件（按钮）
# =============================================

class Button:
    """
    可点击按钮组件

    属性：
        rect:   按钮的矩形区域 (pygame.Rect)
        text:   按钮显示的文本
        color:  按钮背景色
        hover_color: 鼠标悬停时的背景色
        text_color:  文字颜色
        font:   字体对象
        enabled: 是否可用
    """
    def __init__(self, x, y, width, height, text, font, color=BLUE,
                 hover_color=DARK_BLUE, text_color=WHITE):
        self.rect = pygame.Rect(x, y, width, height)
        self.text = text
        self.font = font
        self.color = color
        self.hover_color = hover_color
        self.text_color = text_color
        self.enabled = True
        self.is_hovered = False

    def draw(self, surface):
        """绘制按钮"""
        # 选择颜色：悬停时用高亮色，否则用普通色
        color = self.hover_color if self.is_hovered else self.color

        # 画按钮背景（圆角效果通过画矩形实现）
        pygame.draw.rect(surface, color, self.rect, border_radius=8)
        # 画边框
        pygame.draw.rect(surface, WHITE, self.rect, 2, border_radius=8)

        # 画文字（居中）
        text_surf = self.font.render(self.text, True, self.text_color)
        text_rect = text_surf.get_rect(center=self.rect.center)
        surface.blit(text_surf, text_rect)

    def handle_event(self, event):
        """
        处理鼠标事件
        返回 True 表示按钮被点击
        """
        if not self.enabled:
            return False

        if event.type == pygame.MOUSEMOTION:
            # 检测鼠标悬停
            self.is_hovered = self.rect.collidepoint(event.pos)

        elif event.type == pygame.MOUSEBUTTONDOWN:
            if event.button == 1 and self.rect.collidepoint(event.pos):
                return True

        return False

    def set_position(self, x, y):
        """更新按钮位置"""
        self.rect.x = x
        self.rect.y = y


class ToggleButton:
    """
    开关按钮 - 用于切换开关选项（如穿墙模式）

    显示为: "穿墙模式 [ 开/关 ]"
    点击切换状态
    """
    def __init__(self, x, y, width, height, label, font,
                 color=GRAY, active_color=GREEN):
        self.rect = pygame.Rect(x, y, width, height)
        self.label = label        # 标签文字
        self.font = font
        self.color = color
        self.active_color = active_color
        self.is_active = False    # 开关状态
        self.is_hovered = False

    def draw(self, surface):
        """绘制开关按钮"""
        # 画背景
        bg_color = self.active_color if self.is_active else self.color
        pygame.draw.rect(surface, bg_color, self.rect, border_radius=8)
        pygame.draw.rect(surface, WHITE, self.rect, 2, border_radius=8)

        # 显示文字："标签 [ 开 ]" 或 "标签 [ 关 ]"
        status = "开" if self.is_active else "关"
        text = f"{self.label} [ {status} ]"
        text_surf = self.font.render(text, True, WHITE)
        text_rect = text_surf.get_rect(center=self.rect.center)
        surface.blit(text_surf, text_rect)

    def handle_event(self, event):
        """处理点击事件，切换状态"""
        if event.type == pygame.MOUSEMOTION:
            self.is_hovered = self.rect.collidepoint(event.pos)

        elif event.type == pygame.MOUSEBUTTONDOWN:
            if event.button == 1 and self.rect.collidepoint(event.pos):
                self.is_active = not self.is_active
                return True
        return False


# =============================================
# 第六步：菜单系统
# =============================================

def menu_loop(screen, clock):
    """
    游戏主菜单

    【设计思路】
    在游戏开始前显示一个配置界面，让玩家可以：
    1. 选择蛇的移动速度
    2. 选择地图大小
    3. 开关穿墙模式
    4. 点击"开始游戏"进入游戏

    菜单有自己的事件循环，和游戏主循环完全独立。
    玩家点击"开始游戏"后才会退出菜单，进入游戏。

    参数:
        screen: Pygame 窗口表面
        clock:  Pygame 时钟

    返回:
        GameConfig 对象，包含玩家所有的设置
    """
    config = GameConfig()
    window_width, window_height = screen.get_size()

    # --- 加载字体 ---
    title_font = load_chinese_font(64)
    subtitle_font = load_chinese_font(28)
    button_font = load_chinese_font(30)
    option_font = load_chinese_font(26)

    # --- 创建各种 UI 元素 ---

    # 速度选项按钮
    speed_buttons = []
    speed_names = list(SPEED_PRESETS.keys())
    btn_w, btn_h = 130, 45
    start_x = (window_width - (len(speed_names) * btn_w + (len(speed_names) - 1) * 15)) // 2
    btn_y_section1 = 200
    for i, name in enumerate(speed_names):
        x = start_x + i * (btn_w + 15)
        btn = Button(x, btn_y_section1, btn_w, btn_h, name, option_font,
                     color=DARK_GRAY, hover_color=HIGHLIGHT)
        speed_buttons.append((btn, name))

    # 地图大小选项按钮
    map_buttons = []
    map_names = list(MAP_PRESETS.keys())
    start_x = (window_width - (len(map_names) * btn_w + (len(map_names) - 1) * 15)) // 2
    btn_y_section2 = 310
    for i, name in enumerate(map_names):
        x = start_x + i * (btn_w + 15)
        btn = Button(x, btn_y_section2, btn_w, btn_h, name, option_font,
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

    # --- 当前选中标记 ---
    selected_speed = config.speed_name
    selected_map = config.map_name

    # 菜单主循环
    menu_running = True
    while menu_running:
        # --- 处理事件 ---
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()

            # 处理所有按钮的事件
            for btn, name in speed_buttons:
                if btn.handle_event(event):
                    selected_speed = name
                    config.update_speed(name)

            for btn, name in map_buttons:
                if btn.handle_event(event):
                    selected_map = name
                    config.update_map(name)

            toggle_btn.handle_event(event)

            if start_btn.handle_event(event):
                # 玩家点击开始游戏 → 应用配置并退出菜单
                config.wall_pass = toggle_btn.is_active
                return config

        # --- 绘制菜单 ---
        screen.fill(BG_COLOR)

        # 标题
        title_surf = title_font.render("🐍 贪吃蛇", True, GREEN)
        title_rect = title_surf.get_rect(center=(window_width // 2, 80))
        screen.blit(title_surf, title_rect)

        # 副标题
        sub_surf = subtitle_font.render("—— 开始前请选择游戏设置 ——", True, LIGHT_GRAY)
        sub_rect = sub_surf.get_rect(center=(window_width // 2, 125))
        screen.blit(sub_surf, sub_rect)

        # 分隔线
        pygame.draw.line(screen, GRAY, (100, 150), (window_width - 100, 150), 1)

        # 速度设置标签
        speed_label = subtitle_font.render("移动速度", True, WHITE)
        screen.blit(speed_label, (80, 165))

        # 当前速度档位提示
        speed_hint = option_font.render(f"当前: {selected_speed}", True, YELLOW)
        hint_rect = speed_hint.get_rect(midright=(window_width - 80, 175))
        screen.blit(speed_hint, hint_rect)

        # 绘制速度按钮
        for btn, name in speed_buttons:
            btn.color = HIGHLIGHT if name == selected_speed else DARK_GRAY
            btn.draw(screen)

        # 地图设置标签
        map_label = subtitle_font.render("地图大小", True, WHITE)
        screen.blit(map_label, (80, 275))

        map_hint = option_font.render(
            f"当前: {selected_map}  ({MAP_PRESETS[selected_map][2]}×{MAP_PRESETS[selected_map][3]})",
            True, YELLOW
        )
        hint_rect = map_hint.get_rect(midright=(window_width - 80, 285))
        screen.blit(map_hint, hint_rect)

        # 绘制地图按钮
        for btn, name in map_buttons:
            btn.color = HIGHLIGHT if name == selected_map else DARK_GRAY
            btn.draw(screen)

        # 穿墙模式旁边的提示文字
        wall_hint = option_font.render("开启后蛇可以穿过墙壁从另一侧出现", True, LIGHT_GRAY)
        screen.blit(wall_hint, (window_width // 2 + 170, 425))

        # 绘制开关
        toggle_btn.draw(screen)

        # 绘制开始按钮
        start_btn.draw(screen)

        # 底部提示
        footer = option_font.render("使用鼠标点击选择  按 ESC 退出", True, GRAY)
        footer_rect = footer.get_rect(center=(window_width // 2, window_height - 30))
        screen.blit(footer, footer_rect)

        # 刷新画面
        pygame.display.flip()
        clock.tick(60)


# =============================================
# 第七步：游戏核心辅助函数
# =============================================

def draw_grid(screen, grid_cols, grid_rows, window_width, window_height):
    """绘制背景网格线"""
    for x in range(0, window_width, GRID_SIZE):
        pygame.draw.line(screen, DARK_GRAY, (x, 0), (x, window_height))
    for y in range(0, window_height, GRID_SIZE):
        pygame.draw.line(screen, DARK_GRAY, (0, y), (window_width, y))


def get_random_food_position(snake_body, grid_cols, grid_rows):
    """随机生成食物位置（确保不在蛇身上）"""
    while True:
        x = random.randint(0, grid_cols - 1)
        y = random.randint(0, grid_rows - 1)
        if (x, y) not in snake_body:
            return (x, y)


def draw_snake(screen, snake_body):
    """绘制蛇的身体"""
    for i, segment in enumerate(snake_body):
        x = segment[0] * GRID_SIZE
        y = segment[1] * GRID_SIZE

        # 蛇头用亮绿色，身体一节比一节暗
        if i == 0:
            color = GREEN
        else:
            # 身体颜色渐变
            darken = min(40 * i, 120)
            color = (0, max(255 - darken, 60), 0)

        rect = pygame.Rect(x, y, GRID_SIZE, GRID_SIZE)
        pygame.draw.rect(screen, color, rect)
        pygame.draw.rect(screen, BLACK, rect, 1)

        # 蛇头画两个眼睛
        if i == 0:
            eye_size = 3
            eye_offset = 5
            # 根据蛇身长度判断方向来确定眼睛位置（简化处理：固定位置）
            pygame.draw.circle(screen, WHITE,
                             (x + eye_offset, y + eye_offset), eye_size)
            pygame.draw.circle(screen, WHITE,
                             (x + GRID_SIZE - eye_offset, y + eye_offset), eye_size)


def draw_food(screen, food_pos):
    """绘制食物"""
    x = food_pos[0] * GRID_SIZE + GRID_SIZE // 2
    y = food_pos[1] * GRID_SIZE + GRID_SIZE // 2
    pygame.draw.circle(screen, RED, (x, y), GRID_SIZE // 2 - 2)
    pygame.draw.circle(screen, DARK_RED, (x, y), GRID_SIZE // 4)


def show_text(screen, text, font_obj, color, center_x, center_y):
    """在指定位置显示文字"""
    text_surface = font_obj.render(text, True, color)
    text_rect = text_surface.get_rect(center=(center_x, center_y))
    screen.blit(text_surface, text_rect)


# =============================================
# 第八步：游戏核心逻辑
# =============================================

def move_snake(snake_body, direction, food_pos):
    """
    移动蛇并判断是否吃到食物

    核心算法：
    1. 计算新蛇头
    2. 插入到列表头部
    3. 吃到食物则保留尾部（蛇变长），否则移除尾部
    """
    head_x, head_y = snake_body[0]
    dx, dy = direction
    new_head = (head_x + dx, head_y + dy)

    new_body = [new_head] + snake_body

    if new_head == food_pos:
        ate_food = True
    else:
        ate_food = False
        new_body.pop()

    return new_body, ate_food


def check_collision(snake_body, grid_cols, grid_rows, wall_pass):
    """
    碰撞检测

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

    return False


def apply_wall_pass(snake_body, grid_cols, grid_rows):
    """
    穿墙逻辑：如果蛇头超出边界，从另一侧穿出

    这是穿墙模式的核心算法：
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
        snake_body[0] = new_head


# =============================================
# 第九步：重置游戏状态
# =============================================

def reset_game(config):
    """
    根据配置重置游戏到初始状态

    现在接受 GameConfig 参数，根据玩家在菜单中的选择
    设置地图大小、速度等参数
    """
    start_x = config.grid_cols // 4
    start_y = config.grid_rows // 2
    snake_body = [
        (start_x, start_y),
        (start_x - 1, start_y),
        (start_x - 2, start_y),
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
            score, speed, speed_increment, game_over, paused)


# =============================================
# 第十步：游戏主循环
# =============================================

def game_loop(screen, clock, config):
    """
    游戏主循环

    参数:
        config: GameConfig 对象，包含玩家的所有设置
    """
    # 根据配置创建新的窗口
    window_width = config.window_width
    window_height = config.window_height
    grid_cols = config.grid_cols
    grid_rows = config.grid_rows
    wall_pass = config.wall_pass

    # 如果窗口尺寸变了，重新创建
    current_size = screen.get_size()
    if current_size != (window_width, window_height):
        screen = pygame.display.set_mode((window_width, window_height))

    # 加载字体
    font = load_chinese_font(28)
    big_font = load_chinese_font(60)

    # 重置游戏状态
    (snake_body, direction, next_dir, food_pos,
     score, speed, speed_increment,
     game_over, paused) = reset_game(config)

    running = True

    while running:
        # ========== 第1步：处理事件 ==========
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
                pygame.quit()
                sys.exit()

            if event.type == pygame.KEYDOWN:
                if game_over:
                    if event.key == pygame.K_r:
                        (snake_body, direction, next_dir, food_pos,
                         score, speed, speed_increment,
                         game_over, paused) = reset_game(config)
                    elif event.key == pygame.K_q:
                        running = False
                        pygame.quit()
                        sys.exit()
                    elif event.key == pygame.K_m:
                        # 按 M 键返回菜单
                        return "menu"
                    continue

                if event.key == pygame.K_p:
                    paused = not paused

                # 方向控制（不能原地掉头）
                if not paused and not game_over:
                    if event.key == pygame.K_UP and direction != DOWN:
                        next_dir = UP
                    elif event.key == pygame.K_DOWN and direction != UP:
                        next_dir = DOWN
                    elif event.key == pygame.K_LEFT and direction != RIGHT:
                        next_dir = LEFT
                    elif event.key == pygame.K_RIGHT and direction != LEFT:
                        next_dir = RIGHT

        # ========== 第2步：更新游戏状态 ==========
        if not game_over and not paused:
            direction = next_dir

            # 移动蛇
            snake_body, ate_food = move_snake(snake_body, direction, food_pos)

            # 穿墙模式：如果蛇头出界，从另一侧穿出
            if wall_pass:
                apply_wall_pass(snake_body, grid_cols, grid_rows)

            # 碰撞检测
            if check_collision(snake_body, grid_cols, grid_rows, wall_pass):
                game_over = True

            # 吃到食物
            if ate_food:
                score += 1
                speed += speed_increment
                food_pos = get_random_food_position(snake_body, grid_cols, grid_rows)

        # ========== 第3步：绘制画面 ==========
        screen.fill(BLACK)
        draw_grid(screen, grid_cols, grid_rows, window_width, window_height)
        draw_snake(screen, snake_body)
        draw_food(screen, food_pos)

        # 显示得分和状态信息
        score_text = font.render(f"得分: {score}", True, WHITE)
        screen.blit(score_text, (10, 10))

        # 显示当前速度档位
        speed_text = font.render(f"速度: {config.speed_name}", True, LIGHT_GRAY)
        screen.blit(speed_text, (10, 40))

        # 显示穿墙模式状态
        mode_text = font.render(f"穿墙: {'开' if wall_pass else '关'}", True,
                                GREEN if wall_pass else GRAY)
        screen.blit(mode_text, (10, 70))

        # 暂停画面
        if paused and not game_over:
            show_text(screen, "暂停中", big_font, WHITE,
                     window_width // 2, window_height // 2 - 20)
            show_text(screen, "按 P 继续", font, GRAY,
                     window_width // 2, window_height // 2 + 30)

        # 游戏结束画面
        if game_over:
            # 半透明遮罩
            overlay = pygame.Surface((window_width, window_height))
            overlay.set_alpha(128)
            overlay.fill(BLACK)
            screen.blit(overlay, (0, 0))

            show_text(screen, "游戏结束!", big_font, RED,
                     window_width // 2, window_height // 2 - 50)
            show_text(screen, f"最终得分: {score}", font, WHITE,
                     window_width // 2, window_height // 2 + 10)
            show_text(screen, "按 R 重新开始  |  按 M 返回菜单  |  按 Q 退出",
                     font, GRAY, window_width // 2, window_height // 2 + 60)

        # ========== 第4步：刷新画面 ==========
        pygame.display.flip()
        clock.tick(speed)


# =============================================
# 第十一步：程序入口
# =============================================

def main():
    """
    主函数 - 程序从这里开始

    【整体流程】
    1. 创建初始窗口
    2. 进入菜单循环 → 获得玩家配置
    3. 进入游戏循环 → 用配置运行游戏
    4. 游戏结束或按 M 键 → 回到菜单
    5. 玩家退出才真正结束
    """
    # 创建初始窗口（中等大小）
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

    # 主循环：菜单 ↔ 游戏 来回切换
    while True:
        # 阶段1：显示菜单，获取配置
        config = menu_loop(screen, clock)

        # 阶段2：用配置进入游戏
        result = game_loop(screen, clock, config)

        # 如果 game_loop 返回了，说明玩家按了 M 键或退出了
        if result is None:
            break


if __name__ == "__main__":
    main()
