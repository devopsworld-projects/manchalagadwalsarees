import { Link } from 'react-router-dom';
import { SearchX, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminNotFound = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="max-w-md w-full text-center bg-background border border-border rounded-xl p-8 md:p-10 shadow-sm">
        <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-5">
          <SearchX className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="font-display text-3xl font-bold mb-2">404</h1>
        <p className="font-body text-base text-foreground mb-1">Admin page not found</p>
        <p className="font-body text-sm text-muted-foreground mb-6">
          The admin section you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Button asChild className="font-body tracking-wider uppercase text-xs">
            <Link to="/admin">
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              Back to Dashboard
            </Link>
          </Button>
          <Button asChild variant="outline" className="font-body tracking-wider uppercase text-xs">
            <Link to="/">Go to Storefront</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminNotFound;
