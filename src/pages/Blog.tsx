import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useParams, Link } from 'react-router-dom';
import { AnnouncementBar } from '@/components/AnnouncementBar';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { PageMeta } from '@/components/PageMeta';

export default function Blog() {
  const { data: posts = [] } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase.from('blog_posts').select('*').eq('is_published', true).order('published_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen">
      <PageMeta title="Blog — Manchala Gadwal Sarees" description="Read articles about sarees, fashion tips, styling guides, and more." canonicalPath="/blog" />
      <AnnouncementBar />
      <Navbar />
      <main className="container py-12">
        <h1 className="font-display text-3xl font-bold text-center mb-8">Our Blog</h1>
        {posts.length === 0 ? (
          <p className="text-center text-muted-foreground">No articles yet. Check back soon!</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post: any) => (
              <Link key={post.id} to={`/blog/${post.slug}`} className="group border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                {post.image_url && <img src={post.image_url} alt={post.title} className="w-full h-48 object-cover" />}
                <div className="p-4">
                  <p className="text-xs text-muted-foreground font-body mb-1">{new Date(post.published_at).toLocaleDateString()} • {post.author}</p>
                  <h2 className="font-display text-lg font-semibold group-hover:text-primary transition-colors">{post.title}</h2>
                  {post.excerpt && <p className="font-body text-sm text-muted-foreground mt-2 line-clamp-3">{post.excerpt}</p>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
