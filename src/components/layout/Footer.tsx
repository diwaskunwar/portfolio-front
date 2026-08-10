import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';

const SOCIALS = [
  { href: 'https://github.com/diwaskunwar', label: 'GitHub', Icon: Github },
  { href: 'https://www.linkedin.com/in/diwas-kunwar/', label: 'LinkedIn', Icon: Linkedin },
  { href: 'mailto:diwas.kuwar@gmail.com', label: 'Email', Icon: Mail },
] as const;

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-border bg-background py-14 md:py-16">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <p className="text-xl font-medium tracking-[-0.02em] text-foreground">
              Diwas Kunwar
            </p>
            <p className="label-mono mt-2">AI / ML Engineer</p>
          </div>

          <div className="flex items-center gap-1">
            {SOCIALS.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                aria-label={label}
                className="rounded-full p-2.5 text-muted-foreground transition-colors duration-200 hover:bg-surface-raised hover:text-foreground"
              >
                <Icon size={20} strokeWidth={1.5} />
              </a>
            ))}
            <a
              href="https://huggingface.co/diwaskunwar10"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Hugging Face"
              className="rounded-full p-2.5 opacity-60 grayscale transition-opacity duration-200 hover:opacity-100"
            >
              <img src="/hf-logo.svg" alt="" aria-hidden="true" className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Privacy and Terms were buttons that went nowhere, so they are gone
            rather than left as dead controls. */}
        <div className="mt-10 border-t border-border pt-7">
          <p className="label-mono">
            &copy; {currentYear} Diwas Kunwar
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
