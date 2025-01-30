import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface Prompt {
  id: number;
  title: string;
  content: string;
  category: string;
  usageCount?: number;
}

interface PromptCardProps {
  prompt: Prompt;
  onPromptUsed: (promptId: number) => void;
}

export const PromptCard = ({ prompt, onPromptUsed }: PromptCardProps) => {
  const [copied, setCopied] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userInput, setUserInput] = useState("");
  const { toast } = useToast();

  const copyToClipboard = async (customizedPrompt: string) => {
    try {
      await navigator.clipboard.writeText(customizedPrompt);
      setCopied(true);
      onPromptUsed(prompt.id);
      toast({
        title: "Copied to clipboard",
        description: "The customized prompt has been copied to your clipboard.",
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

  const handleCopyClick = () => {
    setIsDialogOpen(true);
  };

  const handleConfirm = () => {
    if (!userInput.trim()) {
      toast({
        title: "Input required",
        description: "Please enter your topic/goal.",
        variant: "destructive",
      });
      return;
    }

    const customizedPrompt = prompt.content.replace(/\[([^\]]+)\]/g, userInput.trim());
    copyToClipboard(customizedPrompt);
    setIsDialogOpen(false);
    setUserInput("");
  };

  return (
    <>
      <div className="glass-card prompt-card rounded-lg p-6 flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div>
            <span className="inline-block px-3 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-full mb-2">
              {prompt.category}
            </span>
            <h3 className="text-lg font-semibold">{prompt.title}</h3>
          </div>
          <button
            onClick={handleCopyClick}
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
        {prompt.usageCount !== undefined && (
          <div className="text-xs text-muted-foreground mt-2">
            Used {prompt.usageCount} times
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Customize your prompt</DialogTitle>
            <DialogDescription>
              Enter your topic/goal to customize this prompt
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Enter your topic/goal"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleConfirm}>
                Copy to Clipboard
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};