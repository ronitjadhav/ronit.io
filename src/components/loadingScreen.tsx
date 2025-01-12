import React from 'react';

const LoadingScreen = () => {
    return (
        <div className="fixed inset-0 bg-yellow-300 dark:bg-purple-900 transition-colors duration-300 flex items-center justify-center">
            <div className="relative">
                {/* Main loading text */}
                <div className="text-6xl font-black bg-white dark:bg-gray-900 dark:text-white p-8 rotate-2 border-4 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
                    LOADING
                </div>

                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-pink-500 dark:bg-teal-400 border-4 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]" />
                <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-blue-400 dark:bg-orange-400 border-4 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]" />

                {/* Loading dots */}
                <div className="flex gap-2 mt-6 justify-center">
                    {[0, 1, 2].map((index) => (
                        <div
                            key={index}
                            className="w-4 h-4 bg-black dark:bg-white animate-bounce"
                            style={{ animationDelay: `${index * 0.2}s` }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LoadingScreen;