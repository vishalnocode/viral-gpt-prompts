import { PromptCard, Prompt } from "./PromptCard";
import { Category } from "./CategoryFilter";

interface PromptGridProps {
  prompts: Prompt[];
  category: Category;
}

export const PromptGrid = ({ prompts, category }: PromptGridProps) => {
  const filteredPrompts = category === "All" 
    ? prompts 
    : prompts.filter(prompt => prompt.category === category);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
      {filteredPrompts.map((prompt) => (
        <PromptCard key={prompt.id} prompt={prompt} />
      ))}
    </div>
  );
};