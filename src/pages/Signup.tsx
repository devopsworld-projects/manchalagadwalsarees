import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { AnnouncementBar } from '@/components/AnnouncementBar';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';

export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: window.location.origin,
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Check your email to verify your account');
      navigate('/login');
    }
  };



  return (
    <div className="min-h-screen">
      <AnnouncementBar />
      <Navbar />
      <main className="container max-w-md py-16">
        <h1 className="font-display text-3xl font-bold text-center mb-2">Create Account</h1>
        <p className="text-center text-muted-foreground font-body mb-8">
          Join us for a personalized shopping experience
        </p>



        <form onSubmit={handleSignup} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Full name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="pl-10 h-11 font-body"
              required
            />
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="pl-10 h-11 font-body"
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="password"
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="pl-10 h-11 font-body"
              minLength={6}
              required
            />
          </div>
          <Button type="submit" className="w-full h-11 font-body tracking-wider uppercase text-xs" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground font-body mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline font-medium">Sign in</Link>
        </p>
      </main>
      <Footer />
    </div>
  );
}
