import type { Metadata } from "next";
import "./globals.css";
import { fontVars } from "./fonts";
import Nav from "@/components/layout/Nav";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.harshitadandu.com"),
  title: "Harshita's Portfolio",
  openGraph: {
    type: "website",
    url: "https://www.harshitadandu.com/",
    title: "Harshita's Portfolio",
    images: ["/images/shared/og-image.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={fontVars}>
      <body>
        <Nav />
        {children}
      </body>
    </html>
  );
}
