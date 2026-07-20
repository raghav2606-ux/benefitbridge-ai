import Hero from "@/components/sections/Hero";
import AISearch from "@/components/sections/AISearch";
import Features from "@/components/sections/Features";
import HowItWorks from "@/components/sections/HowItWorks";
import Statistics from "@/components/sections/Statistics";
import FeaturedSchemes from "@/components/sections/FeaturedSchemes";

export default function Home() {
  return (
    <>
      <Hero />
      <AISearch />
      <Features />
      <HowItWorks />
      <Statistics />
      <FeaturedSchemes />
    </>
  );
}