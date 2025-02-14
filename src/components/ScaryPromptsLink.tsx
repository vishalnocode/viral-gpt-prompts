import { useNavigate } from "react-router-dom";

export const ScaryPromptsLink = () => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate('/scary-prompts')}
      className="cursor-pointer hover:opacity-90 transition-opacity mb-8"
    >
      <div className="relative max-w-xs mx-auto">
        <img
          src="/scary-ai.png" // Add this image to your public folder
          alt="Scary AI Prompts"
          className="w-full rounded-lg shadow-lg"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg flex items-center justify-center">
          <span className="text-white text-xl font-bold">
            Explore Scary AI Prompts
          </span>
        </div>
      </div>
    </div>
  );
}; 