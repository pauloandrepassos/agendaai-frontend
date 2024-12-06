import Navbar from "@/components/layout/Navbar";

export default function ClientLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <div>
            <Navbar />
            {children}
        </div>
    )
  }