
import React from 'react';
import { Github, Linkedin, Mail, BotIcon } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black py-16 border-t border-white/5 relative z-10">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-extralight text-white tracking-[0.2em] mb-2 uppercase">DIWAS KUNWAR</h3>
            <p className="text-white/80 text-xs tracking-[0.2em] font-light uppercase">AI/ML Engineer &amp; Backend Developer</p>
          </div>

          <div className="flex gap-8 items-center">
            <a
              href="https://github.com/diwaskunwar"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-white transition-all duration-300 hover:scale-125"
              title="GitHub"
            >
              <Github size={24} strokeWidth={1} />
            </a>
            <a
              href="https://www.linkedin.com/in/diwas-kunwar/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-white transition-all duration-300 hover:scale-125"
              title="LinkedIn"
            >
              <Linkedin size={24} strokeWidth={1} />
            </a>
            <a
              href="https://huggingface.co/diwaskunwar10"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-all duration-300 hover:scale-125 flex items-center"
              title="Hugging Face"
            >
              {/* <img src="/hf-logo.svg" alt="Hugging Face" className="w-6 h-6" /> */}
              <BotIcon size={24} strokeWidth={1} />
            </a>
            <a
              href="mailto:diwas.kunwar@gmail.com"
              className="text-white hover:text-white transition-all duration-300 hover:scale-125"
              title="Email"
            >
              <Mail size={24} strokeWidth={1} />
            </a>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/80 text-[10px] tracking-[0.3em] uppercase font-bold">
            &copy; {currentYear} DIWAS KUNWAR. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-6">
            <button className="text-white/80 hover:text-white text-[10px] tracking-[0.3em] uppercase transition-colors font-bold">PRIVACY</button>
            <button className="text-white/80 hover:text-white text-[10px] tracking-[0.3em] uppercase transition-colors font-bold">TERMS</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
