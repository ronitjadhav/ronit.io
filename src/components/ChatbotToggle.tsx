'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReCAPTCHA from 'react-google-recaptcha';
import { useTheme } from 'next-themes';
import { createPortal } from 'react-dom';

export default function ChatbotToggle() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCaptchaVisible, setIsCaptchaVisible] = useState(false);
  const [captchaError, setCaptchaError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const captchaContainerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  const googleReCaptchaKey = process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY;

  // Ensure component is mounted before rendering portal
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle captcha modal outside clicks
  const handleClickOutside = (event: MouseEvent) => {
    if (
      captchaContainerRef.current &&
      !captchaContainerRef.current.contains(event.target as Node)
    ) {
      setIsCaptchaVisible(false);
    }
  };

  useEffect(() => {
    if (isCaptchaVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent body scrolling when captcha is visible
      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
      // Restore body scrolling
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isCaptchaVisible]);

  const handleCaptchaChange = (value: string | null) => {
    if (value) {
      setIsCaptchaVisible(false);
      setIsOpen(true);
    }
    setCaptchaError(null);
  };

  const handleCaptchaError = () => {
    setCaptchaError('Failed to load CAPTCHA. Please refresh the page.');
  };

  const handleCloseCaptcha = () => {
    setIsCaptchaVisible(false);
  };

  const handleOpen = () => {
    // Chatbot is disabled - coming soon
    return;
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  // Captcha modal content
  const captchaModalContent = isCaptchaVisible ? (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        margin: 0,
        padding: 0,
      }}
    >
      <div
        ref={captchaContainerRef}
        className="relative w-[calc(100vw-2rem)] max-w-md mx-auto my-auto rounded-base border-2 border-border dark:border-darkBorder bg-white dark:bg-darkBg shadow-light dark:shadow-dark"
        style={{
          animation: 'fadeInScale 0.2s ease-out',
          transformOrigin: 'center center',
        }}
      >
        <div className="flex flex-col p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-heading text-text dark:text-darkText">
              Verify you&apos;re human to chat
            </h3>
            <button
              onClick={handleCloseCaptcha}
              className="text-text dark:text-darkText opacity-70 hover:opacity-100 transition-all hover:rotate-90 rounded-sm p-1"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </button>
          </div>

          <div className="relative flex justify-center items-center min-h-[78px]">
            <div className="recaptcha-container flex justify-center">
              <ReCAPTCHA
                sitekey={googleReCaptchaKey || ''}
                onChange={handleCaptchaChange}
                onError={handleCaptchaError}
                size="normal"
                theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
                onExpired={() => setCaptchaError('CAPTCHA expired. Please try again.')}
              />
            </div>
          </div>

          {captchaError && <p className="text-red-500 text-sm text-center mt-3">{captchaError}</p>}

          <div className="mt-5 flex justify-end">
            <Button
              variant="neutral"
              size="default"
              onClick={handleCloseCaptcha}
              className="transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <div className="relative z-40">
        {/* Chatbot Component - Disabled
        {isOpen && (
          <div className="absolute bottom-full right-0 mb-4 w-96 h-[600px] animate-in slide-in-from-bottom-4 duration-300">
            <Chatbot isOpen={isOpen} onClose={handleClose} />
          </div>
        )}
        */}

        {/* Floating Action Button - Disabled state */}
        <div className="relative group">
          {/* Pulse Animation - disabled
          {showPulse && !isOpen && (
            <div className="absolute inset-0 rounded-full bg-purple-300 animate-ping opacity-75"></div>
          )}
          */}

          {/* AI Indicator - disabled
          {!isOpen && (
            <div
              className={`absolute -top-1 -right-1 w-3 h-3 border-2 border-white dark:border-darkBg rounded-full ${
                isVerified ? 'bg-green-500' : 'bg-black dark:bg-white'
              }`}
            ></div>
          )}
          */}

          <Button
            onClick={isOpen ? handleClose : handleOpen}
            disabled={true}
            className={`relative px-6 py-3 h-auto rounded-full shadow-light dark:shadow-dark transition-all duration-200 border-2 border-black dark:border-white opacity-60 cursor-not-allowed bg-gray-300 hover:bg-gray-300`}
            aria-label="AI chatbot coming soon"
          >
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-gray-600 dark:text-gray-600" />
              <span className="font-heading text-sm font-bold text-gray-600 dark:text-gray-600">
                Ask Ronit AI
              </span>
              <div className="w-8 h-8 bg-gray-600 dark:bg-gray-600 rounded-full flex items-center justify-center ml-2">
                <svg
                  className="w-4 h-4 text-white dark:text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </Button>

          {/* Tooltip - Coming Soon message */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-3 py-2 bg-black dark:bg-white text-white dark:text-black text-sm rounded-base shadow-light dark:shadow-dark opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none border-2 border-black dark:border-white">
            Coming Soon... 🚀
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black dark:border-t-white"></div>
          </div>
        </div>
      </div>

      {/* Captcha Modal - Use createPortal to render at document.body level */}
      {isMounted && captchaModalContent && createPortal(captchaModalContent, document.body)}

      <style jsx global>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
}
