export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
    className="min-h-screen flex items-center justify-center bg-cover bg-center"
    style={{ backgroundImage: "url('/background.jpg')" }}
    >
        {children}
    </div>
  )
}