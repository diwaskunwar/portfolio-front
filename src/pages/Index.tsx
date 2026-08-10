
import React, { useEffect, lazy, Suspense } from 'react';
import { ProfileProvider } from '@/store/ProfileContext';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import BootSequence from '@/components/effects/BootSequence';
import DeferredSection from '@/components/common/DeferredSection';

/* Only the hero is in the initial bundle. Everything below the fold is a
   separate chunk, requested as the reader approaches it. */
const ParticleBackground = lazy(() => import('@/components/effects/ParticleBackground'));
const ProfessionalJourney = lazy(() => import('@/components/sections/ProfessionalJourney'));
const ShippedWork = lazy(() => import('@/components/sections/ShippedWork'));
const TechnicalExpertise = lazy(() => import('@/components/sections/TechnicalExpertise'));
const Certificates = lazy(() => import('@/components/sections/Certificates'));
const Projects = lazy(() => import('@/components/sections/Projects'));
const GitHubActivity = lazy(() => import('@/components/sections/GitHubActivity'));
const OffTheClock = lazy(() => import('@/components/sections/OffTheClock'));

const Index = () => {
  useEffect(() => {
    document.body.classList.add('overflow-x-hidden');
    return () => {
      document.body.classList.remove('overflow-x-hidden');
    };
  }, []);

  return (
    <ProfileProvider>
      <BootSequence />
      <div className="relative flex min-h-[100dvh] flex-col bg-background">
        {/* Ambient layer. Static paint, never scrolls, never hit-tested. */}
        <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
          <Suspense fallback={null}>
            <ParticleBackground particleCount={90} color="rgba(244,244,246,0.42)" />
          </Suspense>
          {/* Neutral blooms. No hue on the page beyond black and white. */}
          <div className="absolute -left-[15%] -top-[20%] h-[720px] w-[720px] rounded-full bg-[hsl(0_0%_100%/0.045)] blur-[160px]" />
          <div className="absolute -right-[10%] top-[45%] h-[560px] w-[560px] rounded-full bg-[hsl(0_0%_100%/0.03)] blur-[150px]" />
          {/* Grounds the fold so content never floats on a flat field */}
          <div className="absolute inset-x-0 bottom-0 h-[45vh] bg-gradient-to-t from-background to-transparent" />
        </div>

        <Navigation />

        {/* Left padding clears the resting nav (markers + icon pill). The
            hover-expanded title is transient and allowed to overlap. */}
        <main className="relative z-10 flex-1 px-4 md:pl-32 md:pr-10 lg:pl-40 lg:pr-16">
          {/* Order tells the story: career, then what shipped from it, then
              credentials, then open source, then the person. */}
          <Hero />
          <DeferredSection sectionId="professional-journey" minHeight={1400}><ProfessionalJourney /></DeferredSection>
          <DeferredSection sectionId="shipped-work" minHeight={1100}><ShippedWork /></DeferredSection>
          <DeferredSection sectionId="technical-expertise" minHeight={900}><TechnicalExpertise /></DeferredSection>
          <DeferredSection sectionId="certificates" minHeight={600}><Certificates /></DeferredSection>
          <DeferredSection sectionId="projects" minHeight={800}><Projects /></DeferredSection>
          <DeferredSection sectionId="github-activity" minHeight={800}><GitHubActivity /></DeferredSection>
          <DeferredSection sectionId="off-the-clock" minHeight={600}><OffTheClock /></DeferredSection>
        </main>

        <Footer />
      </div>
    </ProfileProvider>
  );
};

export default Index;
