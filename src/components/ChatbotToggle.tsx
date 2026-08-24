'use client';

import { MessageCircle, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

// ponytail: teaser only — the chatbot itself is not built yet. Bring back the
// Chatbot component + a server route (this site is a static export) when it is.
export default function ChatbotToggle() {
  return (
    <div className="relative z-40 group">
      <Button
        disabled
        className="relative px-6 py-3 h-auto rounded-full shadow-light dark:shadow-dark border-2 border-black dark:border-white opacity-60 cursor-not-allowed bg-gray-300 hover:bg-gray-300"
        aria-label="Ask Ronit AI — coming soon"
      >
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-gray-600" />
          <span className="font-heading text-sm font-bold text-gray-600">Ask Ronit AI</span>
          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center ml-2">
            <ChevronRight className="w-4 h-4 text-white" />
          </div>
        </div>
      </Button>

      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-2 bg-black dark:bg-white text-white dark:text-black text-sm rounded-base shadow-light dark:shadow-dark opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none border-2 border-black dark:border-white">
        Coming Soon... 🚀
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black dark:border-t-white"></div>
      </div>
    </div>
  );
}
