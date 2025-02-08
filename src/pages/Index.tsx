import { useState, useMemo, useEffect } from "react";
import { CategoryFilter, Category } from "@/components/CategoryFilter";
import { PromptGrid } from "@/components/PromptGrid";
import { AddPromptForm } from "@/components/AddPromptForm";
import type { Prompt } from "@/components/PromptCard";
import { useToast } from "@/components/ui/use-toast";
import promptData from "@/data/prompts.json";
import { Button } from "@/components/ui/button";
import useEmblaCarousel from 'embla-carousel-react';
import { PromptCard } from "@/components/PromptCard";
import { PlusCircle, Search, Copy, Play } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

// Update type definitions
type Category = string;
type Subcategory = string;
type CategoryData = {
  name: Category;
  subcategories: Subcategory[];
};
const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdmin] = useState(false);
  const { toast } = useToast();
  const [categories] = useState<CategoryData[]>(promptData.categories);
  const [prompts] = useState(promptData.prompts);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: 'start',
    loop: true,
    skipSnaps: false,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on('select', () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    });
  }, [emblaApi]);

  // Get subcategories for current category
  const availableSubcategories = useMemo(() => {
    if (selectedCategory === "All") {
      return ["All"];
    }
    const category = categories.find(cat => cat.name === selectedCategory);
    return category ? ["All", ...category.subcategories] : ["All"];
  }, [selectedCategory, categories]);

  // Update filtering logic
  const filteredPrompts = useMemo(() => {
    // First filter by search query
    let filtered = searchQuery
      ? prompts.filter(prompt => 
          (prompt.title?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
          (prompt.content?.toLowerCase().includes(searchQuery.toLowerCase()) || false)
        )
      : prompts;

    // Then filter by category
    filtered = selectedCategory === "All"
      ? filtered
      : filtered.filter(prompt => prompt.category === selectedCategory);

    // Featured prompts should only be filtered by category and search, not subcategory
    const featured = filtered.filter(prompt => prompt.isFeatured).slice(0, 3);

    // Apply subcategory filter only to the main list
    if (selectedSubcategory !== "All") {
      filtered = filtered.filter(prompt => prompt.subcategory === selectedSubcategory);
    }

    return {
      all: filtered,
      featured: featured
    };
  }, [prompts, selectedCategory, selectedSubcategory, searchQuery]);

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

  return (
    <div className="container py-12 min-h-screen">
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-4xl font-bold mb-4">Viral ChatGPT Prompts</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover and share powerful ChatGPT prompts that deliver exceptional results.
          Filter by category to find the perfect prompt for your needs.
        </p>
        
        {/* Search input with icon and dropdown */}
        <div className="mt-6 mb-8 text-center">
          <div className="relative w-full max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Search prompts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-10 py-2 rounded-md border border-input bg-background"
            />
            
            {/* Dropdown for search results */}
            {searchQuery && (
              <div className="absolute left-0 right-0 mt-1 bg-black border border-gray-800 rounded-md shadow-lg z-10">
                <div className="p-2">
                  {filteredPrompts.all.length > 0 ? (
                    <button
                      onClick={() => {
                        setIsDialogOpen(true);
                        setSelectedPrompt(filteredPrompts.all[0]);
                      }}
                      className="w-full text-left hover:bg-gray-800 rounded-md p-2 transition-colors"
                    >
                      <span className="text-base font-medium text-white">{filteredPrompts.all[0].title}</span>
                    </button>
                  ) : (
                    <div className="text-center py-2">
                      <p className="text-white text-sm">No matches found. Try using the filters above to find the best prompt for your needs.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {isAdmin && <AddPromptForm onSubmit={handleAddPrompt} />}
      
      <CategoryFilter
        selectedCategory={selectedCategory}
        onCategoryChange={(category) => {
          setSelectedCategory(category);
          setSelectedSubcategory("All");
        }}
        categories={categories}
      />

      {/* Featured Prompts Section */}
      {filteredPrompts.featured.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">
            Featured {selectedCategory !== "All" ? `${selectedCategory} ` : ""}Prompts
          </h2>

          {/* Desktop/Tablet Grid */}
          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrompts.featured.map((prompt) => (
              <PromptCard 
                key={prompt.id} 
                prompt={prompt}
                onPromptUsed={(id) => {
                  // Handle prompt usage if needed
                }}
              />
            ))}
          </div>
          
          
          {/* Mobile Carousel */}
          <div className="sm:hidden">
            <div className="relative">
              <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">
                  {filteredPrompts.featured.map((prompt) => (
                    <div key={prompt.id} className="flex-[0_0_100%] min-w-0 pl-4">
                      <PromptGrid prompts={[prompt]} />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Dots Navigation */}
              <div className="flex justify-center gap-2 mt-4">
                {filteredPrompts.featured.map((_, index) => (
                  <button
                    key={index}
                    className={`h-2 rounded-full transition-all ${
                      index === selectedIndex 
                        ? 'w-4 bg-primary' 
                        : 'w-2 bg-primary/30'
                    }`}
                    onClick={() => emblaApi?.scrollTo(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All Prompts Section */}
      <div>
        <div className="mb-6">
          {selectedCategory === "All" && (
            <h2 className="text-2xl font-semibold">
              All Prompts
            </h2>
          )}

          {/* Subcategory Filter - Only show when a category is selected */}
          {selectedCategory !== "All" && (
            <div className="mt-4">
              <div className="flex flex-wrap gap-2 justify-center">
                <Button
                  variant={selectedSubcategory === "All" ? "default" : "outline"}
                  onClick={() => setSelectedSubcategory("All")}
                >
                  All {selectedCategory}
                </Button>
                {availableSubcategories
                  .filter(sub => sub !== "All")
                  .map((subcategory) => (
                    <Button
                      key={subcategory}
                      variant={selectedSubcategory === subcategory ? "default" : "outline"}
                      onClick={() => setSelectedSubcategory(subcategory)}
                    >
                      {subcategory}
                    </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        <PromptGrid prompts={filteredPrompts.all} />
      </div>

      {/* PromptCard Dialog */}
      {selectedPrompt && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <PromptCard 
              prompt={selectedPrompt}
              onPromptUsed={(id) => {
                setIsDialogOpen(false);
                // Handle any other prompt usage logic
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Index;