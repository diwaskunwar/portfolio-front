import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import Section from '@/components/common/Section';
import Container from '@/components/common/Container';
import Reveal, { TextReveal } from '@/components/common/Reveal';
import { useProfile } from '@/store/ProfileContext';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const formatIssued = (issued?: { month?: number; year?: number }) => {
  if (!issued?.year) return '';
  const month = issued.month ? MONTHS[issued.month - 1] : undefined;
  return month ? `${month} ${issued.year}` : `${issued.year}`;
};

const Certificates = () => {
  const { profileData } = useProfile();
  // Read from the profile rather than a hard-coded list. The previous list
  // named certificates that do not appear anywhere in the profile data.
  const certificates = profileData?.certifications ?? [];

  return (
    <Section id="certificates" className="py-28 md:py-36">
      <Container className="w-full">
        <div className="mb-16 max-w-2xl">
          <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-medium leading-[1.08] tracking-[-0.035em] text-foreground">
            <TextReveal text="Certificates" />
          </h2>
          <Reveal delay={0.15}>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              Verifiable credentials. Every one links to its record.
            </p>
          </Reveal>
        </div>

        {certificates.length === 0 ? (
          <div className="rounded-lg border border-border p-10">
            <p className="text-muted-foreground">No certificates to show yet.</p>
          </div>
        ) : (
          <ul className="border-t border-border">
            {certificates.map((cert, i) => {
              const Row = cert.url ? 'a' : 'div';
              return (
                <Reveal as="li" key={cert.credentialId ?? cert.name} delay={i * 0.07} amount={0.4}>
                  <Row
                    {...(cert.url
                      ? { href: cert.url, target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                    className="group grid grid-cols-1 items-baseline gap-2 border-b border-border py-8 transition-colors duration-300 hover:bg-surface/40 md:grid-cols-12 md:gap-8 md:px-4"
                  >
                    <span className="label-mono md:col-span-2">
                      {formatIssued(cert.issueDate)}
                    </span>

                    <h3 className="text-xl font-medium tracking-[-0.02em] text-foreground md:col-span-6 md:text-2xl">
                      {cert.name}
                    </h3>

                    <span className="text-sm text-muted-foreground md:col-span-3">
                      {cert.authority}
                    </span>

                    <span className="md:col-span-1 md:justify-self-end">
                      {cert.url && (
                        <ArrowUpRight
                          size={20}
                          strokeWidth={1.5}
                          className="text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground motion-reduce:transition-none"
                        />
                      )}
                    </span>
                  </Row>
                </Reveal>
              );
            })}
          </ul>
        )}
      </Container>
    </Section>
  );
};

export default Certificates;
