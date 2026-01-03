
import React from 'react';
import Section from '@/components/common/Section';
import Container from '@/components/common/Container';
import { Briefcase, MapPin, Calendar, ArrowUpRight } from 'lucide-react';

interface Experience {
  title: string;
  company: string;
  location: string;
  period: string;
  description: string[];
  skills: string[];
}

const experiences: Experience[] = [
  {
    title: 'ML Engineer',
    company: 'Next AI',
    location: 'Kathmandu, Nepal',
    period: 'JUN 2024 - PRESENT',
    description: [
      'Developed advanced AI solutions and ML models including RAG-based systems.',
      'Optimized backend services with FastAPI and MongoDB for production scale.'
    ],
    skills: ['Python', 'React', 'FastAPI', 'Docker', 'Qdrant', 'LLMs', 'MongoDB']
  },
  {
    title: 'Python Intern',
    company: 'Inspiring Lab',
    location: 'Lalitpur, Nepal',
    period: 'NOV 2023 - MAR 2024',
    description: [
      'Built automated web scraping solutions with high accuracy and extraction efficiency.',
      'Implemented secure authentication systems and API development tasks.'
    ],
    skills: ['Python', 'Selenium', 'Scrapy', 'FastAPI', 'Pandas', 'Git']
  }
];

const ProfessionalJourney = () => {
  return (
    <Section id="professional-journey">
      <Container className="py-24">
        {/* Header */}
        <div className="text-center mb-24">
          <span className="text-xs tracking-[0.4em] text-white uppercase mb-4 block font-bold">Experience</span>
          <h2 className="text-4xl md:text-6xl font-extralight text-white tracking-tighter mb-4">
            Professional Journey
          </h2>
          <div className="w-24 h-px bg-white/40 mx-auto"></div>
        </div>

        <div className="max-w-4xl mx-auto border-l border-white/20 pl-8 md:pl-20 space-y-20 relative">
          {experiences.map((exp, index) => (
            <div key={index} className="relative group animate-fade-in" style={{ animationDelay: `${index * 150}ms` }}>
              {/* Point on timeline */}
              <div className="absolute -left-[37px] md:-left-[85px] top-0 w-3 h-3 rounded-full bg-black border border-white/60 group-hover:bg-white group-hover:border-white transition-all duration-500 scale-100 group-hover:scale-150 shadow-[0_0_10px_rgba(255,255,255,0.2)]"></div>

              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-3xl font-light text-white tracking-tight group-hover:translate-x-1 transition-transform inline-flex items-center gap-2">
                    {exp.title}
                    <ArrowUpRight className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
                  </h3>
                  <div className="flex items-center gap-5 text-white text-[11px] tracking-widest uppercase mt-3 font-bold">
                    <span className="flex items-center gap-2 text-white"><Briefcase size={14} className="text-white" /> {exp.company}</span>
                    <span className="flex items-center gap-2 text-white"><MapPin size={14} className="text-white" /> {exp.location}</span>
                  </div>
                </div>
                <div className="text-white text-[11px] tracking-[0.3em] font-bold flex items-center gap-2 mt-2 md:mt-0 uppercase">
                  <Calendar size={14} className="text-white" /> {exp.period}
                </div>
              </div>

              <div className="space-y-4 max-w-2xl">
                {exp.description.map((item, i) => (
                  <p key={i} className="text-white font-light leading-relaxed text-base">
                    {item}
                  </p>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 mt-8">
                {exp.skills.map((skill) => (
                  <span key={skill} className="px-4 py-1.5 text-[10px] tracking-[0.2em] font-bold text-white border border-white/40 rounded-full uppercase hover:text-black hover:bg-white hover:border-white transition-all duration-300">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default ProfessionalJourney;
