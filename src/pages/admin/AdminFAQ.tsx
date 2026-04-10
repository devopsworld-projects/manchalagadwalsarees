import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const defaultForm = { question: '', answer: '', category: 'General', sort_order: 0, is_active: true };

export default function AdminFAQ() {
  const qc = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(defaultForm);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['admin-faq'],
    queryFn: async () => {
      const { data, error } = await supabase.from('faq_items').select('*').order('sort_order');
      if (error) throw error;
      return data;
    },
  });

  const save = useMutation({
    mutationFn: async (d: any) => {
      const payload = { question: d.question, answer: d.answer, category: d.category, sort_order: d.sort_order, is_active: d.is_active };
      if (d.id) { const { error } = await supabase.from('faq_items').update(payload).eq('id', d.id); if (error) throw error; }
      else { const { error } = await supabase.from('faq_items').insert(payload); if (error) throw error; }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-faq'] }); toast.success('Saved'); close(); },
    onError: (e: any) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from('faq_items').delete().eq('id', id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-faq'] }); toast.success('Deleted'); },
  });

  const close = () => { setDialogOpen(false); setEditingId(null); setForm(defaultForm); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">FAQ Management</h1><p className="text-muted-foreground text-sm">Manage frequently asked questions.</p></div>
        <Button onClick={() => { setForm({ ...defaultForm, sort_order: items.length }); setDialogOpen(true); }}><Plus className="h-4 w-4 mr-2" /> Add FAQ</Button>
      </div>

      {isLoading ? <p className="text-center py-12 text-muted-foreground">Loading...</p> : items.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground border rounded-lg">No FAQs yet.</div>
      ) : (
        <div className="space-y-3">
          {items.map((item: any) => (
            <div key={item.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-medium">{item.question}</p>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.answer}</p>
                  <p className="text-xs text-muted-foreground mt-1">Category: {item.category}</p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Badge variant={item.is_active ? 'default' : 'secondary'}>{item.is_active ? 'Active' : 'Hidden'}</Badge>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingId(item.id); setForm({ question: item.question, answer: item.answer, category: item.category, sort_order: item.sort_order, is_active: item.is_active }); setDialogOpen(true); }}><Pencil className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => del.mutate(item.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={v => { if (!v) close(); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingId ? 'Edit' : 'Add'} FAQ</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Question *</Label><Input value={form.question} onChange={e => setForm(f => ({ ...f, question: e.target.value }))} /></div>
            <div><Label>Answer *</Label><Textarea value={form.answer} onChange={e => setForm(f => ({ ...f, answer: e.target.value }))} rows={4} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Category</Label><Input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} /></div>
              <div><Label>Sort Order</Label><Input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))} /></div>
            </div>
            <div className="flex items-center gap-2"><Switch checked={form.is_active} onCheckedChange={v => setForm(f => ({ ...f, is_active: v }))} /><Label>Active</Label></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={close}>Cancel</Button>
            <Button onClick={() => { if (!form.question.trim() || !form.answer.trim()) { toast.error('Question and answer required'); return; } save.mutate({ ...form, id: editingId || undefined }); }} disabled={save.isPending}>{save.isPending ? 'Saving...' : 'Save'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
