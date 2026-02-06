import {
  SiAngular,
  SiArcgis,
  SiDocker,
  SiGit,
  SiHtml5,
  SiJavascript,
  SiLeaflet,
  SiOpenlayers,
  SiPostgresql,
  SiPython,
  SiQgis,
  SiTypescript,
} from 'react-icons/si';
import { IconType } from 'react-icons';
import { skills as siteSkills } from '@/data/site-config';

// Map icon names from config to actual icon components
const iconMap: Record<string, IconType> = {
  SiArcgis,
  SiQgis,
  SiOpenlayers,
  SiLeaflet,
  SiPython,
  SiJavascript,
  SiHtml5,
  SiTypescript,
  SiAngular,
  SiPostgresql,
  SiGit,
  SiDocker,
};

export default function Features() {
  const skills = siteSkills.map((skill) => ({
    text: skill.text,
    Icon: iconMap[skill.icon] || SiGit,
  }));

  return (
    <div>
      <section className="border-t-border dark:border-t-darkBorder dark:bg-darkBg border-t-2 bg-bg py-10 sm:py-14 md:py-20 font-base lg:py-[100px]">
        <h2 className="mb-8 sm:mb-10 md:mb-14 px-3 sm:px-5 text-center text-xl sm:text-2xl font-heading md:text-3xl lg:mb-20 lg:text-4xl">
          Skills and Technologies
        </h2>

        <div className="mx-auto grid max-w-full grid-cols-1 gap-3 sm:gap-4 md:gap-5 px-3 sm:px-5 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill, i) => {
            return (
              <div
                className="border-border dark:border-darkBorder dark:bg-secondaryBlack shadow-light dark:shadow-dark flex flex-col gap-2 sm:gap-3 rounded-base border-2 bg-white p-3 sm:p-4 md:p-5"
                key={i}
              >
                <h4 className="text-base sm:text-lg md:text-xl font-heading flex items-center gap-2 sm:gap-3">
                  <skill.Icon className="text-xl sm:text-2xl" /> {/* Icon with a size */}
                  {skill.text} {/* Skill Name */}
                </h4>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
