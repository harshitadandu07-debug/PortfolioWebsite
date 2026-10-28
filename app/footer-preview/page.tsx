import type { Metadata } from "next";
import AnimatedFooter from "@/features/animated-footer/components/AnimatedFooter";

// Standalone preview for the animated footer. It is not linked from anywhere and is kept out of search results;
// the real footer is untouched until this is deliberately wired in.
export const metadata: Metadata = { title: "Animated footer preview", robots: { index: false, follow: false } };

export default function FooterPreviewPage() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "48px 16px", background: "var(--cream)" }}>
      <AnimatedFooter />
    </main>
  );
}
