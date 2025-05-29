import React from 'react';
import { ExternalLink, Github } from 'lucide-react';
import digipinImage from '../media/digipin.jpeg';
import qgisHubImage from '../media/QGIS-Banner.jpg';
import olBenchImage from '../media/olBench.png';
import Image from 'next/image';

const ProjectsShowcase = () => {
  const projects = [
    {
      title: 'Digipin',
      description:
        'Search for the DIGIPIN for your location. This app demonstrates how to use the Digital Postal Index Number (DIGIPIN) by the Department of Posts in India, aiming to simplify geo-coded addressing for public and private services.',
      tech: ['Openlayers', 'Next.js', 'TypeScript', 'Tailwind CSS'],
      github: 'https://github.com/ronitjadhav/digipin-openlayers',
      live: 'https://digipin.maplabs.tech',
      image: digipinImage, // Ensure this path is correct
    },
    {
      title: 'QGIS Hub Plugin',
      description:
        'Developed at Camptocamp with help from Ismail Sunni, this plugin allows QGIS users to easily browse and add resources from the QGIS Hub directly into their projects. It supports grid and list views, search, and filtering by resource type.',
      tech: ['Python', 'Qt', 'QGIS'],
      github: 'https://github.com/qgis/QGIS-Hub-Plugin',
      live: 'https://plugins.qgis.org/plugins/qgis_hub_plugin/',
      image: qgisHubImage,
    },
    {
      title: 'Openlayers Benchmark',
      description:
        'Developed at Camptocamp as part of my internship, this project helps to benchmark the performance of WebGL and Canvas rendering in Openlayers. It includes a variety of tests and visualizations to compare the rendering speed of different layers.',
      tech: ['Openlayers', 'TypeScript'],
      github: 'https://github.com/openlayers/bench',
      live: 'https://openlayers.org/bench/',
      image: olBenchImage,
    },
  ];

  return (
    <div className="w-full p-8 bg-bg dark:bg-darkBg">
      <div
        className="w-full bg-bg border-4 border-black dark:bg-darkBg
                          shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
                          transform hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]
                          transition-all duration-300 p-6 mb-10"
      >
        <h1 className="text-4xl md:text-5xl font-black text-black text-center dark:text-darkText">
          Projects I&#39;ve Worked On 🚀
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <div
            key={project.title}
            className="group bg-bg p-6 rounded-lg transform transition-transform hover:scale-105 dark:bg-darkBg"
            style={{
              border: '3px solid black',
              boxShadow: '8px 8px 0px 0px #000000',
            }}
          >
            <div className="relative mb-4 overflow-hidden rounded-lg h-48 w-full">
              <Image
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover transition-transform group-hover:scale-110"
                width={600}
                height={400}
              />
            </div>

            <h3 className="text-2xl font-bold mb-2 transform">{project.title}</h3>

            <p className="text-text dark:text-darkText mb-4">{project.description}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {project.tech.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 text-sm font-semibold bg-yellow-300 dark:text-black"
                  style={{
                    border: '2px solid black',
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="flex gap-4">
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-blue-400 text-black font-bold transform transition-transform hover:-translate-y-1 hover:shadow-lg dark:text-black"
                style={{
                  border: '2px solid black',
                  boxShadow: '4px 4px 0px 0px #000000',
                }}
              >
                <Github size={20} />
                Code
              </a>
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-green-400 text-black font-bold transform transition-transform hover:-translate-y-1 hover:shadow-lg dark:text-black"
                style={{
                  border: '2px solid black',
                  boxShadow: '4px 4px 0px 0px #000000',
                }}
              >
                <ExternalLink size={20} />
                Live Demo
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsShowcase;
