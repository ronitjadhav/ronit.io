/**
 * ============================================================
 * SITE CONFIGURATION
 * ============================================================
 * This is the central configuration file for the entire website.
 * To customize this site for your own use, update the values below.
 *
 * See CUSTOMIZATION.md in the project root for a detailed guide.
 * ============================================================
 */

// ---------------------
// Personal Information
// ---------------------

export const siteConfig = {
  /** Your full name */
  name: 'Ronit Jadhav',

  /** Your job title / tagline shown in hero and SEO */
  jobTitle: 'Geospatial Developer & Software Engineer',

  /** Short bio displayed in the hero section */
  bio: "Based in Germany, I'm a Geospatial Developer and a Software Engineer. I love to work with maps, data, and code. I'm passionate about open-source, web technologies, and building cool stuff.",

  /** Your country / location */
  location: 'Germany',

  /** Your email address */
  email: 'hi@ronit.io',

  /** Greeting sequence for the hero typing animation ([text, delay, text, delay, ...]) */
  greetings: ['Hello!', 1000, 'Hola!', 1000, 'Bonjour!', 1000, 'Namaste!', 1000] as (
    | string
    | number
  )[],
};

// ---------------------
// URLs & Social Links
// ---------------------

export const siteUrls = {
  /** Base URL of the deployed site (no trailing slash) */
  baseUrl: 'https://ronitjadhav.github.io/ronit.io',

  /** Your GitHub profile URL */
  github: 'https://github.com/ronitjadhav',

  /** Your LinkedIn profile URL */
  linkedin: 'https://www.linkedin.com/in/ronitjadhav/',

  /** Your Twitter/X handle (with @) — used in SEO meta tags */
  twitterHandle: '@ronitjadhav',

  /** Your blog URL (shown in navbar & footer) */
  blog: 'https://dev.to/ronitjadhav',
};

// ---------------------
// Navigation Links
// ---------------------

export interface NavLink {
  href: string;
  label: string;
}

export const navLinks: NavLink[] = [
  { href: '#home', label: 'Home' },
  { href: '#journey', label: 'Journey' },
  { href: '#projects', label: 'Projects' },
  { href: siteUrls.blog, label: 'Blogs' },
];

// ---------------------
// Skills (Hero Marquee & Features Section)
// ---------------------

export interface Skill {
  /** Display name */
  text: string;
  /**
   * Icon identifier — one of the react-icons keys.
   * The component maps this string to an actual icon.
   * Supported values: 'SiArcgis', 'SiQgis', 'SiOpenlayers', 'SiLeaflet',
   * 'SiPython', 'SiJavascript', 'SiTypescript', 'SiAngular',
   * 'SiPostgresql', 'SiGit', 'SiDocker', 'SiKubernetes',
   * 'SiArgo', 'SiApacheairflow', 'SiOsgeo'
   */
  icon: string;
}

export const skills: Skill[] = [
  { text: 'ArcGIS', icon: 'SiArcgis' },
  { text: 'QGIS', icon: 'SiQgis' },
  { text: 'Docker', icon: 'SiDocker' },
  { text: 'OpenLayers', icon: 'SiOpenlayers' },
  { text: 'Leaflet', icon: 'SiLeaflet' },
  { text: 'Kubernetes', icon: 'SiKubernetes' },
  { text: 'Argo CD', icon: 'SiArgo' },
  { text: 'Apache Airflow', icon: 'SiApacheairflow' },
  { text: 'GeoServer', icon: 'SiOsgeo' },
  { text: 'Python', icon: 'SiPython' },
  { text: 'JavaScript', icon: 'SiJavascript' },
  { text: 'TypeScript', icon: 'SiTypescript' },
  { text: 'Angular', icon: 'SiAngular' },
  { text: 'PostGIS', icon: 'SiPostgresql' },
  { text: 'Version Control', icon: 'SiGit' },
];

// ---------------------
// Projects
// ---------------------

