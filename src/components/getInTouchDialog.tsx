'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogPortal } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ReCaptchaDialog } from './ReCaptchaDialog';
import emailjs from '@emailjs/browser';
import { toast } from 'react-toastify';
import { Loader2 } from 'lucide-react';

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
                                    buttonClassName = "",
                                    inputClassName = ""
                                }: DialogProps) {
    const [input, setInput] = useState({ name: '', email: '', message: '' });
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setInput(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        if (!input.name.trim()) return 'Name is required';
        if (!input.email.trim()) return 'Email is required';
        if (!input.message.trim()) return 'Message is required';
        if (!input.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return 'Invalid email format';
        return null;
    };

    const resetForm = () => {
        setInput({ name: '', email: '', message: '' });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validationError = validateForm();
        if (validationError) {
            toast.error(validationError);
            return;
        }

        const serviceID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
        const templateID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
        const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

        if (!serviceID || !templateID || !publicKey) {
            toast.error('Email service configuration is missing');
            return;
        }

        setIsLoading(true);

        try {
            const emailRes = await emailjs.send(
                serviceID,
                templateID,
                {
                    to_name: 'Ronit Jadhav',
                    from_name: input.name,
                    email: input.email,
                    message: input.message
                },
                publicKey
            );

            if (emailRes.status === 200) {
                toast.success('Message sent successfully!');
                resetForm();
                setIsOpen(false);
            }
        } catch (err: unknown) {
            const errorMessage = (err as { text?: string; message?: string })?.text
                || (err as Error).message
                || 'Failed to send message';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <ReCaptchaDialog
                triggerButtonText={triggerButtonText}
                buttonClassName={buttonClassName}
                onVerified={() => setIsOpen(true)}
            />
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogPortal>
                    <div className="fixed inset-0 bg-black/50 dialog-overlay" aria-hidden="true" />
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <DialogContent className="animate-in fade-in-0 slide-in-from-bottom-0 sm:zoom-in-0 sm:slide-in-from-bottom-0 w-full max-w-lg rounded-lg bg-white">
                                <div className="px-6 py-4">
                                    <DialogHeader>
                                        <DialogTitle className="text-xl font-semibold">
                                            {dialogTitle}
                                        </DialogTitle>
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
                                                    disabled={isLoading}
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
                                                    disabled={isLoading}
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
                                                    disabled={isLoading}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <DialogFooter className="mt-6">
                                            <Button
                                                type="submit"
                                                disabled={isLoading || !input.name || !input.email || !input.message}
                                                className="w-full bg-main text-black disabled:opacity-50 h-12 text-base font-heading md:text-lg lg:h-14 lg:text-xl"
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Sending...
                                                    </>
                                                ) : (
                                                    'Send Message'
                                                )}
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