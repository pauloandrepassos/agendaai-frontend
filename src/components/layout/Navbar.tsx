"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };

    return (
        <nav className="bg-[#FF0000] p-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center">
                    <button
                        onClick={toggleMenu}
                        className="text-white lg:hidden focus:outline-none"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>
                    <Link href="/">
                        <img src="/logo-agendaai.png" alt="Logo" className="w-12 h-12" />
                    </Link>
                </div>

                {/* Menu para dispositivos móveis */}
                <div className="block lg:hidden">
                </div>

                {/* Menu para dispositivos maiores */}
                <div className="hidden lg:flex space-x-6">
                </div>
            </div>

            {/* Menu lateral para dispositivos móveis */}
            <div className={`fixed inset-0 bg-black bg-opacity-50 lg:hidden transition-opacity duration-300 ${isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`} onClick={toggleMenu}>
                <div className={`fixed left-0 top-0 w-2/3 h-full bg-[#FF0000] p-4 transition-transform duration-300 ${isMenuOpen ? "transform translate-x-0" : "transform -translate-x-full"}`} onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end">
                        <button className="text-white text-2xl mb-8" onClick={toggleMenu}>
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                    <div className="flex flex-col gap-2">
                    </div>
                </div>
            </div>
        </nav>
    );
}
