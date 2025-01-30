import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export interface Prompt {
  id: number;
  title: string;
  content: string;
  category: string;
}

interface PromptCardProps {
  prompt: Prompt;
}

export const PromptCard = ({ prompt }: PromptCardProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(prompt.content);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "The prompt has been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="glass-card prompt-card rounded-lg p-6 flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div>
          <span className="inline-block px-3 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-full mb-2">
            {prompt.category}
          </span>
          <h3 className="text-lg font-semibold">{prompt.title}</h3>
        </div>
        <button
          onClick={copyToClipboard}
          className="p-2 hover:bg-secondary rounded-full transition-colors"
          aria-label="Copy prompt"
        >
          {copied ? (
            <Check className="w-5 h-5 text-green-500" />
          ) : (
            <Copy className="w-5 h-5 text-primary" />
          )}
        </button>
      </div>
      <p className="text-muted-foreground text-sm line-clamp-3">{prompt.content}</p>
    </div>
  );
};