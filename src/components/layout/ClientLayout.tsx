"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";

export default function ClientLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const pathname = usePathname();

    const hideNavbarPaths = ["/auth/forgot-password", "/auth/login", "/auth/register", "/auth/reset-password", "/auth/verify"];
    const shouldShowNavbar = !hideNavbarPaths.includes(pathname);

    return (
        <>
            {shouldShowNavbar && <Navbar />}
            {children}
        </>
    );
}