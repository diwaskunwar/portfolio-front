
import React, { useEffect, lazy, Suspense } from 'react';
import { ProfileProvider } from '@/store/ProfileContext';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import ProfessionalJourney from '@/components/sections/ProfessionalJourney';
import TechnicalExpertise from '@/components/sections/TechnicalExpertise';
import Projects from '@/components/sections/Projects';
import GitHubActivity from '@/components/sections/GitHubActivity';
import { ChatWindow } from '@/components/common/ChatWindow';
import Certificates from '@/components/sections/Certificates';

const ParticleBackground = lazy(() => import('@/components/effects/ParticleBackground'));

const Index = () => {
  useEffect(() => {
    document.body.className = 'bg-black selection:bg-white selection:text-black overflow-x-hidden';
    return () => {
      document.body.className = '';
    };
  }, []);

  return (
    <ProfileProvider>
      <div className="min-h-screen flex flex-col bg-black relative selection:bg-white selection:text-black">
        {/* Global Particle Background */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <Suspense fallback={null}>
            <ParticleBackground particleCount={150} color="rgba(255, 255, 255, 0.5)" />
          </Suspense>
          <div className="absolute top-0 left-0 w-full h-[70vh] bg-gradient-to-b from-white/[0.12] to-transparent pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-full h-[50vh] bg-gradient-to-t from-white/[0.05] to-transparent pointer-events-none"></div>
          {/* Subtle orbital glows */}
          <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-white/[0.03] rounded-full blur-[150px]"></div>
          <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-white/[0.03] rounded-full blur-[150px]"></div>
        </div>

        <Navigation />

        {/* Removed fixed left margin to center content naturally with the floating pill */}
        <main className="flex-1 transition-all duration-500 relative z-10 px-4 md:px-24">
          <Hero />
          <ProfessionalJourney />
          <TechnicalExpertise />
          <Projects />
          <GitHubActivity />
          <Certificates />
        </main>

        <Footer />
        <ChatWindow />
      </div>
    </ProfileProvider>
  );
};

export default Index;
