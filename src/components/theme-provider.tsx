'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes';

import * as React from 'react';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider defaultTheme="light" enableSystem={false} {...props}>
      {children}
    </NextThemesProvider>
  );
}
