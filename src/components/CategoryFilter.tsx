import { useState } from "react";

export type Category = "Career" | "Gym Plan" | "Growth Hack" | "Productivity" | "All" | string;

interface CategoryFilterProps {
  onCategoryChange: (category: Category) => void;
  selectedCategory: Category;
  categories: Category[];
  isAdmin?: boolean;
  onAddCategory?: (category: string) => void;
}

export const CategoryFilter = ({ 
  onCategoryChange, 
  selectedCategory, 
  categories, 
  isAdmin = false,
  onAddCategory 
}: CategoryFilterProps) => {
  const [newCategory, setNewCategory] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory.trim() && onAddCategory) {
      onAddCategory(newCategory.trim());
      setNewCategory("");
      setShowAddForm(false);
    }
  };

  return (
    <div className="mb-8 animate-fade-in">
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
              ${
                selectedCategory === category
                  ? "bg-primary text-primary-foreground shadow-md scale-105"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
          >
            {category}
          </button>
        ))}
        {isAdmin && !showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 rounded-full text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80"
          >
            + Add Category
          </button>
        )}
      </div>
      
      {isAdmin && showAddForm && (
        <form onSubmit={handleSubmit} className="mt-4 flex gap-2 justify-center">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Enter new category"
            className="px-4 py-2 rounded-md border border-input bg-background"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => setShowAddForm(false)}
            className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:opacity-90"
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};