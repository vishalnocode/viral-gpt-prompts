import { PromptCard, Prompt } from "./PromptCard";
import { Category } from "./CategoryFilter";

interface PromptGridProps {
  prompts: Prompt[];
  category: Category;
  onPromptUsed: (promptId: number) => void;
}

export const PromptGrid = ({ prompts, category, onPromptUsed }: PromptGridProps) => {
  const filteredPrompts = category === "All" 
    ? prompts 
    : prompts.filter(prompt => prompt.category === category);

  // Sort prompts by usage count for the selected category
  const sortedPrompts = [...filteredPrompts].sort((a, b) => 
    (b.usageCount || 0) - (a.usageCount || 0)
  );

  // Get the most used prompts (top 3)
  const mostUsedPrompts = sortedPrompts.slice(0, 3);
  // Get the remaining prompts
  const remainingPrompts = sortedPrompts.slice(3);

  return (
    <div className="space-y-8 animate-fade-in">
      {mostUsedPrompts.length > 0 && category !== "All" && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Most Used {category} Prompts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mostUsedPrompts.map((prompt) => (
              <PromptCard 
                key={prompt.id} 
                prompt={prompt} 
                onPromptUsed={onPromptUsed}
              />
            ))}
          </div>
        </div>
      )}

      <div>
        {category !== "All" && <h2 className="text-xl font-semibold mb-4">All {category} Prompts</h2>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {remainingPrompts.map((prompt) => (
            <PromptCard 
              key={prompt.id} 
              prompt={prompt} 
              onPromptUsed={onPromptUsed}
            />
          ))}
        </div>
      </div>
    </div>
  );
};