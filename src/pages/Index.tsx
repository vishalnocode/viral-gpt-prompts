import { useState } from "react";
import { CategoryFilter, Category } from "@/components/CategoryFilter";
import { PromptGrid } from "@/components/PromptGrid";
import { AddPromptForm } from "@/components/AddPromptForm";
import type { Prompt } from "@/components/PromptCard";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");
  const [isAdmin] = useState(false);
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>(["All", "Career", "Gym Plan", "Growth Hack", "Productivity"]);
  const [prompts, setPrompts] = useState<Prompt[]>([
    {
      id: 1,
      title: "Professional Email Writer",
      content: "Write a professional email about [topic] that is concise, clear, and maintains a friendly yet formal tone.",
      category: "Career",
      usageCount: 0
    },
    {
      id: 2,
      title: "Personalized Workout Plan",
      content: "Create a detailed 4-week workout plan for [goal] with progressive overload, considering my fitness level [level] and available equipment [equipment].",
      category: "Gym Plan",
      usageCount: 0
    },
    {
      id: 3,
      title: "Content Virality Strategy",
      content: "Analyze [content piece] and provide specific strategies to increase its viral potential across social media platforms.",
      category: "Growth Hack",
      usageCount: 0
    }
  ]);

  const handleAddPrompt = (newPrompt: { title: string; content: string; category: Category }) => {
    setPrompts([
      ...prompts,
      {
        id: prompts.length + 1,
        ...newPrompt,
        usageCount: 0
      },
    ]);
  };

  const handleAddCategory = (newCategory: string) => {
    if (categories.includes(newCategory)) {
      toast({
        title: "Category exists",
        description: "This category already exists.",
        variant: "destructive",
      });
      return;
    }
    setCategories([...categories, newCategory]);
    toast({
      title: "Category added",
      description: "New category has been added successfully.",
    });
  };

  const handlePromptUsed = (promptId: number) => {
    setPrompts(prompts.map(prompt => 
      prompt.id === promptId 
        ? { ...prompt, usageCount: (prompt.usageCount || 0) + 1 }
        : prompt
    ));
  };

  return (
    <div className="container py-12 min-h-screen">
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-4xl font-bold mb-4">Viral ChatGPT Prompts</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover and share powerful ChatGPT prompts that deliver exceptional results.
          Filter by category to find the perfect prompt for your needs.
        </p>
      </div>

      {isAdmin && <AddPromptForm onSubmit={handleAddPrompt} />}
      
      <CategoryFilter
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={categories}
        isAdmin={isAdmin}
        onAddCategory={handleAddCategory}
      />
      
      <PromptGrid
        prompts={prompts}
        category={selectedCategory}
        onPromptUsed={handlePromptUsed}
      />
    </div>
  );
};

export default Index;