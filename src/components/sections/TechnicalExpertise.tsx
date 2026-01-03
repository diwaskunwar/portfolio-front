
import React, { useEffect, useRef, useState } from 'react';
import Section from '@/components/common/Section';
import Container from '@/components/common/Container';
import { cn } from '@/lib/utils';

interface Skill {
  name: string;
  proficiency: number;
}

interface SkillCategory {
  title: string;
  skills: Skill[];
}

const skillCategories: SkillCategory[] = [
  {
    title: 'TECHNICAL CORE',
    skills: [
      { name: 'Python', proficiency: 95 },
      { name: 'React', proficiency: 82 },
      { name: 'PHP', proficiency: 86 }
    ]
  },
  {
    title: 'DATABASE & STORE',
    skills: [
      { name: 'MongoDB', proficiency: 95 },
      { name: 'PostgreSQL', proficiency: 72 },
      { name: 'Qdrant', proficiency: 95 },
      { name: 'FAISS', proficiency: 92 }
    ]
  },
  {
    title: 'AI & DATA',
    skills: [
      { name: 'LLM Systems', proficiency: 95 },
      { name: 'Pandas / NumPy', proficiency: 92 },
      { name: 'FastAPI', proficiency: 95 },
      { name: 'Docker / CentOS', proficiency: 83 }
    ]
  },
  {
    title: 'TOOLS & SOFT',
    skills: [
      { name: 'Jira / Trello', proficiency: 95 },
      { name: 'Selenium / Testing', proficiency: 95 },
      { name: 'Git Workflow', proficiency: 94 },
      { name: 'Networking', proficiency: 79 }
    ]
  }
];

const TechnicalExpertise = () => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <Section id="technical-expertise">
      <Container className="py-24" ref={containerRef}>
        {/* Header */}
        <div className="text-center mb-20">
          <span className="text-xs tracking-[0.4em] text-white uppercase mb-4 block font-bold">Capabilities</span>
          <h2 className="text-4xl md:text-6xl font-extralight text-white tracking-tighter mb-4">
            Technical Expertise
          </h2>
          <div className="w-24 h-px bg-white/40 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
          {skillCategories.map((category, index) => (
            <div key={index} className="space-y-10">
              <h3 className="text-[11px] tracking-[0.5em] font-medium text-white border-l-2 border-white pl-4 uppercase">{category.title}</h3>

              <div className="grid grid-cols-1 gap-8">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skillIndex} className="group">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-medium tracking-[0.2em] text-white uppercase group-hover:text-white transition-colors">{skill.name}</span>
                      <span className="text-[10px] text-white group-hover:text-white transition-colors uppercase font-bold">{skill.proficiency}%</span>
                    </div>
                    {/* High-Contrast Progress Bar with Liquid Animation */}
                    <div className="h-[6px] w-full bg-white/10 relative overflow-hidden rounded-full border border-white/10">
                      <div
                        className={cn(
                          "absolute inset-y-0 left-0 progress-liquid transition-all duration-1000 ease-out",
                          isVisible ? "opacity-100" : "opacity-0"
                        )}
                        style={{
                          width: isVisible ? `${skill.proficiency}%` : '0%',
                          '--progress-width': `${skill.proficiency}%`
                        } as React.CSSProperties}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default TechnicalExpertise;
