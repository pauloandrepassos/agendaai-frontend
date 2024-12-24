"use client"

import { faBell, faHome, faSignOut, faUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const router = useRouter()

    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev)
    }

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev)
    }

    const closeDropdown = () => {
        setIsDropdownOpen(false)
    }

    const logout = () => {
        localStorage.removeItem("token")
        router.push('auth/login')
    }

    return (
        <nav className="">
            <div className="max-w-7xl mx-auto flex items-center justify-between p-3">
                {/* Logo e botão para dispositivos móveis */}
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
                <div className="block lg:hidden"></div>

                <div className="relative flex items-center">
                    <button
                        onClick={toggleDropdown}
                        className="text-[#FF0000] text-2xl w-10 h-10 text-center flex items-center justify-center rounded-full bg-white sm:hover:bg-yellow-400 focus:outline-none"
                    >
                        <FontAwesomeIcon icon={faUser} />
                    </button>
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-[170px] w-48 bg-white shadow-lg rounded-md overflow-hidden z-50" onMouseLeave={closeDropdown}>
                            <Link href="/" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                                <FontAwesomeIcon className="mr-3" icon={faUser} />
                                Perfil
                            </Link>
                            <Link href="/" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                                <FontAwesomeIcon className="mr-3" icon={faBell} />
                                Notificações
                            </Link>
                            <button onClick={logout} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                                <FontAwesomeIcon className="mr-3" icon={faSignOut} />
                                Sair
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Menu lateral para dispositivos móveis */}
            <div className={`fixed inset-0 z-50 bg-black bg-opacity-50 lg:hidden transition-opacity duration-300 ${isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`} onClick={toggleMenu}>
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
    )
}
