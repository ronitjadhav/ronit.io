'use client'
import { Button } from '@/components/ui/button'
import { TypeAnimation } from 'react-type-animation'
import { FaGithub, FaLinkedin } from 'react-icons/fa'

export default function HeroSection() {
    return (
        <header className="dark:bg-secondaryBlack inset-0 flex min-h-[100dvh] w-full flex-col items-center justify-center bg-white bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px]">
            <div className="mx-auto w-container max-w-full px-5 py-[110px] text-left lg:py-[150px] flex flex-col lg:flex-row">
                <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start">
                    <TypeAnimation
                        className={`
      text-3xl lg:text-3xl
      font-bold
      text-[#2b55ff]
      dark:text-[#4b6fff]
      relative
      z-10
      hover:translate-x-[3px]
      hover:translate-y-[3px]
      transition-transform
      duration-100
    `}
                        sequence={['Hello!', 1000, 'Hola!', 1000, 'Bonjour!', 1000, 'Namaste!', 1000]}
                    />
                    <h1 className="text-3xl font-heading md:text-4xl lg:text-5xl mt-5">
                        I&#39;m Ronit Jadhav. 👋
                    </h1>
                    <p className="my-12 mt-8 text-lg font-normal leading-relaxed md:text-xl lg:text-2xl lg:leading-relaxed">
                        Based in Germany, I&#39;m a Geospatial Developer and a Software Engineer.
                        I love to work with maps, data, and code.
                        I&#39;m passionate about open-source, web technologies, and building cool stuff.
                    </p>
                    <div className="flex flex-col items-center lg:items-start mb-8">
                        <div className="flex space-x-6 mb-6">
                            <a href="https://github.com/ronitjadhav" target="_blank" rel="noopener noreferrer">
                                <FaGithub className="text-4xl text-gray-800 dark:text-white hover:text-cerulean-400 transition-colors duration-300" />
                            </a>
                            <a href="https://www.linkedin.com/in/ronitjadhav/" target="_blank" rel="noopener noreferrer">
                                <FaLinkedin className="text-4xl text-gray-800 dark:text-white hover:text-cerulean-400 transition-colors duration-300" />
                            </a>
                        </div>
                        <Button
                            size="lg"
                            className="h-12 text-base font-heading md:text-lg lg:h-14 lg:text-xl"
                        >
                            Contact me
                        </Button>
                    </div>
                </div>
                <div className="w-full lg:w-1/2 mt-8 lg:mt-0">
                    {/* New blank section */}
                </div>
            </div>
            <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40"/>
        </header>
    )
}