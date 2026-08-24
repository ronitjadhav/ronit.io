'use client';
import { TypeAnimation } from 'react-type-animation';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { BiLogoPostgresql } from 'react-icons/bi';
import Marquee from 'react-fast-marquee';
import ronitImage from '@/media/ronit.webp';
import {
  SiAngular,
  SiApacheairflow,
  SiArcgis,
  SiArgo,
  SiDocker,
  SiGit,
  SiJavascript,
  SiKubernetes,
  SiLeaflet,
  SiOpenlayers,
  SiOsgeo,
  SiPython,
  SiQgis,
  SiTypescript,
} from 'react-icons/si';
import Image from 'next/image';
import { DialogComponent } from '@/components/getInTouchDialog';
import ChatbotToggle from '@/components/ChatbotToggle';
import React, { memo } from 'react';
import { cn } from '@/lib/utils';
import { siteConfig, siteUrls, skills as siteSkills } from '@/data/site-config';
import { IconType } from 'react-icons';

// Map icon names from config to actual icon components
const iconMap: Record<string, IconType> = {
  SiArcgis,
  SiQgis,
  SiOpenlayers,
  SiLeaflet,
  SiPython,
  SiJavascript,
  SiTypescript,
  SiAngular,
  SiPostgresql: BiLogoPostgresql,
  BiLogoPostgresql,
  SiGit,
  SiDocker,
  SiKubernetes,
  SiArgo,
  SiApacheairflow,
  SiOsgeo,
};

// Memoize skills array to prevent re-creation on every render
const skills = siteSkills.map((skill) => ({
  text: skill.text,
  Icon: iconMap[skill.icon] || SiGit,
}));

const HeroSection = memo(function HeroSection() {
  // ponytail: entrance animations are CSS (tailwindcss-animate), not JS — the hero
  // is above the fold, so it must paint before hydration. `enter` = the shared
  // fade-up; `delay-*` staggers it the way framer's staggerChildren used to.
  const enter = 'animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out fill-mode-both';

  return (
    <header className="relative flex min-h-[500px] sm:min-h-[600px] max-h-[900px] h-screen w-full flex-col items-center justify-center bg-white dark:bg-black overflow-hidden pb-14 sm:pb-16 md:pb-20">
      {/* Grid background */}
      <div
        className={cn(
          'absolute inset-0',
          '[background-size:20px_20px]',
          '[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]',
          'dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]',
        )}
      />
      {/* Radial gradient for the container to give a faded look */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>

      <div className="mx-auto max-w-full px-3 sm:px-5 py-2 sm:py-4 md:py-8 lg:py-4 text-left flex flex-col lg:flex-row items-center justify-between relative z-10 flex-1">
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start lg:pl-8 order-2 lg:order-1">
          <div className={cn(enter, 'delay-300')}>
            <TypeAnimation
              className="text-xl sm:text-2xl md:text-3xl font-bold text-[#2b55ff] dark:text-[#4b6fff] relative z-10"
              sequence={siteConfig.greetings}
            />
          </div>

          <h1
            className={cn(
              enter,
              'delay-500 text-xl sm:text-2xl font-heading md:text-3xl lg:text-5xl mt-2 sm:mt-3 md:mt-5 text-center lg:text-left',
            )}
          >
            I&#39;m {siteConfig.name}. 👋
          </h1>

          <p
            className={cn(
              enter,
              'delay-700 my-3 sm:my-5 md:my-6 lg:my-8 text-sm sm:text-base md:text-lg lg:text-xl font-normal leading-relaxed lg:leading-relaxed text-center lg:text-left max-w-2xl lg:max-w-xl',
            )}
          >
            {siteConfig.bio}
          </p>

          <div className="flex flex-col items-center lg:items-start mb-6 md:mb-8 w-full">
            <div
              className={cn(enter, 'delay-1000 flex space-x-4 sm:space-x-6 mb-4 sm:mb-5 md:mb-6')}
            >
              <a
                href={siteUrls.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile"
                className="hover:animate-wiggle"
              >
                <FaGithub className="text-2xl sm:text-3xl md:text-4xl text-gray-800 dark:text-white hover:opacity-70 transition-opacity duration-300" />
              </a>
              <a
                href={siteUrls.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile"
                className="hover:animate-wiggle"
              >
                <FaLinkedin className="text-2xl sm:text-3xl md:text-4xl text-gray-800 dark:text-white hover:opacity-70 transition-opacity duration-300" />
              </a>
            </div>

            {/* Contact button with proper spacing for mobile */}
            <div
              className={cn(
                'animate-in fade-in zoom-in-95 duration-500 fill-mode-both delay-[1500ms]',
                'relative z-10 mt-2 active:scale-95 transition-transform',
              )}
            >
              <DialogComponent
                triggerButtonText="Get in Touch!"
                dialogTitle="Get in Touch"
                dialogDescription="Please fill out the form below to get in touch with me."
                inputLabels={{ name: 'Name', email: 'Email', message: 'Message' }}
                buttonClassName="h-10 text-base font-heading md:h-12 md:text-lg lg:h-14 lg:text-xl"
              />
            </div>

            {/* Chatbot button - positioned below Get in Touch on mobile, right corner on desktop */}
            <div className="animate-in fade-in zoom-in-95 duration-500 fill-mode-both delay-[1500ms] relative z-10 mt-4 lg:hidden">
              <ChatbotToggle />
            </div>
          </div>
        </div>

        <div
          className={cn(
            enter,
            'delay-150 w-full lg:w-1/2 mt-2 lg:mt-0 flex justify-center lg:justify-end order-1 lg:order-2',
          )}
        >
          <Image
            src={ronitImage}
            alt={siteConfig.name}
            priority // This is above the fold, so load it immediately
            width={400}
            height={400}
            sizes="(max-width: 480px) 180px, (max-width: 640px) 220px, (max-width: 768px) 280px, (max-width: 1024px) 350px, 450px"
            className="w-auto h-auto max-w-[180px] sm:max-w-[220px] md:max-w-[300px] lg:max-w-[400px] xl:max-w-[450px]"
            // ponytail: no blur placeholder — this is a transparent cutout, so the
            // generated thumbnail paints a dark smear where there should be nothing.
            // `priority` already preloads it.
          />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full z-0 animate-in slide-in-from-bottom-[100px] duration-700 fill-mode-both delay-1000">
        <Marquee
          className="border-t-border dark:border-t-darkBorder dark:bg-secondaryBlack border-t-2 border-b-2 border-b-border dark:border-b-darkBorder bg-white py-2 sm:py-3 lg:py-5 font-base"
          direction="left"
          speed={70}
          loop={0}
          gradientWidth={50}
        >
          {' '}
          {skills.map((skill, id) => (
            <div
              className="flex items-center mx-4 sm:mx-6 lg:mx-8 hover:scale-110 transition-transform duration-200"
              key={id}
            >
              <skill.Icon className="text-2xl sm:text-3xl lg:text-4xl mr-2 sm:mr-3" />
              <span className="text-lg sm:text-xl lg:text-2xl font-heading">{skill.text}</span>
            </div>
          ))}
        </Marquee>
      </div>

      {/* Chatbot positioned above the marquee in bottom-right corner on desktop */}
      <div className="hidden lg:block absolute bottom-20 right-4 z-10 xl:bottom-24 animate-in fade-in zoom-in-95 duration-500 fill-mode-both delay-[1500ms]">
        <ChatbotToggle />
      </div>
    </header>
  );
});

export default HeroSection;
