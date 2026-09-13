import { Inter, Teko } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const teko = Teko({
  subsets: ["latin"],
  variable: "--font-teko",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "ATHLIMA 2026 | Play. Push. Prevail.",
  description: "More than a competition. A celebration of sport, strength, community and something bigger than ourselves.",
  openGraph: {
    title: "ATHLIMA 2026",
    description: "Intercollege Sports Meet",
    url: "https://athlima2026.example.com",
    siteName: "ATHLIMA 2026",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${teko.variable}`}>
      <body>
        <SmoothScroll>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
