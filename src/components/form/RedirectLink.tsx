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
        className={`bg-[#FFFFF0] shadow-[2px_2px_2px_0_#FF0000] border-2 border-[#FF0000] hover:bg-[#FF0000] hover:text-white rounded-lg py-3 px-4 flex gap-2 ${className || ""}`}
      >
        {children}
      </Link>
    );
  }
  