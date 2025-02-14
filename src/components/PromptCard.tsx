import { useState, useEffect } from "react";
import { Clipboard, Play } from "lucide-react";
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

export type Prompt = {
  id: number;
  title: string;
  content: string;
  category: Category;
  placeholders: string[];
  isFeatured: boolean;
};

interface PromptCardProps {
  prompt: {
    id: string;
    title: string;
    description: string;
    prompt: string;
    category: string;
    subcategory: string;
    isFeatured: boolean;
    placeholders?: string[];
  };
  onPromptUsed?: (id: string) => void;
  hidePrompt?: boolean;
  showDescription?: boolean;
}

export const PromptCard = ({ 
  prompt, 
  onPromptUsed, 
  hidePrompt = false,
  showDescription = false 
}: PromptCardProps) => {
  const [placeholderValues, setPlaceholderValues] = useState<Record<string, string>>({});
  const [finalPrompt, setFinalPrompt] = useState(prompt.prompt);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAI, setSelectedAI] = useState('chatgpt');
  const { toast } = useToast();

  const aiTools = {
    chatgpt: 'https://chat.openai.com',
    claude: 'https://claude.ai',
    perplexity: 'https://perplexity.ai/search'
  };

  const hasPlaceholders = prompt.placeholders && prompt.placeholders.length > 0;

  const handlePlaceholderChange = (placeholder: string, value: string) => {
    const newValues = { ...placeholderValues, [placeholder]: value };
    setPlaceholderValues(newValues);
    
    let updatedPrompt = prompt.prompt;
    Object.entries(newValues).forEach(([key, value]) => {
      if (value.trim()) {
        updatedPrompt = updatedPrompt.replace(`[${key}]`, value);
      }
    });
    setFinalPrompt(updatedPrompt);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(finalPrompt);
    setIsDialogOpen(false);
    onPromptUsed?.(prompt.id);
    toast({
      title: "Copied to clipboard",
      description: "The customized prompt has been copied to your clipboard.",
    });
  };

  const openInAITool = () => {
    const baseUrl = aiTools[selectedAI]
    let url = '';
    switch (selectedAI) {
      case 'chatgpt':
        url = `${baseUrl}?prompt=${encodeURIComponent(finalPrompt)}`;
        break;
      case 'claude':
        url = `${baseUrl}?q=${encodeURIComponent(finalPrompt)}`;
        break;
      case 'perplexity':
        url = `${baseUrl}?q=${encodeURIComponent(finalPrompt)}`;
        break;
      default:
        url = `${baseUrl}?q=${encodeURIComponent(finalPrompt)}`;
    }
    window.open(url, '_blank');
    setIsDialogOpen(false);
    onPromptUsed?.(prompt.id);
  };

  const handleRunDirectly = () => {
    const url = `${aiTools.chatgpt}?prompt=${encodeURIComponent(prompt.prompt)}`;
    window.open(url, '_blank');
    onPromptUsed?.(prompt.id);
  };

  const areAllPlaceholdersFilled = () => {
    if (!prompt.placeholders || prompt.placeholders.length === 0) return true;
    return prompt.placeholders.every(placeholder => 
      placeholderValues[placeholder] && placeholderValues[placeholder].trim() !== ''
    );
  };

  return (
    <div className="border rounded-lg p-6 space-y-4 bg-black text-white">
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-semibold">{prompt.title}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setIsDialogOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Clipboard className="h-5 w-5 text-blue-500" />
          </button>
          {!hasPlaceholders && (
            <button
              onClick={handleRunDirectly}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Play className="h-5 w-5 text-blue-500" />
            </button>
          )}
        </div>
      </div>
      {showDescription && (
        <p className="text-gray-400">{prompt.description}</p>
      )}
      {!hidePrompt && (
        <p className="text-gray-400">{prompt.prompt}</p>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="rounded-xl sm:rounded-2xl h-[100dvh] sm:h-auto sm:max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>{prompt.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 overflow-y-auto max-h-[calc(100dvh-8rem)] sm:max-h-[60vh] pr-2">
            <div className="space-y-2">
              <p className="font-medium">Final Prompt:</p>
              <p className="text-gray-600 bg-white p-3 rounded border">{finalPrompt}</p>
            </div>
            
            {(prompt.placeholders || []).map((placeholder) => (
              <div key={placeholder} className="space-y-2">
                <label className="text-sm text-gray-600">
                  {placeholder.charAt(0).toUpperCase() + placeholder.slice(1)}:
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  placeholder={`Enter ${placeholder}`}
                  onChange={(e) => handlePlaceholderChange(placeholder, e.target.value)}
                />
              </div>
            ))}

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <select 
                  value={selectedAI}
                  onChange={(e) => setSelectedAI(e.target.value)}
                  className="px-3 py-2 border rounded-md bg-white"
                >
                  <option value="chatgpt">ChatGPT</option>
                  <option value="claude">Claude</option>
                  <option value="perplexity">Perplexity</option>
                </select>
                <button
                  onClick={openInAITool}
                  disabled={!areAllPlaceholdersFilled()}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Play className="h-4 w-4" /> Run the prompt
                </button>
              </div>
            </div>
            
            <button
              onClick={copyToClipboard}
              disabled={!areAllPlaceholdersFilled()}
              className="w-full px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Clipboard className="h-5 w-5 shrink-0" /> Copy Prompt
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};