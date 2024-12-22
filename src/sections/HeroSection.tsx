'use client'
import { Button } from '@/components/ui/button'
import { TypeAnimation } from 'react-type-animation'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { BiLogoPostgresql } from "react-icons/bi"
import Marquee from "react-fast-marquee"
import { motion } from 'framer-motion'
import {
    SiAngular,
    SiArcgis, SiDocker, SiGit,
    SiHtml5,
    SiJavascript,
    SiLeaflet,
    SiOpenlayers,
    SiPython,
    SiQgis,
    SiTypescript
} from "react-icons/si"
import Image from 'next/image';

export default function HeroSection() {
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
        { text: "PostGIS", Icon: BiLogoPostgresql },
        { text: "Version Control", Icon: SiGit },
        { text: "Docker", Icon: SiDocker },
    ]

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3,
            }
        }
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    }

    const socialIconVariants = {
        hidden: { scale: 0 },
        visible: {
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 260,
                damping: 20
            }
        },
        hover: {
            scale: 1.1,
            rotate: [0, -10, 10, -10, 0],
            transition: {
                duration: 0.4
            }
        }
    }

    // Adjust buttonVariants to remove hover effects and delay appearance
    const buttonVariants = {
        hidden: { scale: 0 },
        visible: {
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 1.5  // Delay the button's appearance after marquee
            }
        },
        tap: {
            scale: 0.95
        }
    }

    const marqueeContainerVariants = {
        hidden: { y: 100, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 20,
                delay: 1.2
            }
        }
    }

    return (
        <header className="relative flex min-h-[100vh] w-full flex-col items-center justify-center bg-bg dark:bg-secondaryBlack bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px]">
            <motion.div
                className="mx-auto w-container max-w-full px-5 py-[110px] text-left lg:py-[150px] flex flex-col lg:flex-row"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start">
                    <motion.div variants={itemVariants}>
                        <TypeAnimation
                            className="text-3xl lg:text-3xl font-bold text-[#2b55ff] dark:text-[#4b6fff] relative z-10"
                            sequence={['Hello!', 1000, 'Hola!', 1000, 'Bonjour!', 1000, 'Namaste!', 1000]}
                        />
                    </motion.div>

                    <motion.h1
                        variants={itemVariants}
                        className="text-3xl font-heading md:text-4xl lg:text-5xl mt-5"
                    >
                        I&#39;m Ronit Jadhav. 👋
                    </motion.h1>

                    <motion.p
                        variants={itemVariants}
                        className="my-12 mt-8 text-lg font-normal leading-relaxed md:text-xl lg:text-2xl lg:leading-relaxed"
                    >
                        Based in Germany, I&#39;m a Geospatial Developer and a Software Engineer.
                        I love to work with maps, data, and code.
                        I&#39;m passionate about open-source, web technologies, and building cool stuff.
                    </motion.p>

                    <div className="flex flex-col items-center lg:items-start mb-8">
                        <motion.div
                            className="flex space-x-6 mb-6"
                            variants={itemVariants}
                        >
                            <motion.a
                                href="https://github.com/ronitjadhav"
                                target="_blank"
                                rel="noopener noreferrer"
                                variants={socialIconVariants}
                                whileHover="hover"
                            >
                                <FaGithub className="text-4xl text-gray-800 dark:text-white hover:text-cerulean-400 transition-colors duration-300"/>
                            </motion.a>
                            <motion.a
                                href="https://www.linkedin.com/in/ronitjadhav/"
                                target="_blank"
                                rel="noopener noreferrer"
                                variants={socialIconVariants}
                                whileHover="hover"
                            >
                                <FaLinkedin className="text-4xl text-gray-800 dark:text-white hover:text-cerulean-400 transition-colors duration-300"/>
                            </motion.a>
                        </motion.div>

                        {/* Removed hover effect here */}
                        <motion.div
                            variants={buttonVariants}
                            initial="hidden"
                            animate="visible"
                            whileTap="tap"
                        >
                            <Button
                                size="lg"
                                className="h-12 text-base font-heading md:text-lg lg:h-14 lg:text-xl"
                            >
                                Get in Touch!
                            </Button>
                        </motion.div>
                    </div>
                </div>

                <motion.div
                    className="w-full lg:w-1/2 mt-8 lg:mt-0 flex justify-center"
                    variants={itemVariants}
                >
                    <Image
                        src="/ronit.png"
                        alt="Ronit Jadhav"
                        width={450}
                        height={450}
                        className="mt-[-40px] ml-38"
                    />
                </motion.div>
            </motion.div>

            <motion.div
                className="absolute bottom-0 left-0 w-full"
                variants={marqueeContainerVariants}
                initial="hidden"
                animate="visible"
            >
                <Marquee
                    className="border-t-border dark:border-t-darkBorder dark:bg-secondaryBlack border-t-2 border-b-2 border-b-border dark:border-b-darkBorder bg-white py-3 sm:py-5 font-base"
                    direction="left"
                    speed={90}
                    loop={0}
                >
                    {skills.map((skill, id) => (
                        <motion.div
                            className="flex items-center mx-8"
                            key={id}
                            whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
                        >
                            <skill.Icon className="text-5xl mr-4" />
                            <span className="text-xl font-heading sm:text-2xl lg:text-4xl">
                                {skill.text}
                            </span>
                        </motion.div>
                    ))}
                </Marquee>
            </motion.div>
        </header>
    )
}