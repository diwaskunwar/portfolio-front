
import { useProfile } from '@/store/ProfileContext';
import Section from '@/components/common/Section';
import Container from '@/components/common/Container';
import { Github, Linkedin, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import ScrollIndicator from '@/components/common/ScrollIndicator';

const slogans = [
  "Architecting Scalable Intelligence",
  "Engineering High-Performance Ecosystems",
  "Innovating Impact-Driven Solutions",
  "Advancing LLM Infrastructures"
];

const DIRECTIVE_TEXT = '"Building and Innovating intelligent systems that blend innovation with impact. Passionate about LLMs and high-performance backend architecture."';

const Hero = () => {
  const { profileData, loading } = useProfile();
  const [sloganIndex, setSloganIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [showDescentIndicator, setShowDescentIndicator] = useState(true);
  const [typedText, setTypedText] = useState('');
  const [typingDone, setTypingDone] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);

  // Slogan rotation
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

  // Hide descent indicator when hero scrolls out of view
  // NOTE: must use portal (createPortal) because Section applies CSS transform (translate-y-0)
  // which traps position:fixed children relative to that transform context, not the viewport.
  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById('hero');
      if (heroSection) {
        const heroBottom = heroSection.getBoundingClientRect().bottom;
        setShowDescentIndicator(heroBottom > 80);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Typing animation for Current Directive
  useEffect(() => {
    if (typedText.length < DIRECTIVE_TEXT.length) {
      const timeout = setTimeout(() => {
        setTypedText(DIRECTIVE_TEXT.slice(0, typedText.length + 1));
      }, 28);
      return () => clearTimeout(timeout);
    } else {
      setTypingDone(true);
    }
  }, [typedText]);

  // Cursor blink while typing
  useEffect(() => {
    if (typingDone) return;
    const interval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, [typingDone]);

  if (loading || !profileData) {
    return (
      <Section id="hero" className="justify-center">
        <div className="h-12 w-64 bg-white/10 animate-pulse rounded-full mx-auto"></div>
      </Section>
    );
  }

  const { name } = profileData.profile;

  return (
    <Section id="hero" className="relative min-h-screen flex flex-col items-center justify-center pt-20">
      <Container className="z-10 text-center">

        {/* Neural Engine badge — water-glass fill + snake border glow */}
        <div className="inline-block mb-10 animate-fade-in">
          <div className="neural-badge-outer rounded-full p-[1px]">
            <div className="relative rounded-full overflow-hidden bg-black px-6 py-2">
              {/* Water fill layer */}
              <div className="neural-water absolute inset-0 bg-white" />
              {/* Text — mix-blend-difference makes it invert as water fills */}
              <span
                className="relative z-10 text-[10px] tracking-[0.5em] uppercase font-bold"
                style={{ color: 'white', mixBlendMode: 'difference' }}
              >
                Neural Engine Synchronized
              </span>
            </div>
          </div>
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
          AI/ML Engineer
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-12 mt-8 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <div className="max-w-xl text-left border-l-2 border-white pl-10 relative group">
            <p className="text-white uppercase text-[9px] tracking-[0.5em] font-bold mb-4">Current Directive</p>
            <p className="text-white text-lg md:text-xl font-light leading-relaxed min-h-[4rem]">
              {typedText}
              {!typingDone && (
                <span
                  className={`inline-block w-0.5 h-5 bg-white ml-0.5 align-middle transition-opacity duration-100 ${cursorVisible ? 'opacity-100' : 'opacity-0'}`}
                />
              )}
            </p>
          </div>

          <div className="flex flex-wrap gap-8 justify-center items-center">
            <a href="https://github.com/diwaskunwar" target="_blank" rel="noopener noreferrer" className="text-white hover:scale-125 transition-all duration-300" title="GitHub">
              <Github size={32} strokeWidth={1} />
            </a>
            <a href="https://www.linkedin.com/in/diwas-kunwar/" target="_blank" rel="noopener noreferrer" className="text-white hover:scale-125 transition-all duration-300" title="LinkedIn">
              <Linkedin size={32} strokeWidth={1} />
            </a>
            <a href="https://huggingface.co/diwaskunwar10" target="_blank" rel="noopener noreferrer" className="hover:scale-125 transition-all duration-300 flex items-center" title="Hugging Face">
              <img src="/hf-logo.svg" alt="Hugging Face" className="w-8 h-8" />
            </a>
            <a href="mailto:diwas.kunwar@gmail.com" className="text-white hover:scale-125 transition-all duration-300" title="Email">
              <Mail size={32} strokeWidth={1} />
            </a>
          </div>
        </div>
      </Container>

      {/* Portal: renders directly in document.body so position:fixed is relative to viewport,
          not the Section's CSS transform context */}
      {createPortal(
        <div
          className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
            showDescentIndicator ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
        >
          <ScrollIndicator targetId="professional-journey" />
        </div>,
        document.body
      )}
    </Section>
  );
};

export default Hero;
