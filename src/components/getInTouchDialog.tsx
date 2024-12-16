'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import ReCAPTCHA from 'react-google-recaptcha';

interface DialogProps {
    triggerButtonText: string
    dialogTitle: string
    dialogDescription: string
    inputLabels: { name: string, email: string, message: string }
    onSubmit: () => void
}

export function DialogComponent({
                                    triggerButtonText,
                                    dialogTitle,
                                    dialogDescription,
                                    inputLabels,
                                    onSubmit
                                }: DialogProps) {
    const [captchaVerified, setCaptchaVerified] = useState(false)

    const handleCaptchaChange = (value: string | null) => {
        // Set captcha verification status to true when user completes the CAPTCHA
        setCaptchaVerified(!!value)
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default">{triggerButtonText}</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{dialogTitle}</DialogTitle>
                    <DialogDescription>{dialogDescription}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="flex items-center gap-4 mb-5">
                        <Label htmlFor="name" className="text-right w-1/4">
                            {inputLabels.name}
                        </Label>
                        <Input id="name" className="w-3/4" />
                    </div>
                    <div className="flex items-center gap-4 mb-5">
                        <Label htmlFor="email" className="text-right w-1/4">
                            {inputLabels.email}
                        </Label>
                        <Input id="email" className="w-3/4" />
                    </div>
                    <div className="flex items-center gap-4 mb-5">
                        <Label htmlFor="message" className="text-right w-1/4">
                            {inputLabels.message}
                        </Label>
                        <Textarea id="message" className="w-3/4" />
                    </div>
                    {/* CAPTCHA */}
                    <div className="flex justify-center mb-4">
                        <ReCAPTCHA
                            sitekey="your-recaptcha-site-key" // Replace with your site key from Google reCAPTCHA
                            onChange={handleCaptchaChange}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        type="submit"
                        onClick={onSubmit}
                        disabled={!captchaVerified} // Disable the button if CAPTCHA is not verified
                    >
                        Send
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}