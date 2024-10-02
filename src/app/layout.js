import { Inter } from "next/font/google";
import "./globals.css";
import { CestoProvider } from "@/context/CestoContext";
import Navbar from "@/components/Navbar/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Agenda Aí",
  description:
    "Facilite o agendamento e reserva de lanches em lanchonetes e cantinas escolares com o Agenda Aí. Diminua filas, otimize o atendimento e aumente a satisfação dos clientes.",
  keywords: "agendamento de lanches, cantinas escolares, lanchonetes, reserva de lanches, Agenda Aí, otimização de atendimento, otimizar atendimento, reduzir filas, lanches",
  openGraph: {
    title: "Agenda Aí - Agendamento de Lanches em Cantinas Escolares",
    description:
      "O Agenda Aí é o sistema ideal para gerenciar o agendamento de lanches em cantinas escolares e lanchonetes. Com nosso sistema, você reduz filas, melhora a organização e proporciona uma experiência mais ágil aos clientes.",
    url: "https://agendaai.vercel.app/",
    siteName: "Agenda Aí",
    images: [
      {
        url: "https://res.cloudinary.com/dhaxh4qdu/image/upload/v1725925943/ovxinqsx3q2rnmytxcqw.png", // Ajuste com o caminho real da imagem
        width: 1200,
        height: 630,
        alt: "Logo do Agenda Aí",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Agenda Aí - Sistema de Agendamento de Lanches",
    description:
      "Reserve e gerencie pedidos de lanches em cantinas escolares de forma rápida e eficiente com o Agenda Aí.",
    images: ["https://res.cloudinary.com/dhaxh4qdu/image/upload/v1725925943/ovxinqsx3q2rnmytxcqw.png"], // Ajuste com o caminho real da imagem
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Lobster&display=swap" rel="stylesheet" />
      </head>
      <body className={inter.className}>
        <CestoProvider>
          <Navbar />
          {children}
        </CestoProvider>
      </body>
    </html>
  );
}
