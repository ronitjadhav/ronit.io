'use client';

import Image, { StaticImageData } from 'next/image';
import React, { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'framer-motion';
import { H3, P } from '@/components/ui/typography';

export type InfoCardProps = {
  title: string;
  description: string;
  imageSrc: string | StaticImageData;
  imageAlt: string;
  bgColor: string;
  imagePosition: 'left' | 'right';
};

export function InfoCardsContainer({ cards }: { cards: InfoCardProps[] }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full py-10">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="relative"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.div
                className="absolute inset-0 -m-4 bg-gradient-to-r from-green-500/20 via-blue-500/20 to-purple-500/20 dark:from-green-500/10 dark:via-blue-500/10 dark:to-purple-500/10 rounded-2xl blur-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.2 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.2, delay: 0.1 },
                }}
              />
            )}
          </AnimatePresence>
          <InfoCard {...card} isHovered={hoveredIndex === idx} />
        </div>
      ))}
    </div>
  );
}

function InfoCard(props: InfoCardProps & { isHovered: boolean }) {
  const { title, description, imageSrc, imageAlt, bgColor, imagePosition } = props;

  const infoCardClass = twMerge(
    'relative flex flex-col-reverse md:flex-row w-full max-w-[720px] min-h-[300px] items-center gap-6 md:gap-12 rounded-lg border-2 border-slate-900 px-6 py-8 shadow-light dark:shadow-gray-500 dark:border-gray-500 z-10',
    imagePosition === 'left' ? 'md:flex-row-reverse' : 'md:flex-row',
    bgColor,
  );

  const infoTextContainerClass = 'flex-grow w-full';
  const imageContainerClass = twMerge(
    'md:w-2/5 w-full flex-shrink-0 flex justify-center items-center',
    imagePosition === 'left' ? 'md:ml-6' : 'md:mr-6',
  );

  const cardVariants = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    hover: {
      scale: 1.02,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
  };

  const imageVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { delay: 0.2 } },
    hover: {
      scale: 1.05,
      rotate: [0, -2, 2, -2, 0],
      transition: {
        scale: { duration: 0.3, ease: 'easeOut' },
        rotate: {
          duration: 1.5,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'reverse',
        },
      },
    },
  };

  const textVariants = {
    initial: { x: imagePosition === 'left' ? -20 : 20, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { delay: 0.3 } },
    hover: {
      x: imagePosition === 'left' ? -5 : 5,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
  };

  return (
    <motion.div
      className={infoCardClass}
      initial="initial"
      animate="animate"
      variants={cardVariants}
      whileHover="hover"
    >
      {/* Text Section */}
      <motion.div className={infoTextContainerClass} variants={textVariants}>
        <H3>{title}</H3>
        <P>{description}</P>
      </motion.div>

      {/* Image Section */}
      <motion.div className={imageContainerClass} variants={imageVariants}>
        <Image
          src={imageSrc}
          alt={imageAlt}
          className="object-contain w-48 h-48 md:w-64 md:h-64"
          width={256}
          height={256}
        />
      </motion.div>
    </motion.div>
  );
}
