import React from 'react';
import { ExternalLink, Github } from 'lucide-react';
import digipinImage from '../media/digipin.jpeg';
import qgisHubImage from '../media/QGIS-Banner.jpg';
import olBenchImage from '../media/olBench.png';
import Image, { StaticImageData } from 'next/image';
import { cn } from '@/lib/utils';
import { projects as projectsConfig } from '@/data/site-config';

// Map image filenames from config to actual imported images
const imageMap: Record<string, StaticImageData> = {
  'digipin.jpeg': digipinImage,
  'QGIS-Banner.jpg': qgisHubImage,
  'olBench.png': olBenchImage,
};

const ProjectsShowcase = () => {
  const projects = projectsConfig.map((p) => ({
    ...p,
    image: imageMap[p.image] || digipinImage,
  }));

  return (
    <div className="relative w-full py-8 sm:py-12 md:py-16 p-3 sm:p-5 md:p-8 bg-white dark:bg-black">
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

      <div className="max-w-full mx-auto px-2 sm:px-5 relative z-10">
        <div
          className="w-full bg-bg border-2 sm:border-4 border-black dark:border-darkBorder dark:bg-darkBg
                            shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
                            dark:shadow-[4px_4px_0px_0px_#555555] dark:sm:shadow-[8px_8px_0px_0px_#555555]
                            transform hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[12px_12px_0px_0px_#555555]
                            transition-all duration-300 p-3 sm:p-4 md:p-6 mb-6 sm:mb-10"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-black text-center dark:text-darkText">
            Projects I&#39;ve Worked On 🚀
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {projects.map((project) => (
            <div
              key={project.title}
              className="group bg-bg p-3 sm:p-4 md:p-6 rounded-lg transform transition-transform hover:scale-105 dark:bg-darkBg
                border-[3px] border-black dark:border-darkBorder
                shadow-[8px_8px_0px_0px_#000000] dark:shadow-[8px_8px_0px_0px_#555555]"
            >
              <div className="relative mb-3 sm:mb-4 overflow-hidden rounded-lg h-36 sm:h-44 md:h-48 w-full">
                <Image
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  width={600}
                  height={400}
                />
              </div>

              <h3 className="text-xl sm:text-2xl font-bold mb-2 transform">{project.title}</h3>

              <p className="text-sm sm:text-base text-text dark:text-darkText mb-3 sm:mb-4">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm font-semibold bg-yellow-300 dark:text-black"
                    style={{
                      border: '2px solid black',
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 sm:gap-4">
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-400 text-black font-bold text-sm sm:text-base transform transition-transform hover:-translate-y-1 hover:shadow-lg dark:text-black
                    border-2 border-black dark:border-darkBorder
                    shadow-[4px_4px_0px_0px_#000000] dark:shadow-[4px_4px_0px_0px_#555555]"
                >
                  <Github size={18} />
                  Code
                </a>
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-green-400 text-black font-bold text-sm sm:text-base transform transition-transform hover:-translate-y-1 hover:shadow-lg dark:text-black
                    border-2 border-black dark:border-darkBorder
                    shadow-[4px_4px_0px_0px_#000000] dark:shadow-[4px_4px_0px_0px_#555555]"
                >
                  <ExternalLink size={18} />
                  Live Demo
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsShowcase;
