import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { getChapter } from "@/data/tutorialData";
import { gameSections } from "@/data/tutorialData";
import { cn } from "@/lib/utils";

export default function Breadcrumb() {
  const location = useLocation();
  const pathParts = location.pathname.split("/").filter(Boolean);

  if (pathParts.length === 0) return null;

  const items: { label: string; to: string }[] = [{ label: "首页", to: "/" }];

  if (pathParts[0] === "game") {
    items.push({ label: "游戏演示", to: "/game" });
  } else if (pathParts[0] === "tutorial") {
    items.push({ label: "代码讲解", to: "/tutorial" });
    if (pathParts[1]) {
      const chapter = getChapter(pathParts[1]);
      if (chapter) {
        items.push({ label: chapter.title, to: `/tutorial/${pathParts[1]}` });
      }
      if (pathParts[2] && chapter) {
        const sub = chapter.subsections.find(s => s.id === pathParts[2]);
        if (sub) {
          items.push({ label: sub.title, to: `/tutorial/${pathParts[1]}/${pathParts[2]}` });
        }
      }
    }
  }

  return (
    <nav className="flex items-center gap-1.5 text-sm text-snake-text-muted mb-6 overflow-x-auto">
      {items.map((item, index) => (
        <div key={item.to} className="flex items-center gap-1.5">
          {index > 0 && <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />}
          {index === items.length - 1 ? (
            <span className="text-white font-medium whitespace-nowrap">
              {index === 0 && <Home className="w-3.5 h-3.5 inline mr-1" />}
              {item.label}
            </span>
          ) : (
            <Link
              to={item.to}
              className={cn(
                "hover:text-white transition-colors whitespace-nowrap",
                index === 0 && "flex items-center gap-1"
              )}
            >
              {index === 0 && <Home className="w-3.5 h-3.5" />}
              {index > 0 && item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
