import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer"; // <-- IMPORTANDO O SEU FOOTER
import ChatbotIA from "./components/ChatbotIA"; 
import { Toaster } from "react-hot-toast"; 
import { CartProvider } from "@/lib/cart-context";
import { getCurrentUser } from "@/lib/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EGTech - Alta Performance",
  description: "Tecnologia e Hardware direto para você.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <CartProvider>
          <Navbar
            user={
              user ? { name: user.name, role: user.role } : null
            }
          />

          <main className="flex-grow">
              {children}
          </main>

          <Footer />

          <ChatbotIA />
        </CartProvider>
        <Toaster position="top-right" toastOptions={{
            style: { background: '#18181b', color: '#fff', borderRadius: '12px' }
        }} />
      </body>
    </html>
  );
}