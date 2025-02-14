import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PromptGrid } from "@/components/PromptGrid";
import scaryPrompts from "@/data/scary-prompts.json";
import { Search, ArrowLeft } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PromptCard } from "@/components/PromptCard";

const ScaryPrompts = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<typeof scaryPrompts.prompts[0] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Only filter for dropdown results
  const filteredDropdownPrompts = scaryPrompts.prompts.filter((prompt) => {
    const searchContent = `${prompt.title} ${prompt.description}`.toLowerCase();
    return searchContent.includes(searchQuery.toLowerCase());
  });

  // Take only first 3 results for dropdown
  const limitedSearchResults = filteredDropdownPrompts.slice(0, 3);

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.search-container')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Navigation */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </button>

        <h1 className="text-4xl font-bold text-center mb-8">Scary AI Prompts</h1>
        <p className="text-center text-gray-400 mb-8">
          Explore our collection of spine-chilling AI prompts designed to create eerie, 
          unsettling, and horror-themed content. Perfect for horror enthusiasts and 
          creative writers looking to generate spooky stories and scenarios.
        </p>

        {/* Search input with dropdown */}
        <div className="relative w-full max-w-lg mx-auto mb-8 search-container">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <input
            className="w-full pl-10 p-2 rounded-md bg-gray-900 border border-gray-800 text-white"
            placeholder="Search prompts..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
          />
          
          {/* Search Results Dropdown */}
          {showDropdown && searchQuery && (
            <div className="absolute w-full mt-1 bg-gray-900 border border-gray-800 rounded-md shadow-lg max-h-60 overflow-auto z-50">
              {limitedSearchResults.length > 0 ? (
                limitedSearchResults.map((prompt) => (
                  <div
                    key={prompt.title}
                    className="p-2 hover:bg-gray-800 cursor-pointer"
                    onClick={() => {
                      setSearchQuery(prompt.title);
                      setShowDropdown(false);
                      setSelectedPrompt(prompt);
                      setIsDialogOpen(true);
                    }}
                  >
                    {prompt.title}
                  </div>
                ))
              ) : (
                <div className="p-2 text-gray-400">No results found</div>
              )}
            </div>
          )}
        </div>

        {/* Show all prompts instead of filtered ones */}
        <PromptGrid 
          prompts={scaryPrompts.prompts} 
          hidePrompt={true}
          showDescription={true}
          selectedPrompt={selectedPrompt}
          onPromptClick={(prompt) => {
            setSelectedPrompt(prompt);
            setIsDialogOpen(true);
          }}
        />

        {/* PromptCard Dialog */}
        {selectedPrompt && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
              <PromptCard 
                prompt={selectedPrompt}
                hidePrompt={false}
                showDescription={true}
                onPromptUsed={() => {
                  setIsDialogOpen(false);
                }}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default ScaryPrompts; 