
import { useState, useEffect } from 'react';
import { Home, Briefcase, Code, FolderGit2, Github, Award, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navigation = () => {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const navItems = [
    { id: 'hero', label: 'Home', icon: Home },
    { id: 'professional-journey', label: 'Professional Journey', icon: Briefcase },
    { id: 'technical-expertise', label: 'Technical Expertise', icon: Code },
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
    { id: 'github-activity', label: 'GitHub Activity', icon: Github },
    { id: 'certificates', label: 'Certificates', icon: Award },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      sections.forEach(section => {
        if (!section) return;
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          setActiveSection(section.id);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop,
        behavior: 'smooth'
      });
      setIsMobileMenuOpen(false);
    }
  };

  const activeItem = navItems.find(item => item.id === activeSection) || navItems[0];

  return (
    <>
      {/* Floating Single Item Navigation (Desktop) */}
      <div className="hidden md:flex fixed left-6 top-1/2 -translate-y-1/2 z-[110] items-center gap-4 group">
        {/* Subtle vertical indicator dots (on the left) */}
        <div className="flex flex-col gap-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={cn(
                "w-1.5 h-3 rounded-full transition-all duration-300",
                activeSection === item.id ? "bg-white h-8 shadow-[0_0_10px_rgba(255,255,255,0.5)]" : "bg-white/20 hover:bg-white/40"
              )}
              title={item.label}
            />
          ))}
        </div>

        {/* The active pill (to the right of the dots) */}
        <div
          className="flex items-center gap-3 px-5 py-3 rounded-full bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.2)] animate-in fade-in slide-in-from-left duration-500 cursor-pointer hover:scale-105 transition-transform"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <activeItem.icon size={18} />
          <span className="text-[10px] tracking-[0.3em] font-bold uppercase whitespace-nowrap">
            {activeItem.label}
          </span>
        </div>
      </div>

      {/* Mobile Header Bar */}
      <div className="md:hidden fixed top-0 left-0 w-full h-16 bg-black/80 backdrop-blur-xl border-b border-white/5 z-[100] flex justify-between items-center px-6">
        <span className="text-white text-[10px] tracking-[0.5em] font-bold uppercase">
          {activeItem.label}
        </span>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-white p-2"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Full Menu Overlay (Accessible via clicking active pill or mobile menu) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-2xl z-[150] flex flex-col items-center justify-center animate-in fade-in duration-500">
          <div className="absolute top-10 right-10">
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-4 bg-white text-black rounded-full hover:rotate-90 transition-transform duration-300"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex flex-col items-center gap-10">
            <div className="mb-10 text-center">
              <h2 className="text-white/20 text-xs tracking-[0.8em] uppercase mb-4">Navigate System</h2>
              <div className="w-20 h-px bg-white/20 mx-auto"></div>
            </div>

            <div className="flex flex-col items-center gap-12">
              {navItems.map((item, i) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={cn(
                    "group flex items-center gap-6 text-2xl md:text-4xl tracking-[0.4em] font-extralight uppercase transition-all",
                    activeSection === item.id ? "text-white scale-110" : "text-white/30 hover:text-white"
                  )}
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <item.icon size={24} className={cn("transition-transform duration-500 group-hover:rotate-12", activeSection === item.id ? "text-white" : "text-white/20")} />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;
