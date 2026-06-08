import { useParams, Link } from "react-router-dom";
import Breadcrumb from "@/components/Breadcrumb";
import CodeBlock from "@/components/CodeBlock";
import {
  getChapter,
  getSubsection,
  getNextSubsection,
  getPrevSubsection,
  gameSections,
} from "@/data/tutorialData";
import { ChevronLeft, ChevronRight, List, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export default function TutorialSection() {
  const { section, subsection } = useParams<{
    section: string;
    subsection: string;
  }>();

  const chapter = section ? getChapter(section) : undefined;
  const sub =
    section && subsection ? getSubsection(section, subsection) : undefined;

  const isChapterView = section && !subsection;
  const isSubsectionView = section && subsection && chapter && sub;

  const next =
    isSubsectionView && sub
      ? getNextSubsection(section!, subsection!)
      : null;
  const prev =
    isSubsectionView && sub
      ? getPrevSubsection(section!, subsection!)
      : null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex gap-8">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-8">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-4 h-4 text-snake-accent" />
              <span className="text-sm font-semibold text-white">目录</span>
            </div>
            <nav className="space-y-1">
              {gameSections.map((gSec) => {
                const ch = getChapter(gSec.id);
                const isActive = section === gSec.id;
                return (
                  <div key={gSec.id}>
                    <Link
                      to={`/tutorial/${gSec.id}`}
                      className={cn(
                        "block px-3 py-2 text-sm rounded-lg transition-colors",
                        isActive
                          ? "bg-snake-accent/10 text-snake-accent font-medium"
                          : "text-snake-text-muted hover:text-white hover:bg-white/5"
                      )}
                    >
                      {ch?.title || gSec.title}
                    </Link>
                    {isActive && (
                      <div className="ml-3 mt-1 space-y-0.5 border-l border-snake-border/40">
                        {gSec.subs.map((subId) => {
                          const subData = ch?.subsections.find(
                            (s) => s.id === subId
                          );
                          const isSubActive = subsection === subId;
                          return (
                            <Link
                              key={subId}
                              to={`/tutorial/${gSec.id}/${subId}`}
                              className={cn(
                                "block pl-4 pr-2 py-1.5 text-xs rounded-r-lg transition-colors",
                                isSubActive
                                  ? "bg-snake-accent/10 text-snake-accent border-l-2 border-snake-accent"
                                  : "text-snake-text-muted hover:text-white border-l-2 border-transparent"
                              )}
                            >
                              {subData?.title || subId}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <Breadcrumb />

          {chapter && isChapterView && (
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">
                {chapter.title}
              </h1>
              <p className="text-snake-text-muted mb-6">
                {chapter.description}
              </p>
              <div className="grid gap-4">
                {chapter.subsections.map((s, idx) => (
                  <Link
                    key={s.id}
                    to={`/tutorial/${section}/${s.id}`}
                    className="block p-4 rounded-xl border border-snake-border/60 bg-snake-surface hover:border-snake-accent/50 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-snake-accent/10 text-snake-accent text-sm font-bold flex-shrink-0">
                        {idx + 1}
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-sm font-medium text-white group-hover:text-snake-accent transition-colors">
                          {s.title}
                        </h3>
                        {s.explanation && (
                          <p className="text-xs text-snake-text-muted mt-0.5 line-clamp-1">
                            {s.explanation
                              .replace(/<[^>]*>/g, "")
                              .trim()
                              .substring(0, 100)}
                          </p>
                        )}
                      </div>
                      <ChevronRight className="w-4 h-4 text-snake-text-muted flex-shrink-0 ml-auto" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {isSubsectionView && chapter && sub && (
            <div>
              <h1 className="text-2xl font-bold text-white mb-6">
                {sub.title}
              </h1>
              <CodeBlock
                title={sub.title}
                code={sub.code}
                language={sub.codeLanguage}
                explanation={sub.explanation}
                techNotes={sub.techNotes}
                algorithmFlow={sub.algorithmFlow}
                commonIssues={sub.commonIssues}
                tips={sub.tips}
              />

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-snake-border/30">
                {prev ? (
                  <Link
                    to={`/tutorial/${prev.chapterId}/${prev.subsectionId}`}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-snake-surface border border-snake-border/60 text-snake-text-muted hover:text-white hover:border-snake-accent/50 transition-all group"
                  >
                    <ChevronLeft className="w-4 h-4 group-hover:text-snake-accent transition-colors flex-shrink-0" />
                    <div className="text-right">
                      <div className="text-xs text-snake-text-muted">
                        上一节
                      </div>
                      <div className="text-sm font-medium text-white group-hover:text-snake-accent transition-colors">
                        {getSubsection(prev.chapterId, prev.subsectionId)
                          ?.title || "上一节"}
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div />
                )}
                {next ? (
                  <Link
                    to={`/tutorial/${next.chapterId}/${next.subsectionId}`}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-snake-surface border border-snake-border/60 text-snake-text-muted hover:text-white hover:border-snake-accent/50 transition-all group"
                  >
                    <div>
                      <div className="text-xs text-snake-text-muted text-right">
                        下一节
                      </div>
                      <div className="text-sm font-medium text-white group-hover:text-snake-accent transition-colors">
                        {getSubsection(next.chapterId, next.subsectionId)
                          ?.title || "下一节"}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 group-hover:text-snake-accent transition-colors flex-shrink-0" />
                  </Link>
                ) : (
                  <div />
                )}
              </div>
            </div>
          )}

          {!chapter && (
            <div className="text-center py-20">
              <List className="w-16 h-16 text-snake-text-muted/30 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">
                章节未找到
              </h2>
              <p className="text-snake-text-muted mb-6">
                请选择一个有效的教程章节。
              </p>
              <Link
                to="/tutorial"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-snake-accent/10 text-snake-accent hover:bg-snake-accent/20 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                返回教程首页
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
