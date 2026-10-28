import Hero from "@/components/home/Hero";
import Projects from "@/components/home/Projects";
import Testimonials from "@/components/home/Testimonials";
import ContactFooter from "@/components/layout/ContactFooter";

export default function Home() {
  return (
    <main>
      <Hero />
      <Projects />
      <Testimonials />
      <ContactFooter />
    </main>
  );
}
