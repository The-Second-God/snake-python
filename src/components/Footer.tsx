import { Github, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-snake-border/50 bg-snake-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🐍</span>
              <span className="font-bold text-lg text-white">Python贪吃蛇教学</span>
            </div>
            <p className="text-sm text-snake-text-muted leading-relaxed">
              通过一个完整的贪吃蛇游戏开发案例，系统化学习Python游戏编程。
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-3">快速导航</h3>
            <ul className="space-y-2 text-sm text-snake-text-muted">
              <li><a href="/" className="hover:text-snake-accent transition-colors">首页</a></li>
              <li><a href="/game" className="hover:text-snake-accent transition-colors">游戏演示</a></li>
              <li><a href="/tutorial" className="hover:text-snake-accent transition-colors">代码讲解</a></li>
            </ul>
          </div>

          {/* Tutorial Links */}
          <div>
            <h3 className="font-semibold text-white mb-3">教程章节</h3>
            <ul className="space-y-2 text-sm text-snake-text-muted">
              <li><a href="/tutorial/environment" className="hover:text-snake-accent transition-colors">环境搭建</a></li>
              <li><a href="/tutorial/game-framework" className="hover:text-snake-accent transition-colors">游戏框架</a></li>
              <li><a href="/tutorial/game-logic" className="hover:text-snake-accent transition-colors">游戏逻辑</a></li>
              <li><a href="/tutorial/game-loop" className="hover:text-snake-accent transition-colors">游戏主循环</a></li>
              <li><a href="/tutorial/advanced" className="hover:text-snake-accent transition-colors">功能扩展与优化</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-snake-border/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-snake-text-muted">
            &copy; {new Date().getFullYear()} Python贪吃蛇教学项目. 仅供学习使用.
          </p>
          <p className="text-xs text-snake-text-muted flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-400 fill-red-400" /> for Python learners
          </p>
        </div>
      </div>
    </footer>
  );
}
