import { useState } from "react";
import { Category } from "./CategoryFilter";
import { useToast } from "@/components/ui/use-toast";

interface AddPromptFormProps {
  onSubmit: (prompt: { title: string; content: string; category: Category }) => void;
  categories?: Category[];
}

export const AddPromptForm = ({ onSubmit, categories = ["All", "Career", "Gym Plan", "Growth Hack", "Productivity"] }: AddPromptFormProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<Category>("All");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || category === "All") {
      toast({
        title: "Invalid input",
        description: "Please fill in all fields and select a category.",
        variant: "destructive",
      });
      return;
    }
    onSubmit({ title, content, category });
    setTitle("");
    setContent("");
    setCategory("All");
    toast({
      title: "Prompt added",
      description: "Your prompt has been successfully added.",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-lg p-6 max-w-2xl mx-auto mb-12 animate-scale-in">
      <h2 className="text-2xl font-semibold mb-6 text-center">Add New Prompt</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 rounded-md border border-input bg-background"
            placeholder="Enter prompt title"
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium mb-1">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-2 rounded-md border border-input bg-background min-h-[100px]"
            placeholder="Enter your prompt here"
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium mb-1">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="w-full px-4 py-2 rounded-md border border-input bg-background"
          >
            <option value="All" disabled>Select a category</option>
            {categories.filter(cat => cat !== "All").map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:opacity-90 transition-opacity"
        >
          Add Prompt
        </button>
      </div>
    </form>
  );
};