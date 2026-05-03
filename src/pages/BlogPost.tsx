import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useParams, Link } from 'react-router-dom';
import { AnnouncementBar } from '@/components/AnnouncementBar';
import { Navbar } from '@/components/Navbar';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Footer } from '@/components/Footer';
import { PageMeta } from '@/components/PageMeta';
import { ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function BlogPost() {
  const { slug } = useParams();
  const { data: post, isLoading } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: async () => {
      const { data, error } = await supabase.from('blog_posts').select('*').eq('slug', slug!).eq('is_published', true).maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  return (
    <div className="min-h-screen">
      <PageMeta title={post?.title || 'Blog'} description={post?.excerpt || ''} canonicalPath={`/blog/${slug}`} ogImage={post?.image_url} />
      <AnnouncementBar />
      <Navbar /><Breadcrumbs />
      <main className="container max-w-3xl py-12">
        <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6"><ArrowLeft className="h-4 w-4" /> Back to Blog</Link>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="w-full h-64 rounded-lg" />
            <Skeleton className="h-3 w-48" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
            <Skeleton className="h-3 w-4/6" />
          </div>
        ) : !post ? (
          <div className="text-center"><h1 className="font-display text-2xl mb-4">Post not found</h1><Link to="/blog" className="text-primary underline">Back to Blog</Link></div>
        ) : (
          <article>
            {post.image_url && <img src={post.image_url} alt={post.title} className="w-full h-64 object-cover rounded-lg mb-6" />}
            <p className="text-sm text-muted-foreground font-body mb-2">{new Date(post.published_at).toLocaleDateString()} • By {post.author}</p>
            <h1 className="font-display text-3xl font-bold mb-6">{post.title}</h1>
            <div className="font-body text-foreground/80 leading-relaxed whitespace-pre-wrap">{post.content}</div>
          </article>
        )}
      </main>
      <Footer />
    </div>
  );
}
