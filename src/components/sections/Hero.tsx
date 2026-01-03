
import { useProfile } from '@/store/ProfileContext';
import Section from '@/components/common/Section';
import Container from '@/components/common/Container';
import { Github, Linkedin, Mail, ArrowDown, BookOpen } from 'lucide-react';
import { useState, useEffect } from 'react';
import ScrollIndicator from '@/components/common/ScrollIndicator';

const slogans = [
  "Architecting Scalable Intelligence",
  "Engineering High-Performance Ecosystems",
  "Innovating Impact-Driven Solutions",
  "Advancing LLM Infrastructures"
];

const Hero = () => {
  const { profileData, loading } = useProfile();
  const [sloganIndex, setSloganIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setSloganIndex((prev) => (prev + 1) % slogans.length);
        setFade(true);
      }, 500);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !profileData) {
    return (
      <Section id="hero" className="justify-center">
        <div className="h-12 w-64 bg-white/10 animate-pulse rounded-full mx-auto"></div>
      </Section>
    );
  }

  const { name, headline } = profileData.profile;

  return (
    <Section id="hero" className="relative min-h-screen flex flex-col items-center justify-center pt-20">
      <Container className="z-10 text-center">
        <div className="inline-block px-6 py-2 mb-10 border border-white rounded-full bg-white text-black animate-fade-in shadow-[0_0_20px_rgba(255,255,255,0.3)]">
          <span className="text-[10px] tracking-[0.5em] uppercase font-bold">Neural Engine Synchronized</span>
        </div>

        <h1 className="text-6xl md:text-9xl font-extralight text-white tracking-tighter mb-8 leading-none selection:bg-white selection:text-black">
          {name}
        </h1>

        <div className="h-12 md:h-16 mb-16 overflow-hidden">
          <p className={`text-white text-xl md:text-3xl font-light tracking-[0.2em] transition-all duration-500 ${fade ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {slogans[sloganIndex]}
          </p>
        </div>

        <p className="text-white text-lg md:text-2xl font-light mb-16 tracking-[0.1em] max-w-4xl mx-auto leading-relaxed border-t border-b border-white/10 py-8">
          {headline}
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-12 mt-8 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <div className="max-w-xl text-left border-l-2 border-white pl-10 relative group">
            <p className="text-white uppercase text-[9px] tracking-[0.5em] font-bold mb-4">Current Directive</p>
            <p className="text-white text-lg md:text-xl font-light leading-relaxed">
              "Building and Innovating <span className="font-medium">intelligent systems</span> that blend <span className="italic font-normal">innovation with impact</span>. Passionate about LLMs and high-performance backend architecture."
            </p>
          </div>

          <div className="flex flex-wrap gap-8 justify-center items-center">
            <a href="https://github.com/witcher9591" target="_blank" className="text-white hover:scale-125 transition-all duration-300" title="GitHub">
              <Github size={32} strokeWidth={1} />
            </a>
            <a href="https://linkedin.com" target="_blank" className="text-white hover:scale-125 transition-all duration-300" title="LinkedIn">
              <Linkedin size={32} strokeWidth={1} />
            </a>
            <a href="https://huggingface.co" target="_blank" className="text-white hover:scale-125 transition-all duration-300" title="Hugging Face">
              <BookOpen size={32} strokeWidth={1} />
            </a>
            <a href="mailto:contact@diwas.me" className="text-white hover:scale-125 transition-all duration-300" title="Email">
              <Mail size={32} strokeWidth={1} />
            </a>
          </div>
        </div>
      </Container>

      {/* Scroll Indicator */}
      <ScrollIndicator targetId="professional-journey" className="absolute bottom-12 left-1/2 -translate-x-1/2" />
    </Section>
  );
};

export default Hero;
