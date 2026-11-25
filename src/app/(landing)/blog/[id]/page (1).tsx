import { Metadata } from 'next';
import BlogClientPage from './components/BlogClientPage';
import { client } from '@/sanity/client';

// Function to fetch all blog posts for static generation
async function getAllBlogPosts() {
  try {
    // This query fetches all blog post slugs from Sanity
    const query = `*[_type == "post"] { slug { current } }`;
    const posts = await client.fetch(query);
    return posts;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return []; // Return empty array to avoid build failures
  }
}

// This function is required for static site generation with dynamic routes
export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  
  // Return an array of objects with the id parameter
  return posts.map((post: { slug: { current: string } }) => ({
    id: post.slug.current,
  }));
}

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = params;
  
  return {
    title: `Blog Post - ${id} | Sourav mondal`,
    description: 'Cybersecurity insights and security research by Sourav mondal.',
    keywords: 'cybersecurity, bug bounty, security research, ethical hacking, penetration testing',
    openGraph: {
      title: `Blog Post - ${id} | Sourav mondal`,
      description: 'Cybersecurity insights and security research.',
      url: `https://mondalsourav.com/blog/${id}`,
      siteName: 'sourav mondal',
      images: [
        {
          url: 'https://mondalsourav.com/og-blog.png',
          width: 1200,
          height: 630,
          alt: 'sourav mondal Blog',
        },
      ],
      locale: 'en_US',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Blog Post - ${id} | sourav mondal`,
      description: 'Cybersecurity insights and security research.',
      images: ['https://mondalsourav.com/og-blog.png'],
      creator: '@hacker1engineer',
    },
    alternates: {
      canonical: `https://mondalsourav.com/blog/${id}`,
    },
  };
}

// The page component
export default function BlogPostPage({ params }: Props) {
  return <BlogClientPage params={params} />;
}
