import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import Section from '@/components/common/Section';
import Container from '@/components/common/Container';
import SectionHeader from '@/components/common/SectionHeader';
import Reveal from '@/components/common/Reveal';
import { useProfile } from '@/store/ProfileContext';
import type { ProfileData } from '@/services/apiService';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const formatIssued = (issued?: { month?: number; year?: number }) => {
  if (!issued?.year) return '';
  const month = issued.month ? MONTHS[issued.month - 1] : undefined;
  return month ? `${month} ${issued.year}` : `${issued.year}`;
};

type Certificate = NonNullable<ProfileData['certifications']>[number];

/* Held here because the profile feed does not carry it. Every field is off
   the real Coursera record, and the link resolves to the public verification
   page, which is the only reason it earns a place on the page. */
const KNOWN: Certificate[] = [
  {
    name: 'Supervised Machine Learning: Regression and Classification',
    authority: 'DeepLearning.AI and Stanford University',
    issueDate: { month: 5, year: 2024 },
    credentialId: '8HFWUFCXZS8C',
    url: 'https://www.coursera.org/account/accomplishments/verify/8HFWUFCXZS8C',
  },
];

const Certificates = () => {
  const { profileData } = useProfile();

  /* Merged rather than replaced, so anything the profile feed starts
     returning appears without a code change. Credential ID is the identity
     where there is one, since the same course is titled differently by
     different sources. */
  const certificates = [...KNOWN];
  for (const cert of profileData?.certifications ?? []) {
    const seen = certificates.some((known) =>
      cert.credentialId
        ? known.credentialId === cert.credentialId
        : known.name === cert.name
    );
    if (!seen) certificates.push(cert);
  }

  return (
    <Section id="certificates" className="py-10 sm:py-12 md:py-14 xl:py-16">
      <Container className="w-full">
        <SectionHeader chapter="certificates" command="gpg --verify credential.sig" title="Certificates">
          Verifiable credentials. Every one links to its record.
        </SectionHeader>

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

                    <div className="md:col-span-6">
                      <h3 className="text-xl font-medium tracking-[-0.02em] text-foreground md:text-2xl">
                        {cert.name}
                      </h3>
                      {cert.credentialId && (
                        // The ID is what makes the claim checkable, so it is
                        // printed rather than hidden behind the link.
                        <p className="mt-2 font-mono text-[11px] tracking-[0.06em] text-faint">
                          Credential {cert.credentialId}
                        </p>
                      )}
                    </div>

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
