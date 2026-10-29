import Hero from "@/components/home/Hero";
import ThemeCord from "@/components/home/ThemeCord";
import Projects from "@/components/home/Projects";
import Testimonials from "@/components/home/Testimonials";
import HomeFooter from "@/components/layout/HomeFooter";

export default function Home() {
  return (
    <main>
      <ThemeCord />
      <HomeFooter>
        <Hero />
        <Projects />
        <Testimonials />
      </HomeFooter>
    </main>
  );
}
