'use client';

import React, { useEffect, useState, useRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';
import { ThemeSwitcher } from './theme-switcher';
import { DialogComponent } from './getInTouchDialog';
import Image from 'next/image';
import ronitLogo from '@/media/ronitLogo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { navLinks } from '@/data/site-config';

const scrolltoHash = function (element_id: string) {
  const element = document.getElementById(element_id);
  element?.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
};

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowNav(false);
      } else if (currentScrollY < lastScrollY || currentScrollY <= 100) {
        setShowNav(true);
      }
      setLastScrollY(currentScrollY);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [lastScrollY]);

  const navbarVariants = {
    hidden: { y: '-120%' },
    visible: {
      y: 0,
      transition: { duration: 0.5, delay: 0.2 },
    },
  };

  return (
    <>
      <motion.nav
        className="sticky top-4 z-50 w-full px-4"
        variants={navbarVariants}
        initial="hidden"
        animate="visible"
      >
        <div
          className={twMerge(
            `mx-auto mt-2 sm:mt-4 flex h-[60px] sm:h-[70px] md:h-[80px] w-full max-w-full
        items-center justify-between px-3 sm:px-6 transition-transform
        duration-300 ease-in-out bg-yellow-300 dark:bg-darkBg transform
        border-[3px] border-black dark:border-darkBorder
        shadow-[8px_8px_0px_0px_#000000] dark:shadow-[8px_8px_0px_0px_#555555]`,
            showNav ? 'translate-y-0' : '-translate-y-[calc(100%+40px)]',
          )}
        >
          {/* Logo */}
          <h1
            className="text-3xl font-black font-Space_Grotesk tracking-tight
    text-black dark:text-white transform -rotate-2 hover:rotate-0 transition-transform
    duration-300 min-w-[80px] xs:min-w-[100px] lg:text-5xl"
          >
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                scrolltoHash('home');
              }}
            >
              <Image src={ronitLogo} alt="Ronit Logo" width={70} height={70} />
            </a>
          </h1>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center text-base lg:text-lg space-x-6">
            <NavLinks />

            <div className="flex items-center gap-4">
              <DialogComponent
                triggerButtonText="Get in Touch!"
                dialogTitle="Get in Touch"
                dialogDescription="Please fill out the form below to get in touch with me."
                inputLabels={{ name: 'Name', email: 'Email', message: 'Message' }}
              />
              <ThemeSwitcher />
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-4">
            <ThemeSwitcher />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 bg-main dark:bg-main transform hover:-rotate-3 transition-transform
                border-2 border-black dark:border-darkBorder
                shadow-[4px_4px_0px_0px_#000000] dark:shadow-[4px_4px_0px_0px_#555555]"
            >
              <div className="w-6 h-0.5 bg-black mb-1"></div>
              <div className="w-6 h-0.5 bg-black mb-1"></div>
              <div className="w-6 h-0.5 bg-black"></div>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="fixed top-[90px] sm:top-[110px] z-50 w-full px-2 sm:px-4" ref={menuRef}>
          <div
            className="w-full bg-white dark:bg-darkBg p-4 transform
              border-[3px] border-black dark:border-darkBorder
              shadow-[8px_8px_0px_0px_#000000] dark:shadow-[8px_8px_0px_0px_#555555]"
          >
            <MobileNavLinks setIsOpen={setIsOpen} />
            <div className="mt-4 p-2">
              <DialogComponent
                triggerButtonText="Get in Touch!"
                dialogTitle="Get in Touch"
                dialogDescription="Please fill out the form below to get in touch with us."
                inputLabels={{ name: 'Name', email: 'Email', message: 'Message' }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

function NavLinks() {
  return (
    <>
      {navLinks.map((link) => (
        <a
          key={link.href}
          href={link.href}
          target={link.href.startsWith('http') ? '_blank' : '_self'}
          rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
          className="px-3 py-1 font-bold text-black dark:text-white hover:-translate-y-1 hover:rotate-2
                             transform transition-all duration-200"
          style={{
            border: '2px solid transparent',
            borderRadius: '0px',
          }}
          // Desktop nav link styles — border kept inline for transparent default
          onClick={(e) => {
            if (link.href.startsWith('#')) {
              e.preventDefault();
              scrolltoHash(link.href.substring(1));
            }
          }}
        >
          {link.label}
          {link.href.startsWith('http') && (
            <FontAwesomeIcon icon={faExternalLinkAlt} className="ml-2" />
          )}
        </a>
      ))}
    </>
  );
}

function MobileNavLinks({
  setIsOpen,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div className="flex flex-col space-y-3">
      {navLinks.map((link) => (
        <a
          key={link.href}
          href={link.href}
          target={link.href.startsWith('http') ? '_blank' : '_self'}
          rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
          className="p-2 text-center text-lg font-bold bg-yellow-300 dark:bg-darkBg
                             transform hover:rotate-2 transition-transform
                             border-2 border-black dark:border-darkBorder
                             shadow-[4px_4px_0px_0px_#000000] dark:shadow-[4px_4px_0px_0px_#555555]"
          onClick={(e) => {
            if (link.href.startsWith('#')) {
              e.preventDefault();
              scrolltoHash(link.href.substring(1));
            }
            setIsOpen(false);
          }}
        >
          {link.label}
          {link.href.startsWith('http') && (
            <FontAwesomeIcon icon={faExternalLinkAlt} className="ml-2" />
          )}
        </a>
      ))}
    </div>
  );
}

export default NavBar;