export interface Project {
  title: string;
  description: string;
  /** List of technology names shown as badges */
  tech: string[];
  /** GitHub repository URL */
  github: string;
  /** Live demo URL */
  live: string;
  /**
   * Image filename inside src/media/ (e.g. 'digipin.jpeg').
   * You must also add the actual image file to that folder.
   * The component will import it dynamically.
   */
  image: string;
}

export const projects: Project[] = [
  {
    title: 'Digipin',
    description:
      'Search for the DIGIPIN for your location. This app demonstrates how to use the Digital Postal Index Number (DIGIPIN) by the Department of Posts in India, aiming to simplify geo-coded addressing for public and private services.',
    tech: ['Openlayers', 'Next.js', 'TypeScript', 'Tailwind CSS'],
    github: 'https://github.com/ronitjadhav/digipin-openlayers',
    live: 'https://digipin.maplabs.tech',
    image: 'digipin.jpeg',
  },
  {
    title: 'QGIS Hub Plugin',
    description:
      'Developed at Camptocamp with help from Ismail Sunni, this plugin allows QGIS users to easily browse and add resources from the QGIS Hub directly into their projects. It supports grid and list views, search, and filtering by resource type.',
    tech: ['Python', 'Qt', 'QGIS'],
    github: 'https://github.com/qgis/QGIS-Hub-Plugin',
    live: 'https://plugins.qgis.org/plugins/qgis_hub_plugin/',
    image: 'QGIS-Banner.jpg',
  },
  {
    title: 'Openlayers Benchmark',
    description:
      'Developed at Camptocamp as part of my internship, this project helps to benchmark the performance of WebGL and Canvas rendering in Openlayers. It includes a variety of tests and visualizations to compare the rendering speed of different layers.',
    tech: ['Openlayers', 'TypeScript'],
    github: 'https://github.com/openlayers/bench',
    live: 'https://openlayers.org/bench/',
    image: 'olBench.png',
  },
];

// ---------------------
// About Me Cards
// ---------------------

export interface AboutCard {
  title: string;
  description: string;
  /** SVG filename inside src/media/svgs/ (e.g. 'Character1.svg') */
  image: string;
  imageAlt: string;
  imagePosition: 'left' | 'right';
}

export const aboutCards: AboutCard[] = [
  {
    title: 'About Me',
    description:
      "I'm currently working as a Geospatial Software Engineer at Camptocamp, where I specialize in geospatial software development.",
    image: 'Character1.svg',
    imageAlt: 'Character1',
    imagePosition: 'right',
  },
  {
    title: 'Geospatial Development',
    description:
      'I thrive on continuously learning various geospatial technologies, from GIS software to spatial databases, to shape ideas into functional applications.',
    image: 'Character2.svg',
    imageAlt: 'Character2',
    imagePosition: 'left',
  },
  {
    title: 'Interest in Technology',
    description:
      'Technology has fascinated me since I was young, especially the joy of building things. Combining tech with hands-on creation has always felt just right for me.',
    image: 'Character3.svg',
    imageAlt: 'Character3',
    imagePosition: 'right',
  },
  {
    title: 'Other Hobbies',
    description:
      'Here are some of my other passions: I like to dance, play chess, love watching F1, and am a Potterhead.',
    image: 'Character4.svg',
    imageAlt: 'Character4',
    imagePosition: 'left',
  },
];

// ---------------------
// Journey Timeline
// ---------------------

export interface TimelineEntry {
  id: number;
  title: string;
  date: string;
  description: string;
  /** [longitude, latitude] */
  location: [number, number];
  locationName: string;
  popupTitle: string;
  popupDescription: string;
}

