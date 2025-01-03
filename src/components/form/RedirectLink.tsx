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
        className={`bg-elementbg shadow-primary border-2 border-primary hover:bg-primary hover:text-white rounded-lg py-1 px-4 flex gap-2 ${className || ""}`}
      >
        {children}
      </Link>
    );
  }
  