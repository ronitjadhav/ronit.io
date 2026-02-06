'use client';
import React from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { navLinks, siteUrls, siteConfig, footerConfig } from '@/data/site-config';

function NavLinks() {
  const scrolltoHash = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <ul className="space-y-3">
      {navLinks.map((link) => (
        <li key={link.href}>
          <a
            href={link.href}
            target={link.href.startsWith('http') ? '_blank' : '_self'}
            rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="text-text border-4 border-transparent hover:border-black hover:bg-yellow-300
                             px-4 py-1 transition-all duration-200 dark:text-darkText dark:hover:text-black"
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
        </li>
      ))}
    </ul>
  );
}

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-bg p-4 sm:p-6 md:p-8 border-t-4 sm:border-t-6 md:border-t-8 border-black dark:border-darkBorder dark:bg-darkBg">
      <div className="max-w-full mx-auto px-2 sm:px-5">
        {/* Top Section with Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8 md:mb-12">
          {/* Quick Links */}
          <div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-black mb-3 sm:mb-4 text-text uppercase tracking-wider dark:text-darkText">
              Quick Links
            </h3>
            <NavLinks />
          </div>

          {/* Let's Connect */}
          <div className="transform -rotate-1">
            <h3 className="text-lg sm:text-xl md:text-2xl font-black mb-3 sm:mb-4 text-text uppercase tracking-wider dark:text-darkText">
              Get in Touch!
            </h3>
            <div className="flex flex-col items-center lg:items-start mb-4 sm:mb-6 md:mb-8">
              <div className="flex space-x-4 sm:space-x-6 mb-4 sm:mb-6">
                <a href={siteUrls.github} target="_blank" rel="noopener noreferrer">
                  <FaGithub className="text-2xl sm:text-3xl md:text-4xl text-gray-800 dark:text-white hover:text-cerulean-400 transition-colors duration-300" />
                </a>
                <a href={siteUrls.linkedin} target="_blank" rel="noopener noreferrer">
                  <FaLinkedin className="text-2xl sm:text-3xl md:text-4xl text-gray-800 dark:text-white hover:text-cerulean-400 transition-colors duration-300" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t-2 sm:border-t-4 border-black pt-4 sm:pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
          <p className="text-text font-bold text-sm sm:text-base md:text-lg dark:text-darkText">
            © {currentYear} {footerConfig.copyrightText.replace('{name}', siteConfig.name)}
          </p>
          <div className="bg-black text-white px-3 sm:px-4 py-1.5 sm:py-2 font-mono text-xs sm:text-sm dark:bg-bg dark:text-black">
            {footerConfig.techBadge}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
