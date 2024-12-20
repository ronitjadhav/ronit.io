import {
    SiAngular,
    SiArcgis, SiDocker,
    SiGit,
    SiHtml5,
    SiJavascript,
    SiLeaflet,
    SiOpenlayers, SiPostgresql, SiPython, SiQgis, SiTypescript,
} from "react-icons/si";

export default function Features() {
    const skills = [
        { text: "ArcGIS", Icon: SiArcgis },
        { text: "QGIS", Icon: SiQgis },
        { text: "OpenLayers", Icon: SiOpenlayers },
        { text: "Leaflet", Icon: SiLeaflet },
        { text: "Python", Icon: SiPython },
        { text: "JavaScript", Icon: SiJavascript },
        { text: "HTML", Icon: SiHtml5 },
        { text: "TypeScript", Icon: SiTypescript },
        { text: "Angular", Icon: SiAngular },
        { text: "PostGIS", Icon: SiPostgresql },
        { text: "Version Control", Icon: SiGit },
        { text: "Docker", Icon: SiDocker },
    ];

    return (
        <div>
            <section className="border-t-border dark:border-t-darkBorder dark:bg-darkBg border-t-2 bg-bg py-20 font-base lg:py-[100px]">
                <h2 className="mb-14 px-5 text-center text-2xl font-heading md:text-3xl lg:mb-20 lg:text-4xl">
                    Skills and Technologies
                </h2>

                <div className="mx-auto grid w-container max-w-full grid-cols-1 gap-5 px-5 sm:grid-cols-2 lg:grid-cols-3">
                    {skills.map((skill, i) => {
                        return (
                            <div
                                className="border-border dark:border-darkBorder dark:bg-secondaryBlack shadow-light dark:shadow-dark flex flex-col gap-3 rounded-base border-2 bg-white p-5"
                                key={i}
                            >
                                <h4 className="text-xl font-heading flex items-center gap-3">
                                    <skill.Icon className="text-2xl" /> {/* Icon with a size */}
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