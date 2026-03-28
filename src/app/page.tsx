'use client';
import Hero from "@/components/Hero";

import { useEffect, useRef } from "react";
import { ReactLenis } from 'lenis/react'
import gsap from "gsap";

export default function Home() {
  const lenisRef = useRef<any>(null);

  useEffect(() => {
    function update(time: number) {
      lenisRef.current?.lenis.raf(time * 1000);
    }
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => gsap.ticker.remove(update);
  }, []);

  return <>
    <ReactLenis root options={{ autoRaf: false }} ref={lenisRef}>
      <div className="intro min-h-screen flex items-center justify-center">intro</div>
      <Hero />
      <div className="outer min-h-screen flex items-center justify-center">footer</div>
    </ReactLenis>
  </>
};