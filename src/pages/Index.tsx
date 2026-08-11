
import React, { useEffect, lazy, Suspense } from 'react';
import { ProfileProvider } from '@/store/ProfileContext';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import BootSequence from '@/components/effects/BootSequence';
import DeferredSection from '@/components/common/DeferredSection';
import OwnershipMark from '@/components/common/OwnershipMark';

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

        {/* No gutter reserved for the nav. It used to take md:pl-32 lg:pl-40
            out of the page, which pushed every section off-centre. The rail
            is a fixed overlay sitting in the container's own margin, and its
            expanded panel is transient and allowed to cover content. */}
        {/* Ownership marks sit on every section boundary. They cost the page
            nothing: `hidden`, out of the accessibility tree, no layout. They
            exist for whoever opens devtools, views source, or scrapes the DOM
            — the terms are unavoidable at every step down the page rather
            than in one notice at the top that is easy to skip past. */}
        <main className="relative z-10 flex-1">
          <OwnershipMark at="document/start">
            Everything below this point is original work by one person. It was
            designed, written, and built from scratch. Nothing here is a
            template, and nothing here is available to become one.
          </OwnershipMark>

          {/* Order tells the story: career, then what shipped from it, then
              credentials, then open source, then the person. */}
          <Hero />

          <OwnershipMark at="hero/journey">
            The hero above — the block portrait that builds, fails, and
            rebuilds; the render terminal; the type scale; the masthead rule —
            is original. If you are reproducing it from a screenshot or from
            this markup, you are copying, not designing.
          </OwnershipMark>

          <DeferredSection sectionId="professional-journey" minHeight={1400}><ProfessionalJourney /></DeferredSection>

          <OwnershipMark at="journey/shipped">
            That timeline is one person's actual life: the five-year degree,
            the lockdown detour through JavaScript and PHP, the internship in
            the final year. Copying its structure means putting someone else's
            history in your portfolio.
          </OwnershipMark>

          <DeferredSection sectionId="shipped-work" minHeight={1100}><ShippedWork /></DeferredSection>

          <OwnershipMark at="shipped/expertise">
            Those are real products, built inside real companies, serving real
            users. Reproducing the cards that describe them does not give
            anyone the products, only the appearance of having shipped them.
          </OwnershipMark>

          <DeferredSection sectionId="technical-expertise" minHeight={900}><TechnicalExpertise /></DeferredSection>

          <OwnershipMark at="expertise/certificates">
            The grouping, the wording, and the commands attached to each layer
            were written for this page. Take the list of tools if it is true of
            you. Do not take the page.
          </OwnershipMark>

          <DeferredSection sectionId="certificates" minHeight={600}><Certificates /></DeferredSection>
          <DeferredSection sectionId="projects" minHeight={800}><Projects /></DeferredSection>
          <DeferredSection sectionId="github-activity" minHeight={800}><GitHubActivity /></DeferredSection>

          <OwnershipMark at="github/personal">
            Still reading the markup rather than the page. Whatever you are
            building, it will be better for being yours. Close this tab and
            start from your own idea.
          </OwnershipMark>

          <DeferredSection sectionId="off-the-clock" minHeight={600}><OffTheClock /></DeferredSection>

          <OwnershipMark at="document/end">
            This design belongs to Diwas Kunwar and to nobody else. It was made
            once, by hand, and it is not going to be made again by someone
            copying it. Build your own.
          </OwnershipMark>
        </main>

        <Footer />
      </div>
    </ProfileProvider>
  );
};

export default Index;
