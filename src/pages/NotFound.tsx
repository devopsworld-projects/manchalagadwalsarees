import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { AnnouncementBar } from '@/components/AnnouncementBar';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { PageMeta } from '@/components/PageMeta';
import { SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen">
      <PageMeta title="Page Not Found" description="The page you're looking for doesn't exist." />
      <AnnouncementBar />
      <Navbar />
      <main className="container max-w-lg py-20 text-center">
        <SearchX className="h-20 w-20 text-muted-foreground/40 mx-auto mb-6" />
        <h1 className="font-display text-5xl font-bold mb-3">404</h1>
        <p className="font-body text-lg text-muted-foreground mb-2">Page not found</p>
        <p className="font-body text-sm text-muted-foreground mb-8">
          The page <span className="font-mono text-foreground">{location.pathname}</span> doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="font-body tracking-wider uppercase text-xs">
            <Link to="/">Go Home</Link>
          </Button>
          <Button asChild variant="outline" className="font-body tracking-wider uppercase text-xs">
            <Link to="/collections">Browse Collections</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
