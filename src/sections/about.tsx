'use client';

import React from 'react';

import Character1 from '@/media/svgs/Character1.svg';
import Character2 from '@/media/svgs/Character2.svg';
import Character3 from '@/media/svgs/Character3.svg';
import Character4 from '@/media/svgs/Character4.svg';
import { InfoCardsContainer } from './info-card';
import type { InfoCardProps } from './info-card';
import { aboutCards as aboutCardsConfig } from '@/data/site-config';
import { StaticImageData } from 'next/image';

// Map SVG filenames from config to actual imported images
const imageMap: Record<string, StaticImageData> = {
  'Character1.svg': Character1,
  'Character2.svg': Character2,
  'Character3.svg': Character3,
  'Character4.svg': Character4,
};

export default function About() {
  const cards: InfoCardProps[] = aboutCardsConfig.map((card) => ({
    title: card.title,
    description: card.description,
    imageSrc: imageMap[card.image] || Character1,
    imageAlt: card.imageAlt,
    bgColor: 'bg-white dark:bg-secondaryBlack',
    imagePosition: card.imagePosition,
  }));

  return (
    <div className="w-full py-8 sm:py-12 md:py-16 bg-white dark:bg-secondaryBlack">
      <div className="mx-auto max-w-full px-3 sm:px-5 py-4 sm:py-6 md:py-12 text-left">
        <InfoCardsContainer cards={cards} />
      </div>
    </div>
  );
}
