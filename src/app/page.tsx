"use client";

import { useRef } from "react";
import { useScroll } from "framer-motion";
import VisualsContainer from "@/components/homepage/VisualsContainer";
import TextOverlay from "@/components/homepage/TextOverlay";

export default function Home() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  });

  return (
    <main ref={scrollRef} className="relative h-[600vh] w-full">
      <TextOverlay scrollYProgress={scrollYProgress} />
      <VisualsContainer scrollYProgress={scrollYProgress} />
    </main>
  );
}
