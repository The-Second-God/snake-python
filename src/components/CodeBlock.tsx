import { useEffect, useRef, useState, useMemo } from "react";
import { marked } from "marked";
import Prism from "prismjs";
import "prismjs/components/prism-python";
import CopyButton from "./CopyButton";
import { ChevronDown, ChevronRight, AlertCircle, Lightbulb, FileCode } from "lucide-react";

interface TutorialIssue {
  problem: string;
  solution: string;
}

interface CodeBlockProps {
  title: string;
  code: string;
  language?: string;
  explanation?: string;
  techNotes?: string;
  algorithmFlow?: string;
  commonIssues?: TutorialIssue[];
  tips?: string[];
  defaultCollapsed?: boolean;
}

export default function CodeBlock({
  title,
  code,
  language = "python",
  explanation,
  techNotes,
  algorithmFlow,
  commonIssues,
  tips,
  defaultCollapsed = false,
}: CodeBlockProps) {
  const codeRef = useRef<HTMLElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [showFlow, setShowFlow] = useState(false);

  const renderedExplanation = useMemo(() => {
    if (!explanation) return "";
    return marked.parse(explanation, { breaks: true });
  }, [explanation]);

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [code]);

  return (
    <div className="rounded-xl border border-snake-border/60 bg-snake-surface overflow-hidden transition-all duration-200 hover:border-snake-border">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-snake-bg/50 border-b border-snake-border/30">
        <div className="flex items-center gap-2 min-w-0">
          <FileCode className="w-4 h-4 text-snake-accent flex-shrink-0" />
          <span className="text-sm font-medium text-white truncate">{title}</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-snake-accent/10 text-snake-accent font-mono uppercase flex-shrink-0">
            {language}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <CopyButton code={code} />
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-md text-snake-text-muted hover:text-white hover:bg-white/5 transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Code */}
      {!collapsed && (
        <div className="relative">
          <pre ref={preRef} className="!m-0 !rounded-none !bg-snake-code !p-4 !text-sm">
            <code ref={codeRef} className={`language-${language}`}>
              {code}
            </code>
          </pre>
        </div>
      )}

      {/* Explanation (Markdown rendered) */}
      {renderedExplanation && (
        <div className="px-4 py-4 border-t border-snake-border/30">
          <div className="prose prose-invert prose-sm max-w-none">
            <div className="markdown-content" dangerouslySetInnerHTML={{ __html: renderedExplanation }} />
          </div>
        </div>
      )}

      {/* Tech Notes */}
      {techNotes && (
        <div className="px-4 py-3 bg-blue-500/5 border-t border-snake-border/30">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-xs font-semibold text-blue-400">技术说明</span>
              <p className="text-sm text-snake-text-muted mt-0.5">{techNotes}</p>
            </div>
          </div>
        </div>
      )}

      {/* Algorithm Flow */}
      {algorithmFlow && (
        <div className="px-4 py-3 border-t border-snake-border/30">
          <button
            onClick={() => setShowFlow(!showFlow)}
            className="flex items-center gap-2 text-sm text-snake-accent hover:text-snake-accent-dark transition-colors"
          >
            {showFlow ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            算法流程图
          </button>
          {showFlow && (
            <div className="mt-3 p-4 bg-snake-bg/50 rounded-lg">
              <div className="text-sm text-snake-text-muted leading-relaxed whitespace-pre-wrap font-mono">
                {algorithmFlow}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Common Issues */}
      {commonIssues && commonIssues.length > 0 && (
        <div className="px-4 py-3 bg-red-500/5 border-t border-snake-border/30">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span className="text-xs font-semibold text-red-400">常见问题</span>
          </div>
          <div className="space-y-2">
            {commonIssues.map((issue, idx) => (
              <div key={idx} className="text-sm">
                <span className="text-red-300">❌ {issue.problem}</span>
                <br />
                <span className="text-green-300">✅ {issue.solution}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      {tips && tips.length > 0 && (
        <div className="px-4 py-3 bg-yellow-500/5 border-t border-snake-border/30">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-yellow-400" />
            <span className="text-xs font-semibold text-yellow-400">优化技巧</span>
          </div>
          <ul className="space-y-1">
            {tips.map((tip, idx) => (
              <li key={idx} className="text-sm text-snake-text-muted flex items-start gap-2">
                <span className="text-yellow-400 mt-0.5">💡</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
