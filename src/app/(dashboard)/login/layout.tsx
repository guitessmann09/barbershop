import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@/app/globals.css"
import { Toaster } from "sonner"
import Footer from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  icons: {
    icon: "/favicon.ico",
  },
  title: "Dandy's Den",
  description: "Barbearia Dandy's Den",
}

export default function LoginLayou({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} flex h-screen flex-col`}>
        {children}
        <Toaster />
        <Footer />
      </body>
    </html>
  )
}
