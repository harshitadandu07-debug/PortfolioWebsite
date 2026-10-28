import type { CSSProperties } from "react";
import type { TextStyle } from "@/content/case-studies/types";

const FAMILY: Record<TextStyle["font"], string> = {
  raleway: "var(--font-raleway), sans-serif",
  instrument: "var(--font-instrument), sans-serif",
  display: "var(--font-reckless), serif",
};

export function toCss(s: TextStyle): CSSProperties {
  return {
    fontFamily: FAMILY[s.font],
    fontSize: s.fontSize,
    fontWeight: s.fontWeight,
    color: s.color,
    lineHeight: s.lineHeight ? `${s.lineHeight}px` : undefined,
    textAlign: s.textAlign,
    letterSpacing: s.letterSpacing,
    textTransform: s.textTransform as CSSProperties["textTransform"],
    fontStyle: s.fontStyle,
  };
}
