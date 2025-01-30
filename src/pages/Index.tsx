import { useState } from "react";
import { CategoryFilter, Category } from "@/components/CategoryFilter";
import { PromptGrid } from "@/components/PromptGrid";
import { AddPromptForm } from "@/components/AddPromptForm";
import type { Prompt } from "@/components/PromptCard";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");
  const [prompts, setPrompts] = useState<Prompt[]>([
    {
      id: 1,
      title: "Professional Email Writer",
      content: "Write a professional email about [topic] that is concise, clear, and maintains a friendly yet formal tone.",
      category: "Career"
    },
    {
      id: 2,
      title: "Personalized Workout Plan",
      content: "Create a detailed 4-week workout plan for [goal] with progressive overload, considering my fitness level [level] and available equipment [equipment].",
      category: "Gym Plan"
    },
    {
      id: 3,
      title: "Content Virality Strategy",
      content: "Analyze [content piece] and provide specific strategies to increase its viral potential across social media platforms.",
      category: "Growth Hack"
    }
  ]);

  const handleAddPrompt = (newPrompt: { title: string; content: string; category: Category }) => {
    setPrompts([
      ...prompts,
      {
        id: prompts.length + 1,
        ...newPrompt,
      },
    ]);
  };

  return (
    <div className="container py-12 min-h-screen">
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-4xl font-bold mb-4">Viral ChatGPT Prompts</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover and share powerful ChatGPT prompts that deliver exceptional results.
          Filter by category or add your own prompts to the collection.
        </p>
      </div>

      <AddPromptForm onSubmit={handleAddPrompt} />
      
      <CategoryFilter
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      
      <PromptGrid
        prompts={prompts}
        category={selectedCategory}
      />
    </div>
  );
};

export default Index;