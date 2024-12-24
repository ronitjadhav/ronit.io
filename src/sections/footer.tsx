import React from 'react';
import { Github, Twitter, Linkedin, Mail, Coffee } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full bg-bg p-8 border-t-8 border-black dark:border-darkBorder dark:bg-darkBg">
            <div className="max-w-7xl mx-auto">
                {/* Top Section with Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {/* Quick Links */}
                    <div>
                        <h3 className="text-2xl font-black mb-4 text-text uppercase tracking-wider dark:text-darkText">Quick Links</h3>
                        <ul className="space-y-3">
                            {['Projects', 'About', 'Blog', 'Contact'].map((item) => (
                                <li key={item}>
                                    <a
                                        href={`#${item.toLowerCase()}`}
                                        className="text-text
                             border-4 border-transparent hover:border-black hover:bg-yellow-300
                             px-4 py-1 transition-all duration-200 dark:text-darkText dark:hover:text-black"
                                    >
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Let's Connect */}
                    <div className="transform -rotate-1">
                        <h3 className="text-2xl font-black mb-4 text-text uppercase tracking-wider">Get in Touch!</h3>
                        <div className="flex flex-col items-center lg:items-start mb-8">
                            <div className="flex space-x-6 mb-6">
                                <a
                                    href="https://github.com/ronitjadhav"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <FaGithub
                                        className="text-4xl text-gray-800 dark:text-white hover:text-cerulean-400 transition-colors duration-300"/>
                                </a>
                                <a
                                    href="https://www.linkedin.com/in/ronitjadhav/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <FaLinkedin
                                        className="text-4xl text-gray-800 dark:text-white hover:text-cerulean-400 transition-colors duration-300"/>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Buy Me a Coffee Section */}
                    <div className="transform rotate-1">
                        <h3 className="text-2xl font-black mb-4 text-white uppercase tracking-wider">Support My
                            Work</h3>
                        <a
                            href="#"
                            className="inline-flex items-center gap-3 bg-blue-300 text-black font-bold px-6 py-3
                         border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                         hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-200
                         hover:translate-x-[-4px] hover:translate-y-[-4px]"
                        >
                            <Coffee className="w-6 h-6"/>
                            Buy Me a Coffee
                        </a>
                    </div>
                </div>

                {/* Bottom Section */}
                <div
                    className="border-t-4 border-black pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-text font-bold text-lg transform -rotate-1">
                        © {currentYear} Ronit  | Built with ❤��� & ☕
                    </p>
                    <div className="bg-black text-white px-4 py-2 font-mono text-sm transform rotate-1 dark:bg-bg dark:text-black">
                        &lt;/&gt; with Next.js + Tailwind
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;