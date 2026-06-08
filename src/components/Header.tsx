import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Gamepad2, BookOpen, Home, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { gameSections } from "@/data/tutorialData";

const navLinks = [
  { to: "/", label: "首页", icon: Home },
  { to: "/game", label: "游戏演示", icon: Gamepad2 },
  { to: "/tutorial", label: "代码讲解", icon: BookOpen },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-snake-bg/80 backdrop-blur-xl border-b border-snake-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl">🐍</span>
            <span className="font-bold text-lg text-white group-hover:text-snake-accent transition-colors">
              Python贪吃蛇
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              const isTutorial = link.to === "/tutorial";

              if (isTutorial) {
                return (
                  <div
                    key={link.to}
                    className="relative"
                    onMouseEnter={() => setTutorialOpen(true)}
                    onMouseLeave={() => setTutorialOpen(false)}
                  >
                    <Link
                      to={link.to}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                        isActive
                          ? "text-snake-accent bg-snake-accent/10"
                          : "text-snake-text-muted hover:text-white hover:bg-white/5"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      代码讲解
                      <ChevronDown className={cn("w-3 h-3 transition-transform", tutorialOpen && "rotate-180")} />
                    </Link>
                    {/* Dropdown */}
                    {tutorialOpen && (
                      <div className="absolute top-full left-0 mt-1 w-64 bg-snake-surface border border-snake-border rounded-xl shadow-2xl overflow-hidden">
                        <div className="p-2">
                          {gameSections.map((section) => (
                            <Link
                              key={section.id}
                              to={`/tutorial/${section.id}`}
                              className="block px-3 py-2 rounded-lg text-sm text-snake-text-muted hover:text-white hover:bg-white/5 transition-colors"
                              onClick={() => setTutorialOpen(false)}
                            >
                              {section.title}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "text-snake-accent bg-snake-accent/10"
                      : "text-snake-text-muted hover:text-white hover:bg-white/5"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-snake-text-muted hover:text-white hover:bg-white/5 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-snake-border/50 bg-snake-bg/95 backdrop-blur-xl">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "text-snake-accent bg-snake-accent/10"
                      : "text-snake-text-muted hover:text-white hover:bg-white/5"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
            {/* Mobile tutorial sublinks */}
            <div className="pl-10 space-y-1">
              {gameSections.map((section) => (
                <Link
                  key={section.id}
                  to={`/tutorial/${section.id}`}
                  className="block px-3 py-1.5 text-xs text-snake-text-muted hover:text-white transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {section.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
