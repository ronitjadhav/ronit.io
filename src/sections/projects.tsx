'use client';

import React, { useState } from 'react';
import { ArrowSquareOut, Article, CaretDown } from '@phosphor-icons/react/ssr';
import { FaGithub } from 'react-icons/fa';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { projects } from '@/data/site-config';

// Button text for the `live` link, by host. Anything else is a demo.
const LIVE_LABELS: Record<string, string> = {
  'pypi.org': 'PyPI',
  'plugins.qgis.org': 'QGIS Plugin',
};

// Cover colours, in turn. With four, no two neighbours share one in one, two
// or three columns.
const COVERS = ['bg-main', 'bg-yellow-300', 'bg-pink-300', 'bg-[#a5b4fc]'];

const focusRing =
  'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2';

// The site's button: hovering presses it onto its shadow.
const pressable = (color: string) =>
  cn(
    'flex h-9 items-center gap-1.5 px-3 text-sm font-bold text-black rounded-base border-2 border-black',
    'shadow-[3px_3px_0px_0px_#000] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-200',
    focusRing,
    color,
  );

const ProjectsShowcase = () => {
  const [open, setOpen] = useState<ReadonlySet<string>>(new Set());

  const toggle = (title: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (!next.delete(title)) next.add(title);
      return next;
    });

  return (
    <div className="relative w-full py-8 sm:py-12 md:py-16 p-3 sm:p-5 md:p-8 bg-white dark:bg-black">
      {/* Grid background */}
      <div
        className={cn(
          'absolute inset-0',
          'bg-size-[20px_20px]',
          'bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]',
          'dark:bg-[linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]',
        )}
      />
      {/* Radial gradient for the container to give a faded look */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white mask-[radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>

      <div className="max-w-full mx-auto px-2 sm:px-5 relative z-10">
        <div
          className="w-full bg-bg border-2 sm:border-4 border-black dark:border-darkBorder dark:bg-darkBg
                            shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
                            dark:shadow-[4px_4px_0px_0px_#555555] dark:sm:shadow-[8px_8px_0px_0px_#555555]
                            transform hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[12px_12px_0px_0px_#555555]
                            transition-all duration-300 p-3 sm:p-4 md:p-6 mb-6 sm:mb-10"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-black text-center dark:text-darkText">
            Projects I&#39;ve Worked On
          </h2>
        </div>

        {/* Phones get a row per project, the logo beside the name; wider
            screens a grid of cards. `items-start`: an open card grows on its
            own, its neighbours keep their height. */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 items-start">
          {projects.map((project, i) => {
            const isOpen = open.has(project.title);
            const detailsId = `project-details-${i}`;
            return (
              <article
                key={project.title}
                aria-labelledby={`project-title-${i}`}
                className="group overflow-hidden rounded-lg bg-bg dark:bg-darkBg
                  border-[3px] border-black dark:border-darkBorder
                  shadow-[6px_6px_0px_0px_#000000] dark:shadow-[6px_6px_0px_0px_#555555]"
              >
                {/* Phones: the tile beside the name, the links below both. From sm
                    the links move up beside the tile too; from md the tile becomes
                    a band across the top of the card. */}
                <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 sm:gap-x-4 p-4 md:block md:p-0">
                  {/* The thumbnail as a sticker. Shown whole: logos range
                      from square marks to 6:1 wordmarks. */}
                  <div
                    className={cn(
                      'relative flex items-center justify-center self-start sm:row-span-2',
                      'w-28 sm:w-36 aspect-[4/3] rounded-md border-2 border-black',
                      'md:w-auto md:aspect-[2/1] md:rounded-none md:border-0 md:border-b-[3px]',
                      COVERS[i % COVERS.length],
                    )}
                  >
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-[radial-gradient(#0000002e_1px,transparent_1.5px)] bg-size-[14px_14px]"
                    />
                    <div
                      className={cn(
                        'relative w-[78%] md:w-[62%] aspect-video overflow-hidden rounded-md border-2 border-black bg-white',
                        'shadow-[2px_2px_0px_0px_#000] md:shadow-[4px_4px_0px_0px_#000]',
                        'transition-transform duration-300 group-hover:scale-105',
                      )}
                    >
                      <Image src={project.image} alt="" className="size-full object-contain" />
                    </div>
                  </div>

                  <div className="min-w-0 md:px-4 md:pt-4 xl:px-5 xl:pt-5">
                    <h3
                      id={`project-title-${i}`}
                      className="text-lg xl:text-xl font-black leading-tight text-black dark:text-darkText"
                    >
                      {project.title}
                    </h3>
                    {/* Two lines kept free, so the cards in a row line up */}
                    <p className="mt-1.5 md:min-h-[2lh] text-sm xl:text-base">{project.summary}</p>
                  </div>

                  <div className="col-span-2 mt-4 sm:col-span-1 sm:col-start-2 sm:mt-3 md:mt-0 flex flex-wrap items-center gap-2.5 md:p-4 xl:p-5">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={pressable('bg-white')}
                    >
                      <FaGithub size={16} />
                      Code
                    </a>
                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={pressable('bg-main')}
                      >
                        <ArrowSquareOut size={16} weight="bold" />
                        {LIVE_LABELS[new URL(project.live).hostname] ?? 'Live Demo'}
                      </a>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={detailsId}
                  onClick={() => toggle(project.title)}
                  className={cn(
                    'flex w-full items-center justify-between px-4 xl:px-5 py-2.5 text-sm font-bold',
                    'border-t-[3px] border-black dark:border-darkBorder transition-colors',
                    'hover:bg-yellow-300 hover:text-black focus-visible:outline-hidden focus-visible:bg-yellow-300 focus-visible:text-black',
                    isOpen && 'bg-yellow-300 text-black',
                  )}
                >
                  <span>
                    Details<span className="sr-only"> about {project.title}</span>
                  </span>
                  <CaretDown
                    size={16}
                    weight="bold"
                    className={cn('transition-transform duration-300', isOpen && 'rotate-180')}
                  />
                </button>

                {/* Animates open by growing the grid row from 0fr to 1fr.
                    `inert` keeps the closed links out of the tab order. */}
                <div
                  id={detailsId}
                  inert={!isOpen}
                  className={cn(
                    'grid transition-[grid-template-rows] duration-300 ease-out',
                    isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                  )}
                >
                  <div className="min-h-0 overflow-hidden">
                    <div className="space-y-4 border-t-2 border-dashed border-black/40 dark:border-white/30 p-4 xl:p-5">
                      <p className="text-sm xl:text-base">{project.description}</p>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                          Built with
                        </p>
                        <ul className="mt-2 flex flex-wrap gap-1.5">
                          {project.tech.map((t) => (
                            <li
                              key={t}
                              className="rounded-base border-2 border-black bg-yellow-300 px-2 py-0.5 text-xs font-bold text-black"
                            >
                              {t}
                            </li>
                          ))}
                        </ul>
                      </div>
                      {project.post && (
                        <a
                          href={project.post}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(pressable('bg-pink-300'), 'w-fit')}
                        >
                          <Article size={16} weight="bold" />
                          Read the post
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProjectsShowcase;
