'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge';

type HamburgerProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export default function Hamburger(props: HamburgerProps) {
  const { isOpen, setIsOpen } = props;
  const genericHamburgerLine = `h-1 w-6 my-1 rounded-full bg-slate-900 transition ease transform duration-300`;

  return (
    <button
      type="button"
      className="group flex size-12 flex-col items-center justify-center rounded md:hidden"
      aria-label="Toggle Menu"
      onClick={() => setIsOpen(!isOpen)}
    >
      <div
        className={twMerge(
          genericHamburgerLine,
          isOpen
            ? 'translate-y-3 rotate-45 opacity-50 group-hover:opacity-100'
            : 'opacity-50 group-hover:opacity-100',
        )}
      />
      <div
        className={twMerge(
          genericHamburgerLine,
          isOpen ? 'opacity-0' : 'opacity-50 group-hover:opacity-100',
        )}
      />
      <div
        className={twMerge(
          genericHamburgerLine,
          isOpen
            ? '-translate-y-3 rotate-45 opacity-50 group-hover:opacity-100'
            : 'opacity-50 group-hover:opacity-100',
        )}
      />
    </button>
  );
}
