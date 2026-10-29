import type { Metadata } from "next";
import Garden from "@/components/play/Garden";
import HomeFooter from "@/components/layout/HomeFooter";

export const metadata: Metadata = { title: "Garden | Harshita's Portfolio" };

export default function PlayPage() {
  return (
    <main>
      <HomeFooter>
        <Garden />
      </HomeFooter>
    </main>
  );
}
