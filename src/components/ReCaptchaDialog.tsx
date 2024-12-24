'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import ReCAPTCHA from 'react-google-recaptcha';

interface ReCaptchaDialogProps {
    onVerified: () => void;
    triggerButtonText: string;
    buttonClassName?: string;
}

export function ReCaptchaDialog({ onVerified, triggerButtonText, buttonClassName = "" }: ReCaptchaDialogProps) {
    const [isCaptchaVisible, setIsCaptchaVisible] = useState(false);
    const [captchaError, setCaptchaError] = useState<string | null>(null);
    const captchaContainerRef = useRef<HTMLDivElement>(null);

    const googleReCaptchaKey = process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY;

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
        if (captchaContainerRef.current && !captchaContainerRef.current.contains(event.target as Node)) {
            setIsCaptchaVisible(false);
        }
    };

    useEffect(() => {
        if (isCaptchaVisible) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isCaptchaVisible]);

    return (
        <div className="relative">
            <Button variant="default" className={buttonClassName} onClick={() => setIsCaptchaVisible(true)}>
                {triggerButtonText}
            </Button>
            {isCaptchaVisible && (
                <div ref={captchaContainerRef} className="absolute mt-2 left-0">
                    <div className="flex justify-center recaptcha-container">
                        <ReCAPTCHA
                            sitekey={googleReCaptchaKey || ''}
                            onChange={handleCaptchaChange}
                            onError={handleCaptchaError}
                            className="z-auto"
                        />
                    </div>
                    {captchaError && (
                        <p className="text-red-500 text-sm text-center">
                            {captchaError}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}