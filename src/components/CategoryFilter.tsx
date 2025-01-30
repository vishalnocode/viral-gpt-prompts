import { useState } from "react";

export type Category = "Career" | "Gym Plan" | "Growth Hack" | "Productivity" | "All";

interface CategoryFilterProps {
  onCategoryChange: (category: Category) => void;
  selectedCategory: Category;
}

const categories: Category[] = ["All", "Career", "Gym Plan", "Growth Hack", "Productivity"];

export const CategoryFilter = ({ onCategoryChange, selectedCategory }: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center mb-8 animate-fade-in">
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
    </div>
  );
};