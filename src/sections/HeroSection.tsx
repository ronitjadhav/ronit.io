'use client';
import { TypeAnimation } from 'react-type-animation';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { BiLogoPostgresql } from 'react-icons/bi';
import Marquee from 'react-fast-marquee';
import { motion } from 'framer-motion';
import ronitImage from '@/media/ronit.png';
import {
  SiAngular,
  SiArcgis,
  SiDocker,
  SiGit,
  SiHtml5,
  SiJavascript,
  SiLeaflet,
  SiOpenlayers,
  SiPython,
  SiQgis,
  SiTypescript,
} from 'react-icons/si';
import Image from 'next/image';
import { DialogComponent } from '@/components/getInTouchDialog';
import React, { memo } from 'react';

// Memoize skills array to prevent re-creation on every render
const skills = [
  { text: 'ArcGIS', Icon: SiArcgis },
  { text: 'QGIS', Icon: SiQgis },
  { text: 'OpenLayers', Icon: SiOpenlayers },
  { text: 'Leaflet', Icon: SiLeaflet },
  { text: 'Python', Icon: SiPython },
  { text: 'JavaScript', Icon: SiJavascript },
  { text: 'HTML', Icon: SiHtml5 },
  { text: 'TypeScript', Icon: SiTypescript },
  { text: 'Angular', Icon: SiAngular },
  { text: 'PostGIS', Icon: BiLogoPostgresql },
  { text: 'Version Control', Icon: SiGit },
  { text: 'Docker', Icon: SiDocker },
  { text: 'Git', Icon: SiGit },
];

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
    <header className="relative flex min-h-screen w-full flex-col items-center justify-start bg-bg dark:bg-secondaryBlack bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px] pt-20 md:pt-24 lg:pt-24 overflow-hidden pb-16 sm:pb-20">
      <motion.div
        className="mx-auto w-container max-w-full px-5 py-4 md:py-16 lg:py-20 text-left flex flex-col lg:flex-row mt-10 md:mt-0"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start lg:ml-8 order-2 lg:order-1">
          <motion.div variants={itemVariants}>
            <TypeAnimation
              className="text-2xl sm:text-3xl font-bold text-[#2b55ff] dark:text-[#4b6fff] relative z-10"
              sequence={['Hello!', 1000, 'Hola!', 1000, 'Bonjour!', 1000, 'Namaste!', 1000]}
            />
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-2xl font-heading md:text-3xl lg:text-5xl mt-3 md:mt-5"
          >
            I&#39;m Ronit Jadhav. 👋
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="my-6 md:my-8 lg:my-12 mt-4 md:mt-6 lg:mt-8 text-base md:text-lg lg:text-2xl font-normal leading-relaxed lg:leading-relaxed"
          >
            Based in Germany, I&#39;m a Geospatial Developer and a Software Engineer. I love to work
            with maps, data, and code. I&#39;m passionate about open-source, web technologies, and
            building cool stuff.
          </motion.p>

          <div className="flex flex-col items-center lg:items-start mb-6 md:mb-8">
            <motion.div className="flex space-x-6 mb-5 md:mb-6" variants={itemVariants}>
              <motion.a
                href="https://github.com/ronitjadhav"
                target="_blank"
                rel="noopener noreferrer"
                variants={socialIconVariants}
                whileHover="hover"
              >
                <FaGithub className="text-3xl md:text-4xl text-gray-800 dark:text-white hover:text-cerulean-400 transition-colors duration-300" />
              </motion.a>
              <motion.a
                href="https://www.linkedin.com/in/ronitjadhav/"
                target="_blank"
                rel="noopener noreferrer"
                variants={socialIconVariants}
                whileHover="hover"
              >
                <FaLinkedin className="text-3xl md:text-4xl text-gray-800 dark:text-white hover:text-cerulean-400 transition-colors duration-300" />
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
          </div>
        </div>

        <motion.div
          className="w-full lg:w-1/2 mt-2 lg:mt-0 flex justify-center order-1 lg:order-2"
          variants={itemVariants}
        >
          <Image
            src={ronitImage}
            alt="Ronit Jadhav"
            priority // This is above the fold, so load it immediately
            width={400}
            height={400}
            sizes="(max-width: 768px) 280px, (max-width: 1024px) 350px, 450px"
            className="w-auto h-auto max-w-[280px] sm:max-w-[320px] md:max-w-[350px] lg:max-w-[400px] lg:ml-28"
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
        >
          {skills.map((skill, id) => (
            <motion.div
              className="flex items-center mx-4 sm:mx-6 lg:mx-8"
              key={id}
              whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
            >
              <skill.Icon className="text-3xl sm:text-4xl lg:text-5xl mr-2 sm:mr-3 lg:mr-4" />
              <span className="text-lg sm:text-xl lg:text-2xl xl:text-4xl font-heading">
                {skill.text}
              </span>
            </motion.div>
          ))}
        </Marquee>
      </motion.div>
    </header>
  );
});

export default HeroSection;
