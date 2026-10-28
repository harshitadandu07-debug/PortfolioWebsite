import type { CSSProperties } from "react";
import type { TextStyle } from "@/content/case-studies/types";
import { toCss } from "./textStyle";

// `html` comes from our own generated content files (inline strong/em/span/a only), never user input.
export default function RichText({
  html,
  style,
  className,
  extra,
}: {
  html: string;
  style: TextStyle;
  className?: string;
  extra?: CSSProperties;
}) {
  return <p className={className} style={{ ...toCss(style), ...extra }} dangerouslySetInnerHTML={{ __html: html }} />;
}
