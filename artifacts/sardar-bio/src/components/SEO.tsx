import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  type?: "website" | "article";
}

export default function SEO({
  title,
  description,
  canonical,
  image = "https://www.sardarbioorganic.com/og-image.jpg",
  type = "website",
}: SEOProps) {
  const url =
    canonical ||
    window.location.href;

  return (
    <Helmet>
      <title>{title}</title>

      <meta
        name="description"
        content={description}
      />

      <meta
        name="robots"
        content="index,follow"
      />

      <link
        rel="canonical"
        href={url}
      />

      <meta
        property="og:title"
        content={title}
      />

      <meta
        property="og:description"
        content={description}
      />

      <meta
        property="og:url"
        content={url}
      />

      <meta
        property="og:type"
        content={type}
      />

      <meta
        property="og:image"
        content={image}
      />

      <meta
        property="og:site_name"
        content="Sardar Bio Organic"
      />

      <meta
        name="twitter:card"
        content="summary_large_image"
      />

      <meta
        name="twitter:title"
        content={title}
      />

      <meta
        name="twitter:description"
        content={description}
      />

      <meta
        name="twitter:image"
        content={image}
      />
    </Helmet>
  );
}