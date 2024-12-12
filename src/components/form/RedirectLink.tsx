"use client"

import Link from "next/link"
import { ReactNode } from "react"

interface RedirectLinkProps {
    href: string
    className?: string
    children: ReactNode
}

export default function RedirectLink({ href, className, children }: RedirectLinkProps) {
    return (
      <Link
        href={href}
        className={`bg-gradient-to-tr from-[#FF5800] to-[#FF0000] text-white py-3 px-4 rounded-lg shadow-md flex gap-2 ${className || ""}`}
      >
        {children}
      </Link>
    );
  }
  