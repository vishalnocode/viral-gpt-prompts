import { useState } from "react";
import { Copy } from "lucide-react";
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
  prompt: Prompt;
  onPromptUsed?: (id: number) => void;
}

export const PromptCard = ({ prompt, onPromptUsed }: PromptCardProps) => {
  const [placeholderValues, setPlaceholderValues] = useState<Record<string, string>>({});
  const [finalPrompt, setFinalPrompt] = useState(prompt.content);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAI, setSelectedAI] = useState('chatgpt');
  const { toast } = useToast();

  const aiTools = {
    chatgpt: 'https://chat.openai.com',
    claude: 'https://claude.ai',
    perplexity: 'https://perplexity.ai/search'
  };

  const handlePlaceholderChange = (placeholder: string, value: string) => {
    const newValues = { ...placeholderValues, [placeholder]: value };
    setPlaceholderValues(newValues);
    
    let updatedPrompt = prompt.content;
    Object.entries(newValues).forEach(([key, value]) => {
      updatedPrompt = updatedPrompt.replace(`[${key}]`, value);
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

  return (
    <div className="border rounded-lg p-6 space-y-4">
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-semibold">{prompt.title}</h3>
        <button
          onClick={() => setIsDialogOpen(true)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <Copy className="h-5 w-5 text-gray-600" />
        </button>
      </div>
      <p className="text-gray-600">{prompt.content}</p>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{prompt.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {prompt.placeholders.map((placeholder) => (
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
            <div className="pt-4">
              <p className="font-medium mb-2">Final Prompt:</p>
              <p className="text-gray-600 bg-gray-50 p-3 rounded">{finalPrompt}</p>
            </div>
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
                  className="flex-1 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 flex items-center justify-center gap-2"
                >
                  Open in {selectedAI}
                </button>
              </div>
              <button
                onClick={copyToClipboard}
                className="w-full px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 flex items-center justify-center gap-2"
              >
                <Copy className="h-4 w-4" /> Copy Prompt
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};