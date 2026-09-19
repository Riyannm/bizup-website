import Header from "@/components/Header";
import Hero from "@/components/hero/Hero";
import Services from "@/components/sections/Services";
import About from "@/components/sections/About";
import Work from "@/components/sections/Work";
import Process from "@/components/sections/Process";
import Faq from "@/components/sections/Faq";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <main className="relative z-[2]">
        <div className="mx-auto max-w-[1080px] px-[22px]">
          <div className="[&>section]:py-24">
            <Services />
            <About />
            <Work />
            <Process />
            <Faq />
            <Contact />
          </div>
        </div>
        <Footer />
      </main>
      <WhatsAppFloat />
    </>
  );
}
