'use client'

import React, { useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'

import Hamburger from './hamburger'
import { ThemeSwitcher } from './theme-switcher'
import { DialogComponent } from './getInTouchDialog'

export default function NavBar() {
    const [isOpen, setIsOpen] = useState(false)
    const [showNav, setShowNav] = useState(true)
    const [lastScrollY, setLastScrollY] = useState(0)

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY

            // Hide navbar when scrolling down more than 100px
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setShowNav(false)
            }
            // Show navbar when scrolling up or at the top of the page
            else if (currentScrollY < lastScrollY || currentScrollY <= 100) {
                setShowNav(true)
            }

            // Always update last scroll position
            setLastScrollY(currentScrollY)
        }

        // Add scroll event listener
        window.addEventListener('scroll', handleScroll)

        // Cleanup listener on component unmount
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [lastScrollY])

    return (
        <>
            <nav className="fixed left-0 top-0 z-50 w-full px-2 sm:px-3">
                <div
                    className={twMerge(
                        `mx-auto mt-2 sm:mt-3 flex h-[80px] w-full max-w-screen-xl
                        items-center justify-between rounded-base border-2
                        border-[#80808033] px-3 sm:px-4 text-text
                        transition-transform duration-300 ease-in-out`,
                        showNav ? 'translate-y-0' : '-translate-y-[calc(100%+20px)]',
                        'bg-white dark:bg-secondaryBlack'
                    )}
                >
                    {/* Ronit.io Text with responsive styling and theme support */}
                    <h1 className="text-3xl font-Space_Grotesk font-extrabold tracking-tight
                        text-cerulean-400 dark:text-white
                        min-w-[80px] xs:min-w-[100px] lg:text-5xl">
                        ronit.io
                    </h1>

                    {/* Desktop Navbar Links */}
                    <div className="hidden md:flex items-center text-xs sm:text-base lg:text-lg space-x-2 sm:space-x-4 lg:space-x-6">
                        <NavLinks />

                        {/* "Let's Work Together!" Button visible only on medium and larger screens */}
                        <div className="flex items-center gap-1 sm:gap-2">
                            <DialogComponent
                                triggerButtonText="Let&apos;s Work Together!"
                                dialogTitle="Get in Touch"
                                dialogDescription="Please fill out the form below to get in touch with us."
                                inputLabels={{ name: 'Name', email: 'Email', message: 'Message' }}
                                onSubmit={() => alert('Form submitted!')}
                            />
                            <ThemeSwitcher />
                        </div>
                    </div>

                    {/* Mobile menu toggle */}
                    <div className="md:hidden flex items-center gap-2 sm:gap-3">
                        <ThemeSwitcher />
                        <Hamburger isOpen={isOpen} setIsOpen={setIsOpen} />
                    </div>
                </div>
            </nav>

            {/* Mobile menu */}
            {isOpen && (
                <div
                    className={twMerge(
                        'flex flex-col divide-y-4 divide-[#80808033] border-2 fixed top-[80px] z-50 ' +
                        'bg-white dark:bg-secondaryBlack border-[#80808033] w-full px-2 sm:px-4 pb-2 sm:pb-4'
                    )}
                >
                    <MobileNavLinks />

                    {/* "Let's Work Together!" button in mobile view */}
                    <DialogComponent
                        triggerButtonText="Let&apos;s Work Together!"
                        dialogTitle="Get in Touch"
                        dialogDescription="Please fill out the form below to get in touch with us."
                        inputLabels={{ name: 'Name', email: 'Email', message: 'Message' }}
                        onSubmit={() => alert('Form submitted!')}
                    />
                </div>
            )}
        </>
    )
}

// Separate component for nav links to reduce repetition
function NavLinks() {
    const links = [
        { href: "#home", label: "Home" },
        { href: "#skills", label: "Skills" },
        { href: "#experience", label: "Experience" },
        { href: "#projects", label: "Projects" },
        { href: "#contact", label: "Contact" }
    ]

    return (
        <>
            {links.map((link) => (
                <a
                    key={link.href}
                    href={link.href}
                    className="text-xs sm:text-base hover:text-cerulean-400 dark:text-white transition-colors duration-300"
                >
                    {link.label}
                </a>
            ))}
        </>
    )
}

// Separate component for mobile nav links
function MobileNavLinks() {
    const links = [
        { href: "#home", label: "Home" },
        { href: "#skills", label: "Skills" },
        { href: "#experience", label: "Experience" },
        { href: "#projects", label: "Projects" },
        { href: "#contact", label: "Contact" }
    ]

    return (
        <>
            {links.map((link) => (
                <a
                    key={link.href}
                    href={link.href}
                    className="py-2 sm:py-3 text-center text-sm sm:text-xl text-slate-900 dark:text-white
                               hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
                >
                    {link.label}
                </a>
            ))}
        </>
    )
}