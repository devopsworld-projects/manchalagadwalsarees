import { AnnouncementBar } from '@/components/AnnouncementBar';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: 'Message sent!', description: "We'll get back to you soon." });
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen">
      <AnnouncementBar />
      <Navbar />
      <main className="container py-12 md:py-16">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-center mb-2">Contact Us</h1>
        <p className="text-center text-muted-foreground font-body mb-12">We'd love to hear from you</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {/* Contact info */}
          <div className="space-y-6">
            <h2 className="font-display text-2xl font-semibold">Get in Touch</h2>
            <div className="space-y-4">
              {[
                { icon: Phone, label: 'Phone', value: '+91 76800 41607' },
                { icon: Mail, label: 'Email', value: 'info@kaviwomensworld.com' },
                { icon: MapPin, label: 'Address', value: 'Hyderabad, Telangana, India' },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-3">
                  <item.icon className="h-5 w-5 text-gold mt-0.5" />
                  <div>
                    <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">{item.label}</p>
                    <p className="font-body">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
            <a
              href="https://wa.me/917680041607"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[hsl(142,70%,40%)] text-primary-foreground px-6 py-3 text-sm font-body tracking-wider rounded-sm hover:opacity-90 transition-opacity"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp Us
            </a>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="font-body text-sm font-semibold block mb-1">Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full border border-border bg-background px-4 py-2.5 font-body text-sm focus:outline-none focus:ring-1 focus:ring-primary rounded-sm"
              />
            </div>
            <div>
              <label className="font-body text-sm font-semibold block mb-1">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full border border-border bg-background px-4 py-2.5 font-body text-sm focus:outline-none focus:ring-1 focus:ring-primary rounded-sm"
              />
            </div>
            <div>
              <label className="font-body text-sm font-semibold block mb-1">Message</label>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                className="w-full border border-border bg-background px-4 py-2.5 font-body text-sm focus:outline-none focus:ring-1 focus:ring-primary rounded-sm resize-none"
              />
            </div>
            <button type="submit" className="w-full bg-primary text-primary-foreground py-3 text-sm tracking-[0.15em] font-body hover:bg-burgundy-light transition-colors">
              SEND MESSAGE
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