export const timelineData: TimelineEntry[] = [
  {
    id: 1,
    title: 'Software Engineer @ Camptocamp',
    date: 'Oct 2023 - Present',
    description:
      'Kicked off my journey into the open-source geospatial realm at Camptocamp, working with QGIS, Geonetwork-UI, developing custom GIS dashboards, and contributing to QGIS plugins. Diving into Docker, web GIS, and everything open-source!',
    location: [13.427683548268714, 52.499819181584776],
    locationName: 'Berlin, Germany (Hybrid)',
    popupTitle: 'Camptocamp',
    popupDescription:
      'Became part of the open-source geospatial world, building geospatial solutions and exploring the power of QGIS.',
  },
  {
    id: 2,
    title: 'Software Engineering for Industrial Applications @ Hochschule Hof',
    date: '2022 - 2024',
    description:
      'Diving deep into advanced programming, software engineering, and IoT, while focusing on Industry 4.0. Gaining expertise in applied cloud computing, non-relational databases, and spatial technologies to bridge software and the real world.',
    location: [11.941048555260455, 50.325469419408954],
    locationName: 'Hof, Germany',
    popupTitle: 'Hochschule Hof',
    popupDescription:
      'Expanding my skillset in software engineering, focusing on Industry 4.0, cloud computing, and real-world applications.',
  },
  {
    id: 3,
    title: 'GIS Developer @ Gistec',
    date: '2019 - 2022',
    description:
      'Joined Gistec to create custom geoprocessing tools, work with ArcGIS Enterprise, and develop web mapping apps with Esri tech. Basically, a geospatial problem-solver.',
    location: [78.39265742273773, 17.489373568497363],
    locationName: 'Hyderabad, India',
    popupTitle: 'Gistec',
    popupDescription:
      'Built mapping tools and apps while mastering Python (ArcPy), ArcGIS Server, and the Esri stack.',
  },
  {
    id: 4,
    title: 'Student Intern @ University of Cologne',
    date: '2019 - 2019',
    description:
      'Interned at the University of Cologne, applying GIS and spatial analysis to hydrological modeling with ArcSWAT for the Mula-Mutha river. Automated tasks using Python and supported geospatial research for water resources.',
    location: [6.936245553273681, 50.92747527039799],
    locationName: 'Cologne, Germany',
    popupTitle: 'University of Cologne',
    popupDescription:
      "Leveraged GIS and spatial data to contribute to water flux modeling and the SWAT tool's application in India.",
  },
  {
    id: 5,
    title: 'M.Sc. in Geoinformatics: The Spatial Awakening',
    date: '2017 - 2019',
    description:
      'Learned to wield GIS, remote sensing, and code like a spatial wizard. Maps and code—what could go wrong?',
    location: [73.85215058309475, 18.460275536163216],
    locationName: 'Pune, India',
    popupTitle: 'BVIEER',
    popupDescription:
      'Where I discovered that geography is more than just knowing where places are.',
  },
];

// ---------------------
// SEO & Metadata
// ---------------------

export const seoConfig = {
  /** Default page title */
  title: 'Ronit Jadhav - Geospatial Developer & Software Engineer',

  /** Title template for sub-pages (%s is replaced by the page title) */
  titleTemplate: '%s | Ronit Jadhav',

  /** Meta description */
  description:
    "Based in Germany, I'm a Geospatial Developer and Software Engineer specializing in maps, data visualization, and web technologies. Expert in ArcGIS, QGIS, OpenLayers, Python, and JavaScript.",

  /** SEO keywords */
  keywords: [
    'Geospatial Developer',
    'Software Engineer',
    'Germany',
    'ArcGIS',
    'QGIS',
    'OpenLayers',
    'Leaflet',
    'Python',
    'JavaScript',
    'TypeScript',
    'React',
    'Next.js',
    'PostGIS',
    'GIS',
    'Web Development',
    'Data Visualization',
    'Maps',
    'Cartography',
    'Remote Sensing',
  ],

  /** Open Graph image URL (absolute URL) */
  ogImage: 'https://ronitjadhav.github.io/ronit.io/ronit.png',

  /** Site name for Open Graph */
  siteName: 'Ronit Jadhav Portfolio',

  /** Google Verification code (optional) */
  googleVerification: 'your-google-verification-code',
};

// ---------------------
// Footer
// ---------------------

export const footerConfig = {
  /** Left-side copyright text — {year} will be replaced at runtime */
  copyrightText: '{name} | Built with ❤ & ☕',

  /** Right-side tech badge text */
  techBadge: '</> with Next.js + Tailwind',
};
