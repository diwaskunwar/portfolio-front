import { useState, useEffect } from 'react';
import {
  Home,
  Briefcase,
  Rocket,
  Code,
  FolderGit2,
  Github,
  Award,
  Coffee,
  Menu,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* Order mirrors the page: career, what shipped from it, credentials,
   open source, then the person. */
const NAV_ITEMS = [
  { id: 'hero', label: 'Home', icon: Home },
  { id: 'professional-journey', label: 'How I Got Here', icon: Briefcase },
  { id: 'shipped-work', label: 'What I Have Shipped', icon: Rocket },
  { id: 'technical-expertise', label: 'Technical Expertise', icon: Code },
  { id: 'certificates', label: 'Certificates', icon: Award },
  { id: 'projects', label: 'Open Source', icon: FolderGit2 },
  { id: 'github-activity', label: 'GitHub Activity', icon: Github },
  { id: 'off-the-clock', label: 'Away From The Terminal', icon: Coffee },
] as const;

const Navigation = () => {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // IntersectionObserver instead of a scroll listener: the old version read
  // offsetTop for every section on every scroll frame and called setState
  // repeatedly, re-rendering the nav mid-scroll.
  useEffect(() => {
    const ids = NAV_ITEMS.map(item => item.id);
    const ratios = new Map<string, number>();
    const watched = new Set<Element>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }
        let best = '';
        let bestRatio = 0;
        for (const id of ids) {
          const ratio = ratios.get(id) ?? 0;
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = id;
          }
        }
        if (best) setActiveSection(prev => (prev === best ? prev : best));
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1], rootMargin: '-45% 0px -45% 0px' }
    );

    const attach = () => {
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && !watched.has(el)) {
          watched.add(el);
          observer.observe(el);
        }
      }
    };

    attach();

    // Sections below the fold mount lazily, so they do not exist on the first
    // pass. Watch the tree and observe each one as it arrives.
    const mutations = new MutationObserver(attach);
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutations.disconnect();
    };
  }, []);

  // Lock body scroll while the overlay is open
  useEffect(() => {
    if (!isMenuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isMenuOpen]);

  const goTo = (id: string) => {
    // Falls back to the reserved placeholder when the section has not mounted
    // yet, so a nav click is never a no-op.
    const target =
      document.getElementById(id) ??
      document.querySelector(`[data-section-placeholder="${id}"]`);
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setIsMenuOpen(false);
  };

  const activeItem = NAV_ITEMS.find(item => item.id === activeSection) ?? NAV_ITEMS[0];
  const ActiveIcon = activeItem.icon;

  return (
    <>
      {/* ---------------- Desktop: marker column + active pill ---------------- */}
      <div className="fixed left-6 top-1/2 z-[110] hidden -translate-y-1/2 items-center gap-4 md:flex">
        <nav aria-label="Section navigation" className="flex flex-col gap-2">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => goTo(item.id)}
                aria-label={item.label}
                aria-current={isActive ? 'true' : undefined}
                title={item.label}
                className={cn(
                  'w-1.5 rounded-full transition-all duration-300 ease-swift',
                  isActive
                    ? 'h-8 bg-foreground'
                    : 'h-3 bg-foreground/20 hover:bg-foreground/50'
                )}
              />
            );
          })}
        </nav>

        {/* Icon only at rest, so scrolling is never accompanied by a wide
            label chip. The title is revealed on hover or keyboard focus, and
            is allowed to overlap content since it is transient. */}
        <button
          type="button"
          onClick={() => setIsMenuOpen(true)}
          aria-label={`${activeItem.label}. Open navigation menu`}
          aria-haspopup="dialog"
          className="group/pill flex items-center rounded-full bg-foreground p-3.5 text-background transition-[padding] duration-300 ease-swift hover:pr-5 focus-visible:pr-5"
        >
          <ActiveIcon size={18} strokeWidth={1.75} className="shrink-0" />
          <span
            aria-hidden="true"
            className="max-w-0 overflow-hidden whitespace-nowrap font-mono text-[10px] font-semibold uppercase tracking-[0.24em] opacity-0 transition-all duration-300 ease-swift group-hover/pill:ml-3 group-hover/pill:max-w-[15rem] group-hover/pill:opacity-100 group-focus-visible/pill:ml-3 group-focus-visible/pill:max-w-[15rem] group-focus-visible/pill:opacity-100 motion-reduce:transition-none"
          >
            {activeItem.label}
          </span>
        </button>
      </div>

      {/* ---------------- Mobile: floating trigger ---------------- */}
      <button
        type="button"
        onClick={() => setIsMenuOpen(true)}
        aria-label={`${activeItem.label}. Open navigation menu`}
        aria-haspopup="dialog"
        className="fixed right-4 top-4 z-[120] rounded-full bg-foreground p-3.5 text-background md:hidden"
      >
        <Menu size={20} strokeWidth={1.75} />
      </button>

      {/* ---------------- Overlay menu ---------------- */}
      {isMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
          className="fixed inset-0 z-[150] flex flex-col justify-center bg-background/95 px-8 backdrop-blur-2xl md:px-16"
        >
          <button
            type="button"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close navigation menu"
            className="absolute right-6 top-6 rounded-full border border-border p-3.5 text-foreground transition-colors hover:bg-surface-raised"
          >
            <X size={20} strokeWidth={1.5} />
          </button>

          <ul className="mx-auto w-full max-w-3xl">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => goTo(item.id)}
                    className={cn(
                      'group flex w-full items-center gap-5 border-b border-border py-6 text-left transition-colors',
                      isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <Icon size={20} strokeWidth={1.5} className="shrink-0" />
                    <span className="text-2xl font-medium tracking-[-0.02em] md:text-3xl">
                      {item.label}
                    </span>
                    {isActive && (
                      <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-foreground" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
};

export default Navigation;
