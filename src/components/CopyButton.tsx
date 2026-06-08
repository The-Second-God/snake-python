import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  code: string;
  className?: string;
}

export default function CopyButton({ code, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = code;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200",
        copied
          ? "bg-snake-accent/20 text-snake-accent"
          : "bg-white/5 text-snake-text-muted hover:bg-white/10 hover:text-white",
        className
      )}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5" />
          已复制
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" />
          复制代码
        </>
      )}
    </button>
  );
}
