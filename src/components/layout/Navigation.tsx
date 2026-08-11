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
import { scrollToSection } from '@/lib/scrollToSection';

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
    scrollToSection(id);
    setIsMenuOpen(false);
  };

  // Only the mobile trigger needs this now: it announces where you are.
  const activeItem = NAV_ITEMS.find(item => item.id === activeSection) ?? NAV_ITEMS[0];

  return (
    <>
      {/* ---------------- Desktop: marker rail, panel on hover ----------------
          Nothing here occupies layout. At rest the rail is a column of thin
          marks in the page's own left margin; the full labelled nav is an
          absolutely positioned panel that only exists on hover or keyboard
          focus, and is allowed to cover content because it is transient. */}
      {/* pr-5 is a hover cushion, not spacing: it widens the pointer target
          over the container's own gutter without moving the marks inward,
          which would put them under the content edge at md widths. */}
      <div className="group/rail fixed left-3 top-1/2 z-[110] hidden -translate-y-1/2 py-4 pr-5 md:block">
        {/* Position indicator only. Not focusable: the panel below carries
            every interaction, so tabbing cannot land on an invisible target. */}
        <div
          aria-hidden="true"
          className="flex flex-col gap-2 transition-opacity duration-300 ease-swift group-hover/rail:opacity-0 group-focus-within/rail:opacity-0"
        >
          {NAV_ITEMS.map((item) => (
            <span
              key={item.id}
              className={cn(
                'w-1.5 rounded-full transition-all duration-300 ease-swift',
                activeSection === item.id
                  ? 'h-8 bg-foreground'
                  : 'h-3 bg-foreground/25'
              )}
            />
          ))}
        </div>

        <nav
          aria-label="Section navigation"
          className="pointer-events-none absolute left-0 top-1/2 w-max -translate-x-2 -translate-y-1/2 opacity-0 transition-[opacity,transform] duration-300 ease-swift group-hover/rail:pointer-events-auto group-hover/rail:translate-x-0 group-hover/rail:opacity-100 group-focus-within/rail:pointer-events-auto group-focus-within/rail:translate-x-0 group-focus-within/rail:opacity-100 motion-reduce:transition-none"
        >
          <ul className="glass rounded-lg p-2">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => goTo(item.id)}
                    aria-current={isActive ? 'true' : undefined}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors duration-200',
                      isActive
                        ? 'bg-foreground text-background'
                        : 'text-muted-foreground hover:bg-surface-raised hover:text-foreground'
                    )}
                  >
                    <Icon size={15} strokeWidth={1.75} className="shrink-0" />
                    <span className="whitespace-nowrap font-mono text-[11px] font-medium uppercase tracking-[0.14em]">
                      {item.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
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
