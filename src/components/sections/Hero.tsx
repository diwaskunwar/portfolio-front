
import { useProfile } from '@/store/ProfileContext';
import Section from '@/components/common/Section';
import Container from '@/components/common/Container';
import { Github as GitHubIcon, Linkedin as LinkedInIcon, Mail as MailIcon, ExternalLink, Phone as PhoneIcon, BookOpen as BookIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  const { profileData, loading } = useProfile();

  if (loading || !profileData) {
    return (
      <Section id="hero" className="bg-gray-900 text-white">
        <Container className="flex items-center justify-center">
          <div className="text-center">
            <div className="h-8 w-48 bg-gray-800 animate-pulse rounded mb-4 mx-auto"></div>
            <div className="h-4 w-64 bg-gray-800 animate-pulse rounded mb-8 mx-auto"></div>
          </div>
        </Container>
      </Section>
    );
  }

  const { name, headline, summary, Urls, quote: profileQuote } = profileData.profile;

  // Format the summary with highlighted keywords
  const formatSummary = (text: string) => {
    if (!text) return '';

    // Keywords to highlight
    const keywords = [
      'Python', 'backend development', 'Django', 'Flask/FastAPI',
      'Beautiful Soup', 'Selenium', 'pandas', 'NumPy', 'Plotly', 'Seaborn',
      'data visualization', 'gemini', 'Document Chatbot', 'stock market'
    ];

    // Special highlight for actionable insights
    const specialKeywords = ['actionable insights', 'innovation meets impact'];

    let formattedText = text;

    // Replace keywords with highlighted spans
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      formattedText = formattedText.replace(regex, `<span class="text-blue-400 font-medium hover:text-blue-300 transition-colors">${keyword}</span>`);
    });

    // Replace special keywords
    specialKeywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      formattedText = formattedText.replace(regex, `<span class="text-yellow-400 font-medium hover:text-yellow-300 transition-colors">${keyword}</span>`);
    });

    // Add rocket emoji at the beginning
    formattedText = '<span class="text-2xl">🚀</span> ' + formattedText;

    // Enhance paragraphs
    formattedText = formattedText.replace(/\n\n/g, '</p><p class="mt-4">');

    return formattedText;
  };

  // Prefer quote from profile JSON, fallback to a default
  const quote = profileQuote || "I thrive in environments where innovation meets impact, and I'm eager to contribute my skills to projects that align with my passion for technology.";

  const formattedSummary = formatSummary(summary);

  // Map URL names to icons
  const getIconForUrl = (urlName: string) => {
    switch (urlName) {
      case 'GitHub':
        return GitHubIcon;
      case 'LinkedIn':
        return LinkedInIcon;
      case 'Email':
        return MailIcon;
      case 'Website':
        return ExternalLink;
      case 'Hugging Face':
        return BookIcon;
      case 'Phone':
        return PhoneIcon;
      default:
        return ExternalLink;
    }
  };

  // Create social links from all URLs in the profile data
  const socialLinks = Urls.map(url => ({
    name: url.name,
    icon: getIconForUrl(url.name),
    url: url.url
  }));

  return (
    <Section id="hero" className="bg-gray-900 text-white">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent text-6xl font-bold mb-4">
            {name}
          </h1>
          <p className="text-gray-300 text-xl mb-10">{headline}</p>

          <div className="flex flex-wrap gap-3 justify-center mb-8">
            <span className="bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm px-4 py-1.5 rounded-full shadow-md shadow-blue-900/20 border border-blue-500/30 hover:scale-105 transition-transform duration-200">🤖 AI Engineer</span>
            <span className="bg-gradient-to-r from-purple-600 to-purple-500 text-white text-sm px-4 py-1.5 rounded-full shadow-md shadow-purple-900/20 border border-purple-500/30 hover:scale-105 transition-transform duration-200">🧠 ML Specialist</span>
            <span className="bg-gradient-to-r from-indigo-800 to-indigo-700 text-white text-sm px-4 py-1.5 rounded-full shadow-md shadow-indigo-900/20 border border-indigo-700/30 hover:scale-105 transition-transform duration-200">🌐 Backend Developer</span>
            <span className="bg-gradient-to-r from-cyan-700 to-cyan-600 text-white text-sm px-4 py-1.5 rounded-full shadow-md shadow-cyan-900/20 border border-cyan-600/30 hover:scale-105 transition-transform duration-200">📊 Data Engineer</span>
          </div>

          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/90 rounded-lg p-8 backdrop-blur-sm mb-10 border border-gray-700 shadow-lg shadow-blue-900/20">
            <p className="text-gray-200 text-left leading-relaxed" dangerouslySetInnerHTML={{ __html: formattedSummary }}></p>
          </div>

          <div className="bg-gradient-to-br from-indigo-900/80 to-purple-900/70 rounded-lg p-8 backdrop-blur-sm mb-12 border border-indigo-700 shadow-lg shadow-purple-900/30">
            <blockquote className="text-gray-200 italic text-lg">
              <span className="text-4xl text-indigo-400 leading-none font-serif">"</span>
              {quote}
              <span className="text-4xl text-indigo-400 leading-none font-serif">"</span>
            </blockquote>
          </div>

          <div className="flex flex-wrap gap-6 justify-center mt-4">
            {socialLinks.map((link) => (
              <a href={link.url} key={link.name} target="_blank" rel="noopener noreferrer">
                <Button
                  variant="outline"
                  className={`flex items-center px-5 py-2.5 rounded-md ${link.name === 'GitHub' ? 'bg-blue-600' :
                    link.name === 'LinkedIn' ? 'bg-indigo-600' :
                    link.name === 'Hugging Face' ? 'bg-purple-600' :
                    link.name === 'Email' ? 'bg-cyan-600' :
                    link.name === 'Phone' ? 'bg-emerald-600' : 'bg-gray-700'}
                    hover:opacity-90 text-white border-none shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105`}
                >
                  {link.name === 'Hugging Face' ? (
                    <img src="https://huggingface.co/front/assets/huggingface_logo-noborder.svg" alt="Hugging Face" className="mr-2 h-4 w-4" />
                  ) : (
                    <link.icon className="mr-2 h-4 w-4" />
                  )}
                  {link.name}
                </Button>
              </a>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default Hero;
