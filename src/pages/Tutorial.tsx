import Breadcrumb from "@/components/Breadcrumb";
import { tutorialChapters, gameSections } from "@/data/tutorialData";
import { BookOpen, Code2, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Tutorial() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Breadcrumb />

      <h1 className="text-3xl font-bold text-white mb-2">📚 代码构建讲解</h1>
      <p className="text-snake-text-muted leading-relaxed max-w-3xl mb-10">
        本教程将带你从零开始，使用 Python 和 Pygame 构建一个完整的贪吃蛇游戏。
        共分为 {tutorialChapters.length} 个章节，涵盖环境搭建、游戏框架设计、核心算法、
        游戏主循环以及功能扩展与优化，循序渐进地学习游戏开发的每个环节。
      </p>

      {/* 章节概览 */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <BookOpen className="w-5 h-5 text-snake-accent" />
          <h2 className="text-xl font-semibold text-white">章节概览</h2>
        </div>

        <div className="space-y-3">
          {gameSections.map((section) => {
            const chapter = tutorialChapters.find((ch) => ch.id === section.id);
            return (
              <Link
                key={section.id}
                to={`/tutorial/${section.id}`}
                className="block group"
              >
                <div className="bg-snake-surface border border-snake-border/60 rounded-xl p-5 hover:border-snake-accent/50 transition-all duration-200 hover:shadow-lg hover:shadow-snake-accent/5">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-white group-hover:text-snake-accent transition-colors">
                        {section.title}
                      </h3>
                      {chapter && (
                        <p className="text-sm text-snake-text-muted mt-1">
                          {chapter.description}
                        </p>
                      )}
                      {chapter && (
                        <p className="text-xs text-snake-text-muted/60 mt-2 flex items-center gap-1">
                          <Code2 className="w-3.5 h-3.5" />
                          共 {chapter.subsections.length} 个小节
                        </p>
                      )}
                    </div>
                    <ChevronRight className="w-5 h-5 text-snake-text-muted group-hover:text-snake-accent transition-colors flex-shrink-0 ml-4" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 学习路径 */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">学习路径</h2>
        <div className="bg-snake-surface border border-snake-border/60 rounded-xl p-6">
          <p className="text-snake-text-muted leading-relaxed">
            本教程按照从基础到进阶的顺序设计，建议按以下路径学习：
          </p>
          <div className="mt-5 space-y-4">
            {tutorialChapters.map((chapter, index) => (
              <div key={chapter.id} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-snake-accent/10 text-snake-accent text-xs font-medium flex items-center justify-center mt-0.5">
                  {index + 1}
                </span>
                <div>
                  <p className="text-white text-sm font-medium">{chapter.title}</p>
                  <p className="text-snake-text-muted text-xs mt-0.5">{chapter.description}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-snake-text-muted text-sm mt-5 pt-4 border-t border-snake-border/60">
            完成所有章节后，你将掌握使用 Pygame 开发游戏的完整流程，并具备进一步扩展和优化的能力。
          </p>
        </div>
      </section>
    </div>
  );
}
