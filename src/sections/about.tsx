'use client';

import React from 'react';

import Character1 from '@/media/svgs/Character1.svg';
import Character2 from '@/media/svgs/Character2.svg';
import Character3 from '@/media/svgs/Character3.svg';
import Character4 from '@/media/svgs/Character4.svg';
import { InfoCardsContainer } from './info-card';
import type { InfoCardProps } from './info-card'; // Make sure to export this type from info-card.tsx

export default function About() {
  const cards: InfoCardProps[] = [
    {
      title: 'About Me',
      description:
        "I'm currently working as a Geospatial Software Engineer at Camptocamp, where I specialize in geospatial software development.",
      imageSrc: Character1,
      imageAlt: 'Character1',
      bgColor: 'bg-white dark:bg-secondaryBlack',
      imagePosition: 'right' as const, // Use type assertion to specify literal type
    },
    {
      title: 'Geospatial Development',
      description:
        'I thrive on continuously learning various geospatial technologies, from GIS software to spatial databases, to shape ideas into functional applications.',
      imageSrc: Character2,
      imageAlt: 'Character2',
      bgColor: 'bg-white dark:bg-secondaryBlack',
      imagePosition: 'left' as const,
    },
    {
      title: 'Interest in Technology',
      description:
        'Technology has fascinated me since I was young, especially the joy of building things. Combining tech with hands-on creation has always felt just right for me.',
      imageSrc: Character3,
      imageAlt: 'Character3',
      bgColor: 'bg-white dark:bg-secondaryBlack',
      imagePosition: 'right' as const,
    },
    {
      title: 'Other Hobbies',
      description:
        'Here are some of my other passions: I like to dance, play chess, love watching F1, and am a Potterhead.',
      imageSrc: Character4,
      imageAlt: 'Character4',
      bgColor: 'bg-white dark:bg-secondaryBlack',
      imagePosition: 'left' as const,
    },
  ];

  return (
    <div className="w-full py-16 bg-white dark:bg-secondaryBlack">
      <div className="mx-auto max-w-full px-5 py-8 md:py-12 text-left">
        <InfoCardsContainer cards={cards} />
      </div>
    </div>
  );
}
