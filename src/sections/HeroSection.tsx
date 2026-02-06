'use client';
import { TypeAnimation } from 'react-type-animation';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { BiLogoPostgresql } from 'react-icons/bi';
import Marquee from 'react-fast-marquee';
import { motion } from 'framer-motion';
import ronitImage from '@/media/ronit.png';
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
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  const socialIconVariants = {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 20,
      },
    },
    hover: {
      scale: 1.1,
      rotate: [0, -10, 10, -10, 0],
      transition: {
        duration: 0.4,
      },
    },
  };

  // Adjust buttonVariants to remove hover effects and delay appearance
  const buttonVariants = {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 20,
        delay: 1.5, // Delay the button's appearance after marquee
      },
    },
    tap: {
      scale: 0.95,
    },
  };

  const marqueeContainerVariants = {
    hidden: { y: 100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 20,
        delay: 1.2,
      },
    },
  };

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

      <motion.div
        className="mx-auto max-w-full px-3 sm:px-5 py-2 sm:py-4 md:py-8 lg:py-4 text-left flex flex-col lg:flex-row items-center justify-between relative z-10 flex-1"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start lg:pl-8 order-2 lg:order-1">
          <motion.div variants={itemVariants}>
            <TypeAnimation
              className="text-xl sm:text-2xl md:text-3xl font-bold text-[#2b55ff] dark:text-[#4b6fff] relative z-10"
              sequence={siteConfig.greetings}
            />
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-xl sm:text-2xl font-heading md:text-3xl lg:text-5xl mt-2 sm:mt-3 md:mt-5 text-center lg:text-left"
          >
            I&#39;m {siteConfig.name}. 👋
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="my-3 sm:my-5 md:my-6 lg:my-8 text-sm sm:text-base md:text-lg lg:text-xl font-normal leading-relaxed lg:leading-relaxed text-center lg:text-left max-w-2xl lg:max-w-xl"
          >
            {siteConfig.bio}
          </motion.p>

          <div className="flex flex-col items-center lg:items-start mb-6 md:mb-8 w-full">
            <motion.div
              className="flex space-x-4 sm:space-x-6 mb-4 sm:mb-5 md:mb-6"
              variants={itemVariants}
            >
              <motion.a
                href={siteUrls.github}
                target="_blank"
                rel="noopener noreferrer"
                variants={socialIconVariants}
                whileHover="hover"
              >
                <FaGithub className="text-2xl sm:text-3xl md:text-4xl text-gray-800 dark:text-white hover:text-cerulean-400 transition-colors duration-300" />
              </motion.a>
              <motion.a
                href={siteUrls.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                variants={socialIconVariants}
                whileHover="hover"
              >
                <FaLinkedin className="text-2xl sm:text-3xl md:text-4xl text-gray-800 dark:text-white hover:text-cerulean-400 transition-colors duration-300" />
              </motion.a>
            </motion.div>

            {/* Contact button with proper spacing for mobile */}
            <motion.div
              variants={buttonVariants}
              initial="hidden"
              animate="visible"
              whileTap="tap"
              className="relative z-10 mt-2"
            >
              <DialogComponent
                triggerButtonText="Get in Touch!"
                dialogTitle="Get in Touch"
                dialogDescription="Please fill out the form below to get in touch with me."
                inputLabels={{ name: 'Name', email: 'Email', message: 'Message' }}
                buttonClassName="h-10 text-base font-heading md:h-12 md:text-lg lg:h-14 lg:text-xl"
              />
            </motion.div>

            {/* Chatbot button - positioned below Get in Touch on mobile, right corner on desktop */}
            <motion.div
              variants={buttonVariants}
              initial="hidden"
              animate="visible"
              className="relative z-10 mt-4 lg:hidden"
            >
              <ChatbotToggle />
            </motion.div>
          </div>
        </div>

        <motion.div
          className="w-full lg:w-1/2 mt-2 lg:mt-0 flex justify-center lg:justify-end order-1 lg:order-2"
          variants={itemVariants}
        >
          <Image
            src={ronitImage}
            alt={siteConfig.name}
            priority // This is above the fold, so load it immediately
            width={400}
            height={400}
            sizes="(max-width: 480px) 180px, (max-width: 640px) 220px, (max-width: 768px) 280px, (max-width: 1024px) 350px, 450px"
            className="w-auto h-auto max-w-[180px] sm:max-w-[220px] md:max-w-[300px] lg:max-w-[400px] xl:max-w-[450px]"
            placeholder="blur"
          />
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-0 left-0 w-full z-0"
        variants={marqueeContainerVariants}
        initial="hidden"
        animate="visible"
      >
        <Marquee
          className="border-t-border dark:border-t-darkBorder dark:bg-secondaryBlack border-t-2 border-b-2 border-b-border dark:border-b-darkBorder bg-white py-2 sm:py-3 lg:py-5 font-base"
          direction="left"
          speed={70}
          loop={0}
          gradientWidth={50}
        >
          {' '}
          {skills.map((skill, id) => (
            <motion.div
              className="flex items-center mx-4 sm:mx-6 lg:mx-8"
              key={id}
              whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
            >
              <skill.Icon className="text-2xl sm:text-3xl lg:text-4xl mr-2 sm:mr-3" />
              <span className="text-lg sm:text-xl lg:text-2xl font-heading">{skill.text}</span>
            </motion.div>
          ))}
        </Marquee>
      </motion.div>

      {/* Chatbot positioned above the marquee in bottom-right corner on desktop */}
      <motion.div
        variants={buttonVariants}
        initial="hidden"
        animate="visible"
        className="hidden lg:block absolute bottom-20 right-4 z-10 xl:bottom-24"
      >
        <ChatbotToggle />
      </motion.div>
    </header>
  );
});

export default HeroSection;
