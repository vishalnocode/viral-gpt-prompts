import { PromptCard, Prompt } from "./PromptCard";
import { Category } from "./CategoryFilter";

interface PromptGridProps {
  prompts: Prompt[];
  category: Category;
  onPromptUsed: (promptId: number) => void;
}

interface PromptGridProps {
  prompts: Prompt[];
  onPromptUsed?: (id: number) => void;
}

export const PromptGrid = ({ prompts, onPromptUsed }: PromptGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {prompts.map((prompt) => (
        <PromptCard 
          key={prompt.id} 
          prompt={prompt} 
          onPromptUsed={onPromptUsed}
        />
      ))}
    </div>
  );
};