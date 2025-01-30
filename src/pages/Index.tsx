import { useState, useMemo } from "react";
import { CategoryFilter, Category } from "@/components/CategoryFilter";
import { PromptGrid } from "@/components/PromptGrid";
import { AddPromptForm } from "@/components/AddPromptForm";
import type { Prompt } from "@/components/PromptCard";
import { useToast } from "@/components/ui/use-toast";
import promptData from "@/data/prompts.json";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");
  const [isAdmin] = useState(false);
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>(promptData.categories);
  const [prompts, setPrompts] = useState<Prompt[]>(promptData.prompts);

  // Filter prompts based on selected category and featured status
  const filteredPrompts = useMemo(() => {
    const categoryPrompts = selectedCategory === "All"
      ? prompts
      : prompts.filter(prompt => prompt.category === selectedCategory);

    return {
      all: categoryPrompts,
      featured: categoryPrompts.filter(prompt => prompt.isFeatured)
    };
  }, [prompts, selectedCategory]);

  const handleAddPrompt = (newPrompt: { title: string; content: string; category: Category }) => {
    setPrompts([
      ...prompts,
      {
        id: prompts.length + 1,
        ...newPrompt,
        placeholders: extractPlaceholders(newPrompt.content)
      },
    ]);
  };

  const extractPlaceholders = (content: string): string[] => {
    const matches = content.match(/\[(.*?)\]/g) || [];
    return matches.map(match => match.slice(1, -1));
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

      {/* Featured Prompts Section */}
      {filteredPrompts.featured.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">
            Featured {selectedCategory !== "All" ? selectedCategory : ""} Prompts
          </h2>
          <PromptGrid prompts={filteredPrompts.featured} />
        </div>
      )}

      {/* All Prompts Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">
          {selectedCategory === "All" ? "All Prompts" : `All ${selectedCategory} Prompts`}
        </h2>
        <PromptGrid prompts={filteredPrompts.all} />
      </div>
    </div>
  );
};

export default Index;