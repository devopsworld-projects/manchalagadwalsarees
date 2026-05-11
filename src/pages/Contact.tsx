import { AnnouncementBar } from '@/components/AnnouncementBar';
import { Navbar } from '@/components/Navbar';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Footer } from '@/components/Footer';
import { PageMeta } from '@/components/PageMeta';
import { Phone, Mail, MapPin, MessageCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name.trim().length < 2) { toast.error('Please enter a valid name'); return; }
    if (form.message.trim().length < 10) { toast.error('Message must be at least 10 characters'); return; }

    setLoading(true);
    try {
      const { error } = await supabase.from('contact_submissions').insert({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        message: form.message.trim(),
      });
      if (error) throw error;
      setSubmitted(true);
      toast.success("Message sent! We'll get back to you soon.");
    } catch (err: any) {
      toast.error(err.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <PageMeta
        title="Contact Us"
        description="Get in touch with Manchala Gadwal Sarees. Call, email, or WhatsApp us for inquiries about sarees and orders."
        canonicalPath="/contact"
      />
      <AnnouncementBar />
      <Navbar /><Breadcrumbs />
      <main className="container py-12 md:py-16">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-center mb-2">Contact Us</h1>
        <p className="text-center text-muted-foreground font-body mb-12">We'd love to hear from you</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {/* Contact info */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="font-display text-2xl font-semibold">Get in Touch</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-gold mt-0.5" />
                  <div>
                    <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">Email</p>
                    <a href="mailto:info@manchalagadwalsarees.com" className="font-body hover:text-primary">info@manchalagadwalsarees.com</a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gold mt-0.5" />
                  <div>
                    <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">Address</p>
                    <p className="font-body">Hyderabad, Telangana, India</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Management */}
            <div>
              <h2 className="font-display text-2xl font-semibold mb-1">Management</h2>
              <p className="font-body text-sm text-muted-foreground mb-4">
                <span className="font-semibold text-foreground">Founder:</span> Manchala Madappa
              </p>

              <h3 className="font-display text-lg font-semibold mb-3">Team</h3>
              <ul className="space-y-3">
                {[
                  { name: 'Krishna Murthy Manchala', phone: '9030866421' },
                  { name: 'Raghavendra Manchala', phone: '9885879188' },
                  { name: 'Siva Murthy Kunigiri', phone: '9848577448' },
                  { name: 'Pavan Kunigiri', phone: '9493134992' },
                ].map(member => (
                  <li key={member.phone} className="flex items-center justify-between gap-3 border-b border-border/60 pb-2">
                    <div className="flex items-start gap-3">
                      <Phone className="h-4 w-4 text-gold mt-1" />
                      <div>
                        <p className="font-body text-sm font-semibold">{member.name}</p>
                        <a href={`tel:+91${member.phone}`} className="font-body text-sm text-muted-foreground hover:text-primary">
                          +91 {member.phone.slice(0, 5)} {member.phone.slice(5)}
                        </a>
                      </div>
                    </div>
                    <a
                      href={`https://wa.me/91${member.phone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`WhatsApp ${member.name}`}
                      className="inline-flex items-center gap-1 text-[hsl(142,70%,40%)] hover:opacity-80 text-xs font-body tracking-wider"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span className="hidden sm:inline">WhatsApp</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Form */}
          {submitted ? (
            <div className="flex flex-col items-center justify-center text-center space-y-4 py-12">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold">Thank You!</h3>
              <p className="font-body text-muted-foreground">Your message has been received. We'll get back to you within 24 hours.</p>
              <Button variant="outline" onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', message: '' }); }} className="font-body text-xs tracking-wider uppercase">
                Send Another Message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="font-body text-sm font-semibold block mb-1">Name *</label>
                <Input
                  required
                  maxLength={100}
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="font-body"
                />
              </div>
              <div>
                <label className="font-body text-sm font-semibold block mb-1">Email *</label>
                <Input
                  type="email"
                  required
                  maxLength={255}
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="font-body"
                />
              </div>
              <div>
                <label className="font-body text-sm font-semibold block mb-1">Phone</label>
                <Input
                  type="tel"
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="+91 XXXXX XXXXX"
                  className="font-body"
                />
              </div>
              <div>
                <label className="font-body text-sm font-semibold block mb-1">Message *</label>
                <Textarea
                  required
                  rows={5}
                  maxLength={1000}
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  className="font-body resize-none"
                />
                <p className="text-xs text-muted-foreground font-body mt-1 text-right">{form.message.length}/1000</p>
              </div>
              <Button type="submit" disabled={loading} className="w-full h-12 font-body tracking-[0.15em] uppercase text-xs">
                {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Sending...</> : 'Send Message'}
              </Button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
