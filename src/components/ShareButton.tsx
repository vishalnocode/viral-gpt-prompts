import { useState } from 'react';
import { Share2, Twitter, Linkedin, Facebook } from 'lucide-react';
import {
  TwitterShareButton,
  LinkedinShareButton,
  FacebookShareButton,
  RedditShareButton,
} from 'react-share';

export const ShareButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const shareUrl = "https://viralgptprompts.com";
  const title = "Free collection of Viral ChatGPT prompts.";
  const description = "Discover the best ChatGPT prompts for resume writing, business, marketing, and more.";

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className={`flex flex-col-reverse gap-2 mb-2 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <TwitterShareButton 
          url={shareUrl} 
          title={title}
          via="YourTwitterHandle"
          hashtags={["ChatGPT Prompts", "AI Prompts"]}
        >
          <div className="p-3 bg-primary text-white rounded-full hover:bg-primary/90">
            <Twitter size={20} />
          </div>
        </TwitterShareButton>
        
        <LinkedinShareButton 
          url={shareUrl} 
          title={title}
          summary={description}
          source={window.location.hostname}
        >
          <div className="p-3 bg-primary text-white rounded-full hover:bg-primary/90">
            <Linkedin size={20} />
          </div>
        </LinkedinShareButton>
        
        <FacebookShareButton 
          url={shareUrl} 
          quote={title}
          description={description}
          hashtag="#ChatGPT"
        >
          <div className="p-3 bg-primary text-white rounded-full hover:bg-primary/90">
            <Facebook size={20} />
          </div>
        </FacebookShareButton>
        
        <RedditShareButton 
          url={shareUrl} 
          title={title}
        >
          <div className="p-3 bg-primary text-white rounded-full hover:bg-primary/90">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0z"/>
              <path fill="white" d="M18.8 12a2.2 2.2 0 0 0-3.7-1.6 11 11 0 0 0-5.7-1.8l1-4.7 3.3.8a1.6 1.6 0 1 0 .2-.8l-3.7-.8a.4.4 0 0 0-.5.3l-1 5a11 11 0 0 0-5.8 1.8 2.2 2.2 0 0 0-3.4 2.8 2.2 2.2 0 0 0 .5 1.2 3.4 3.4 0 0 0 0 .5c0 2.6 3 4.7 6.8 4.7s6.8-2.1 6.8-4.7a3.4 3.4 0 0 0 0-.5 2.2 2.2 0 0 0 1.7-2.1zm-11.2 1a1.6 1.6 0 1 1 3.2 0 1.6 1.6 0 0 1-3.2 0zm7.6 4.3a5 5 0 0 1-6.2 0 .4.4 0 1 1 .6-.6 4.2 4.2 0 0 0 5 0 .4.4 0 1 1 .6.6zm-.4-2.7a1.6 1.6 0 1 1 0-3.2 1.6 1.6 0 0 1 0 3.2z"/>
            </svg>
          </div>
        </RedditShareButton>
      </div>
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 bg-primary text-white rounded-full hover:bg-primary/90 shadow-lg"
      >
        <Share2 size={24} />
      </button>
    </div>
  );
}; 