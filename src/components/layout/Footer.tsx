import React from 'react';
import { Github, Linkedin, Mail, Download } from 'lucide-react';
import {
  RESUME_DOWNLOAD_URL,
  GITHUB_URL,
  LINKEDIN_URL,
  HUGGINGFACE_URL,
  EMAIL_URL,
} from '@/lib/links';

const SOCIALS = [
  { href: GITHUB_URL, label: 'GitHub', Icon: Github },
  { href: LINKEDIN_URL, label: 'LinkedIn', Icon: Linkedin },
  { href: EMAIL_URL, label: 'Email', Icon: Mail },
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
              href={HUGGINGFACE_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Hugging Face"
              className="rounded-full p-2.5 opacity-60 grayscale transition-opacity duration-200 hover:opacity-100"
            >
              <img src="/hf-logo.svg" alt="" aria-hidden="true" className="h-5 w-5" />
            </a>

            <a
              href={RESUME_DOWNLOAD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group ml-3 inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors duration-200 hover:border-foreground/35 hover:bg-surface-raised"
            >
              <Download
                size={15}
                strokeWidth={1.75}
                className="transition-transform duration-300 group-hover:translate-y-0.5 motion-reduce:transition-none"
              />
              Résumé
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
