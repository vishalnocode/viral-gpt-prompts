import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PromptGrid } from "@/components/PromptGrid";
import scaryPrompts from "@/data/scary-prompts.json";
import { Search, ArrowLeft } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PromptCard } from "@/components/PromptCard";
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const ScaryPrompts = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<typeof scaryPrompts.prompts[0] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

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

  // Add email validation function
  const isValidEmail = (email: string) => {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
  };

  const checkEmailExists = async (email: string) => {
    const q = query(
      collection(db, 'subscribers'),
      where('email', '==', email.toLowerCase())
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(''); // Clear any existing error messages
    
    if (!email) {
      setErrorMessage('Please enter an email address');
      setSubscribeStatus('error');
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMessage('Please enter a valid email address');
      setSubscribeStatus('error');
      return;
    }

    setSubscribeStatus('loading');
    try {
      // Check if email already exists
      const emailExists = await checkEmailExists(email);
      if (emailExists) {
        setErrorMessage('This email is already subscribed!');
        setSubscribeStatus('error');
        return;
      }

      // If email doesn't exist, proceed with subscription
      await addDoc(collection(db, 'subscribers'), {
        email: email.toLowerCase(),
        subscribedAt: new Date().toISOString(),
      });

      setSubscribeStatus('success');
      setEmail('');
    } catch (error: any) {
      setErrorMessage('Error subscribing. Please try again later.');
      setSubscribeStatus('error');
      console.error('Error subscribing:', error);
    }
  };

  // Add this useEffect
  useEffect(() => {
    const duration = 2000;
    const interval = 200; 
    const steps = duration / interval;
    const incrementAmount = 100 / steps;

    const timer = setInterval(() => {
      setLoadingProgress(prev => {
        const next = Math.min(prev + incrementAmount, 100);
        if (next === 100) {
          clearInterval(timer);
          setTimeout(() => setIsLoading(false), 100); // Small delay after reaching 100%
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      {isLoading ? (
        <div className="h-screen flex flex-col items-center justify-center space-y-8">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-purple-500 font-bold">
              {Math.round(loadingProgress)}%
            </div>
          </div>
          <p className="text-center max-w-md text-xl font-medium text-purple-400 animate-pulse">
            You are entering into a realm of nerve-wracking, hidden prompts that can change your life forever...
          </p>
        </div>
      ) : (
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
              Discover hidden GPT prompts so powerful and mind-bending, the internet doesn't want you to know about them.
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

          {/* Updated subscription card */}
          <div className="w-full max-w-lg mx-auto mb-12 p-8 bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-800 shadow-xl">
            <div className="space-y-4">
              {/* Header */}
              <div className="space-y-2">
                <h2 className="text-xl text-white centre">
                  Subscribe now to get <strong>five new dark & powerful prompts every week</strong> in your inbox.
                </h2>
              </div>

              {/* Subscription Form */}
              <form onSubmit={handleSubscribe} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className={`flex-1 px-4 py-3 rounded-lg bg-gray-800/50 border ${
                      subscribeStatus === 'error'
                        ? 'border-red-500' 
                        : 'border-gray-700'
                    } text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
                    required
                  />
                  <button
                    type="submit"
                    disabled={subscribeStatus === 'loading'}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {subscribeStatus === 'loading' ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Subscribing...
                      </span>
                    ) : (
                      'Subscribe'
                    )}
                  </button>
                </div>

                {/* Form Messages */}
                <div className="min-h-[24px]">
                  {subscribeStatus === 'error' && errorMessage && (
                    <p className="text-sm text-red-400 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {errorMessage}
                    </p>
                  )}
                  {subscribeStatus === 'success' && (
                    <p className="text-sm text-green-400 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Successfully subscribed! Thank you for joining.
                    </p>
                  )}
                </div>
              </form>
            </div>
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
      )}
    </div>
  );
};

export default ScaryPrompts; 