'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import ReCAPTCHA from 'react-google-recaptcha';
import { X } from 'lucide-react';
import { useTheme } from 'next-themes';
import { createPortal } from 'react-dom';

interface ReCaptchaDialogProps {
  onVerified: () => void;
  triggerButtonText: string;
  buttonClassName?: string;
}

export function ReCaptchaDialog({
  onVerified,
  triggerButtonText,
  buttonClassName = '',
}: ReCaptchaDialogProps) {
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

  const handleCaptchaChange = (value: string | null) => {
    if (value) {
      onVerified();
      setIsCaptchaVisible(false);
    }
    setCaptchaError(null);
  };

  const handleCaptchaError = () => {
    setCaptchaError('Failed to load CAPTCHA. Please refresh the page.');
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      captchaContainerRef.current &&
      !captchaContainerRef.current.contains(event.target as Node)
    ) {
      setIsCaptchaVisible(false);
    }
  };

  const handleClose = () => {
    setIsCaptchaVisible(false);
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

  const handleShowCaptcha = () => {
    setIsCaptchaVisible(true);
    setCaptchaError(null);
  };

  // Modal content
  const modalContent = isCaptchaVisible ? (
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
              Verify you're human
            </h3>
            <button
              onClick={handleClose}
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
              onClick={handleClose}
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
      <Button
        variant="default"
        className={`transition-all hover:scale-[1.02] active:scale-[0.98] ${buttonClassName}`}
        onClick={handleShowCaptcha}
      >
        {triggerButtonText}
      </Button>

      {/* Use createPortal to render modal at document.body level */}
      {isMounted && modalContent && createPortal(modalContent, document.body)}

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
