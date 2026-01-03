
import React from 'react';
import { Github, Linkedin, Mail, Twitter } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black py-16 border-t border-white/5 relative z-10">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-extralight text-white tracking-[0.2em] mb-2 uppercase">DIWAS KUNWAR</h3>
            <p className="text-white/80 text-xs tracking-[0.2em] font-light uppercase">Machine Learning Engineer & Backend Developer</p>
          </div>

          <div className="flex gap-8">
            {[
              { icon: Github, href: "https://github.com/witcher9591" },
              { icon: Linkedin, href: "https://linkedin.com" },
              { icon: Mail, href: "mailto:contact@diwas.me" },
              { icon: Twitter, href: "https://twitter.com" }
            ].map((social, i) => (
              <a
                key={i}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-white transition-all duration-300 hover:scale-125"
              >
                <social.icon size={24} strokeWidth={1} />
              </a>
            ))}
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
