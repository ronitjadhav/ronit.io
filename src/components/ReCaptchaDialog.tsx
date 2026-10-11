'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import ReCAPTCHA from 'react-google-recaptcha';
import { X } from '@phosphor-icons/react/ssr';
import { useTheme } from 'next-themes';
import { createPortal } from 'react-dom';

export const googleReCaptchaKey = process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY;

interface ReCaptchaDialogProps {
  open: boolean;
  onClose: () => void;
  /** Gets the token, which EmailJS verifies server-side. A v2 token expires after
   *  two minutes, so this dialog is shown at send time, not before the form. */
  onVerified: (token: string) => void;
}

export function ReCaptchaDialog({ open, onClose, onVerified }: ReCaptchaDialogProps) {
  const [captchaError, setCaptchaError] = useState<string | null>(null);
  const captchaContainerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  const handleCaptchaChange = (value: string | null) => {
    if (value) onVerified(value);
    setCaptchaError(null);
  };

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        captchaContainerRef.current &&
        !captchaContainerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    // Prevent body scrolling while the captcha is visible
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  // Rendering <ReCAPTCHA sitekey=""> makes Google's script throw during render,
  // which unmounts the whole React tree, so never render it without a key.
  if (!open || !googleReCaptchaKey) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div
        ref={captchaContainerRef}
        className="relative w-[calc(100vw-2rem)] max-w-md mx-auto my-auto rounded-base border-2 border-border dark:border-darkBorder bg-white dark:bg-darkBg shadow-light dark:shadow-dark animate-in fade-in-0 zoom-in-90 duration-200"
      >
        <div className="flex flex-col p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-heading text-text dark:text-darkText">
              Verify you&apos;re human
            </h3>
            <button
              onClick={onClose}
              className="text-text dark:text-darkText opacity-70 hover:opacity-100 transition-all hover:rotate-90 rounded-sm p-1"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </button>
          </div>

          <div className="relative flex justify-center items-center min-h-[78px]">
            <div className="recaptcha-container flex justify-center">
              <ReCAPTCHA
                sitekey={googleReCaptchaKey}
                onChange={handleCaptchaChange}
                onErrored={() =>
                  setCaptchaError('Failed to load CAPTCHA. Please refresh the page.')
                }
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
              onClick={onClose}
              className="transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
