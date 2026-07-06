import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description?: string;
  name?: string;
  type?: string;
}

export default function SEO({ title, description, name, type }: SEOProps) {
  const defaultDescription = "Join the ultimate Inter Church Cricket Tournament (ICCT'27). Experience the thrill, skill, and glory of top-rated cricket action.";
  const siteName = "ICCT'27 Cricket Tournament";

  return (
    <Helmet>
      <title>{title} | {siteName}</title>
      <meta name='description' content={description || defaultDescription} />
      
      {/* Facebook / Open Graph tags */}
      <meta property="og:type" content={type || "website"} />
      <meta property="og:title" content={`${title} | ${siteName}`} />
      <meta property="og:description" content={description || defaultDescription} />
      
      {/* Twitter tags */}
      <meta name="twitter:creator" content={name || siteName} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`${title} | ${siteName}`} />
      <meta name="twitter:description" content={description || defaultDescription} />
    </Helmet>
  );
}
