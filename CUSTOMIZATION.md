# Customization Guide

This project is designed to be easily forked and customized. All personal data is centralized in a single configuration file, so you can make this portfolio your own by editing just one file.

## Quick Start

1. **Fork** this repository
2. **Clone** your fork locally
3. Edit **`src/data/site-config.ts`** with your personal data
4. Replace images in **`src/media/`** with your own
5. Update **`.env`** with your API keys (see [Environment Variables](#environment-variables))
6. Deploy!

---

## Site Configuration (`src/data/site-config.ts`)

This is the **single source of truth** for all personal data used across the site. Every section below corresponds to a named export in this file.

### Personal Information (`siteConfig`)

```ts
export const siteConfig = {
  name: 'Your Name',
  jobTitle: 'Your Job Title',
  bio: 'A short bio about yourself...',
  location: 'Your Country',
  email: 'you@example.com',
  greetings: ['Hello!', 1000, 'Hola!', 1000, 'Bonjour!', 1000],
};
```

| Field       | Where it appears                                                             |
| ----------- | ---------------------------------------------------------------------------- |
| `name`      | Hero section, footer copyright, SEO metadata, OG image, JSON-LD              |
| `jobTitle`  | OG image, SEO metadata                                                       |
| `bio`       | Hero section, LinkedIn preview card                                          |
| `location`  | JSON-LD schema                                                               |
| `email`     | Contact page (if used)                                                       |
| `greetings` | Hero section typing animation (alternates `[text, delay, text, delay, ...]`) |

### URLs & Social Links (`siteUrls`)

```ts
export const siteUrls = {
  baseUrl: 'https://yourdomain.com',
  github: 'https://github.com/yourusername',
  linkedin: 'https://linkedin.com/in/yourusername',
  twitterHandle: '@yourusername',
  blog: 'https://dev.to/yourusername',
};
```

| Field           | Where it appears                                    |
| --------------- | --------------------------------------------------- |
| `baseUrl`       | SEO canonical URL, sitemap, JSON-LD, schema.org     |
| `github`        | Hero section icon, footer social link               |
| `linkedin`      | Hero section icon, footer social link, preview card |
| `twitterHandle` | Twitter card meta tags                              |
| `blog`          | Navigation links (Blogs entry)                      |

### Navigation Links (`navLinks`)

```ts
export const navLinks = [
  { href: '#home', label: 'Home' },
  { href: '#journey', label: 'Journey' },
  { href: '#projects', label: 'Projects' },
  { href: 'https://dev.to/yourusername', label: 'Blogs' },
];
```

These links appear in the **navbar** (desktop & mobile) and the **footer**. External links (starting with `http`) automatically open in a new tab with an external link icon.

### Skills (`skills`)

```ts
export const skills = [
  { text: 'Python', icon: 'SiPython' },
  { text: 'JavaScript', icon: 'SiJavascript' },
  // ...
];
```

Skills appear in three places:

- **Hero section** — scrolling marquee
- **Features section** — card grid
- **Skills section** — icon grid

The `icon` field maps to [react-icons/si](https://react-icons.github.io/react-icons/icons/si/) icon names. Supported icons are listed in the config file comments. To add new icons, you'll also need to import them in the relevant component files.

### Projects (`projects`)

```ts
export const projects = [
  {
    title: 'Project Name',
    description: 'What this project does...',
    tech: ['React', 'TypeScript'],
    github: 'https://github.com/you/project',
    live: 'https://project.example.com',
    image: 'project-screenshot.png', // filename in src/media/
  },
];
```

**Adding a new project:**

1. Add the project image to `src/media/`
2. Add the project entry to the `projects` array in `site-config.ts`
3. In `src/sections/projects.tsx`, import your image and add it to the `imageMap` object:
   ```ts
   import myProjectImage from '../media/my-project.png';
   const imageMap = {
     // ...existing entries
     'my-project.png': myProjectImage,
   };
   ```

### About Cards (`aboutCards`)

```ts
export const aboutCards = [
  {
    title: 'About Me',
    description: 'Your description...',
    image: 'Character1.svg', // filename in src/media/svgs/
    imageAlt: 'Character1',
    imagePosition: 'right', // 'left' or 'right'
  },
];
```

**Replacing character images:**

1. Add your SVG files to `src/media/svgs/`
2. Update the `image` field in config
3. In `src/sections/about.tsx`, import your SVG and add it to the `imageMap` object

### Journey Timeline (`timelineData`)

```ts
export const timelineData = [
  {
    id: 1,
    title: 'Job Title @ Company',
    date: '2023 - Present',
    description: 'What you did there...',
    location: [longitude, latitude], // [lon, lat] coordinates
    locationName: 'City, Country',
    popupTitle: 'Company Name',
    popupDescription: 'Short popup text for the map marker',
  },
];
```

Each entry creates:

- A **timeline sidebar item** with title, date, description, and location
- A **map marker** at the specified coordinates with a popup

**Tip:** Use [latlong.net](https://www.latlong.net/) to find coordinates for your locations. Note the order is `[longitude, latitude]`, not `[lat, lon]`.

### SEO Configuration (`seoConfig`)

```ts
export const seoConfig = {
  title: 'Your Name - Your Title',
  titleTemplate: '%s | Your Name',
  description: 'Your meta description...',
  keywords: ['keyword1', 'keyword2'],
  ogImage: 'https://yourdomain.com/your-image.png',
  siteName: 'Your Portfolio',
  googleVerification: 'your-code',
};
```

This controls all SEO meta tags, Open Graph tags, Twitter cards, and structured data.

### Footer (`footerConfig`)

```ts
export const footerConfig = {
  copyrightText: '{name} | Built with ❤ & ☕',
  techBadge: '</> with Next.js + Tailwind',
};
```

The `{name}` placeholder is replaced with `siteConfig.name` at runtime.

---

## Images

| Image               | Location                  | Purpose                    |
| ------------------- | ------------------------- | -------------------------- |
| Profile photo       | `src/media/ronit.png`     | Hero section, preview card |
| Logo                | `src/media/ronitLogo.png` | Navbar brand               |
| Project screenshots | `src/media/*.{jpg,png}`   | Project cards              |
| Character SVGs      | `src/media/svgs/*.svg`    | About section cards        |
| Background SVG      | `public/landing-dark.svg` | Page background pattern    |

Replace these files with your own (keep the same filenames, or update the imports).

---

## Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

| Variable                                | Required         | Purpose                |
| --------------------------------------- | ---------------- | ---------------------- |
| `NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY` | For contact form | reCAPTCHA v2 site key  |
| `NEXT_PUBLIC_EMAILJS_SERVICE_ID`        | For contact form | EmailJS service ID     |
| `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`       | For contact form | EmailJS template ID    |
| `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`        | For contact form | EmailJS public key     |
| `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`       | For journey map  | Mapbox access token    |
| `NEXT_PUBLIC_MAPBOX_LIGHT_STYLE_URL`    | For journey map  | Mapbox light style URL |
| `NEXT_PUBLIC_MAPBOX_DARK_STYLE_URL`     | For journey map  | Mapbox dark style URL  |
| `GEMINI_API_KEY`                        | For chatbot      | Google Gemini API key  |

See the [README](./README.md#environment-variables) for detailed setup instructions for each service.

---

## FAQ Data (`src/data/faq-data.json`)

The chatbot uses this file for fallback FAQ responses. Update the questions, answers, personality, and context to match your background.

---

## Adding / Removing Sections

The main page layout is in `src/app/page.tsx`. Sections are imported and rendered in order:

```tsx
<HeroSection />
<MapComponent />        {/* Journey map */}
<About />
<Features />
<ProjectsShowcase />
<Footer />
```

To remove a section, simply comment out or delete its line. To add a new section, create a component in `src/sections/` and import it in `page.tsx`.

---

## Theme Customization

The neobrutalism color scheme is defined in `tailwind.config.ts`:

```ts
colors: {
  main: '#76fbd9',      // Primary accent color
  mainAccent: '#4ddbb5',
  bg: '#e0f0ff',        // Light mode background
  darkBg: '#212121',    // Dark mode background
  // ...
}
```

Modify these values to change the site's color palette.

---

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import in [Vercel](https://vercel.com)
3. Add environment variables in Project Settings
4. Deploy

### GitHub Pages

1. Update `baseUrl` in site config
2. Set `output: 'export'` in `next.config.ts`
3. Configure GitHub Pages in repo settings

### Netlify

1. Push to GitHub
2. Import in [Netlify](https://netlify.com)
3. Set build command: `npm run build`
4. Add environment variables in Site Settings
