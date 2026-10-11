'use client';

import React, { useCallback, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogPortal,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ReCaptchaDialog, googleReCaptchaKey } from './ReCaptchaDialog';
import emailjs from '@emailjs/browser';
import { toast } from 'react-toastify';

interface DialogProps {
  triggerButtonText: string;
  dialogTitle: string;
  dialogDescription: string;
  inputLabels: { name: string; email: string; message: string };
  buttonClassName?: string;
  inputClassName?: string;
}

export function DialogComponent({
  triggerButtonText,
  dialogTitle,
  dialogDescription,
  inputLabels,
  buttonClassName = '',
  inputClassName = '',
}: DialogProps) {
  const [input, setInput] = useState({ name: '', email: '', message: '' });
  const [isOpen, setIsOpen] = useState(false);
  const [isCaptchaOpen, setIsCaptchaOpen] = useState(false);
  const closeCaptcha = useCallback(() => setIsCaptchaOpen(false), []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!input.name.trim()) return 'Name is required';
    if (!input.email.trim()) return 'Email is required';
    if (!input.message.trim()) return 'Message is required';
    if (!input.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return 'Invalid email format';
    return null;
  };

  const serviceID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
  const templateID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

  const sendEmail = async (captchaToken?: string) => {
    try {
      await toast.promise(
        emailjs.send(
          serviceID!,
          templateID!,
          {
            to_name: 'Ronit Jadhav',
            from_name: input.name,
            email: input.email,
            message: input.message,
            // Checked by EmailJS when the template has reCAPTCHA V2 verification on.
            'g-recaptcha-response': captchaToken,
          },
          publicKey,
        ),
        { pending: 'Sending…', success: 'Message sent successfully!' },
      );
      setInput({ name: '', email: '', message: '' });
    } catch (err: unknown) {
      const errorMessage =
        (err as { text?: string; message?: string })?.text ||
        (err as Error).message ||
        'Failed to send message';
      toast.error(errorMessage);
      setIsOpen(true); // reopen with what they typed, so they can retry
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }
    if (!serviceID || !templateID || !publicKey) {
      toast.error('Email service configuration is missing');
      return;
    }

    // The form's modal blocks clicks outside it, the captcha included, so close it
    // first. The input lives in this component and survives the close.
    setIsOpen(false);
    if (googleReCaptchaKey) setIsCaptchaOpen(true);
    else sendEmail();
  };

  return (
    <>
      <Button
        className={`transition-all hover:scale-[1.02] active:scale-[0.98] ${buttonClassName}`}
        onClick={() => setIsOpen(true)}
      >
        {triggerButtonText}
      </Button>
      <ReCaptchaDialog
        open={isCaptchaOpen}
        onClose={closeCaptcha}
        onVerified={(token) => {
          setIsCaptchaOpen(false);
          sendEmail(token);
        }}
      />
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogPortal>
          <div className="fixed inset-0 bg-black/50 z-40" aria-hidden="true" />
          <div className="fixed inset-0 overflow-y-auto z-50">
            <div className="flex min-h-full items-center justify-center p-4">
              <DialogContent className="animate-in fade-in-0 w-full max-w-lg rounded-lg overflow-hidden">
                <div className="px-3 py-3 md:px-6 md:py-4">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">{dialogTitle}</DialogTitle>
                    <DialogDescription className="text-sm text-gray-500">
                      {dialogDescription}
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name" className={inputClassName}>
                          {inputLabels.name}
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          value={input.name}
                          onChange={handleInputChange}
                          className={`mt-1 block w-full ${inputClassName}`}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="email" className={inputClassName}>
                          {inputLabels.email}
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={input.email}
                          onChange={handleInputChange}
                          className={`mt-1 block w-full ${inputClassName}`}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="message" className={inputClassName}>
                          {inputLabels.message}
                        </Label>
                        <Textarea
                          id="message"
                          name="message"
                          value={input.message}
                          onChange={handleInputChange}
                          className={`mt-1 block w-full min-h-[100px] ${inputClassName}`}
                          required
                        />
                      </div>
                    </div>

                    <DialogFooter className="mt-6">
                      <Button
                        type="submit"
                        disabled={!input.name || !input.email || !input.message}
                        className="w-full bg-main text-black disabled:opacity-50 h-12 text-base font-heading md:text-lg lg:h-14 lg:text-xl"
                      >
                        Send Message
                      </Button>
                    </DialogFooter>
                  </form>
                </div>
              </DialogContent>
            </div>
          </div>
        </DialogPortal>
      </Dialog>
    </>
  );
}
