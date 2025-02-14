import { PromptCard, Prompt } from "./PromptCard";
import { Category } from "./CategoryFilter";

interface PromptGridProps {
  prompts: Prompt[];
  hidePrompt?: boolean;
  showDescription?: boolean;
  selectedPrompt?: Prompt | null;
  onPromptClick?: (prompt: Prompt) => void;
  onPromptUsed?: (id: number) => void;
}

export const PromptGrid = ({ 
  prompts, 
  hidePrompt = false,
  showDescription = false,
  selectedPrompt,
  onPromptClick,
  onPromptUsed 
}: PromptGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {prompts.map((prompt) => (
        <PromptCard 
          key={prompt.id} 
          prompt={prompt}
          hidePrompt={hidePrompt}
          showDescription={showDescription}
          isSelected={selectedPrompt?.id === prompt.id}
          onClick={() => onPromptClick?.(prompt)}
          onPromptUsed={onPromptUsed}
        />
      ))}
    </div>
  );
};