import "./globals.css";
import { Inter } from "next/font/google";
import Providers from "./components/Providers";
import Header from "./components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ReelsPro - Share Your Moments",
  description: "A modern social media platform for sharing video content",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-base-100">
            <Header />
            <main className="relative">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}