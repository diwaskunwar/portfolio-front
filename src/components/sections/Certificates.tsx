
import React from 'react';
import Section from '@/components/common/Section';
import Container from '@/components/common/Container';
import { Award, ExternalLink, Calendar, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface Certificate {
  title: string;
  issuer: string;
  date: string;
  link?: string;
}

const certificates: Certificate[] = [
  {
    title: 'Python for Data Science and Machine Learning',
    issuer: 'Coursera / IBM',
    date: '2023',
  },
  {
    title: 'Advanced Machine Learning with Python',
    issuer: 'DeepLearning.AI',
    date: '2024',
  },
  {
    title: 'Backend Engineering Professional',
    issuer: 'Frontend Masters',
    date: '2023',
  }
];

const Certificates = () => {
  return (
    <Section id="certificates">
      <Container className="py-24">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="text-xs tracking-[0.4em] text-white uppercase mb-4 block font-bold">Recognition</span>
          <h2 className="text-4xl md:text-6xl font-extralight text-white tracking-tighter mb-4">
            Certificates
          </h2>
          <div className="w-24 h-px bg-white/40 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert, index) => (
            <Card key={index} className="bg-white/[0.03] backdrop-blur-md border-white/5 rounded-2xl group hover:bg-white/5 transition-all duration-500 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                <Award size={64} className="text-white" />
              </div>
              <CardContent className="p-8 relative z-10">
                <div className="mb-6 flex justify-between items-start">
                  <div className="p-2 border border-white/20 rounded-lg">
                    <Award className="h-5 w-5 text-white" />
                  </div>
                  {cert.link && (
                    <a href={cert.link} target="_blank" rel="noopener noreferrer" className="text-white hover:scale-125 transition-all">
                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>

                <h3 className="text-lg font-light text-white mb-3 tracking-tight leading-snug group-hover:translate-x-1 transition-transform">
                  {cert.title}
                </h3>

                <div className="flex flex-col gap-3 mt-auto">
                  <div className="flex items-center gap-2 text-white text-[10px] tracking-[0.2em] uppercase font-bold">
                    <CheckCircle2 size={12} className="text-white" /> {cert.issuer}
                  </div>
                  <div className="flex items-center gap-2 text-white text-[10px] tracking-[0.2em] uppercase font-bold">
                    <Calendar size={12} className="text-white" /> {cert.date}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default Certificates;
