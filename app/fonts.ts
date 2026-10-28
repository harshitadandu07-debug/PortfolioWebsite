import localFont from "next/font/local";
import { Raleway, Urbanist, Figtree, Grape_Nuts, Instrument_Sans } from "next/font/google";

export const reckless = localFont({
  variable: "--font-reckless",
  src: [
    { path: "./fonts/reckless-condensed-regular.woff2", weight: "400" },
    { path: "./fonts/reckless-condensed-medium.woff2", weight: "500" },
  ],
});

export const graphik = localFont({
  variable: "--font-graphik",
  src: [
    { path: "./fonts/graphik-compact-regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/graphik-compact-italic.woff2", weight: "400", style: "italic" },
    { path: "./fonts/graphik-compact-medium.woff2", weight: "500" },
    { path: "./fonts/graphik-compact-semibold.woff2", weight: "600" },
  ],
});

export const apfel = localFont({
  variable: "--font-apfel",
  src: "./fonts/apfel-grotezk-regular.woff2",
  weight: "400",
});

export const raleway = Raleway({ variable: "--font-raleway", subsets: ["latin"] });
export const urbanist = Urbanist({ variable: "--font-urbanist", subsets: ["latin"], weight: "700" });
export const figtree = Figtree({ variable: "--font-figtree", subsets: ["latin"], weight: "700" });
export const grapeNuts = Grape_Nuts({ variable: "--font-grape-nuts", subsets: ["latin"], weight: "400" });

export const instrument = Instrument_Sans({ variable: "--font-instrument", subsets: ["latin"], weight: ["500"] });

export const fontVars = [reckless, graphik, apfel, raleway, urbanist, figtree, grapeNuts, instrument]
  .map((f) => f.variable)
  .join(" ");
