import { useEffect, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove, SortableContext, useSortable, verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plus, Trash2, Save, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Card, CardContent, CardHeader, CardTitle,
} from '@/components/ui/card';
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import type { HomepageSection } from '@/hooks/useHomepageSections';

interface DraftSection extends HomepageSection {
  _dirty?: boolean;
}

function SortableRow({ section, onChange, onDelete }: {
  section: DraftSection;
  onChange: (next: DraftSection) => void;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <Card ref={setNodeRef} style={style} className={section._dirty ? 'border-primary' : ''}>
      <CardContent className="p-4 flex items-start gap-3">
        <button
          type="button"
          className="mt-2 p-1 cursor-grab touch-none text-muted-foreground hover:text-foreground"
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder"
        >
          <GripVertical className="h-5 w-5" />
        </button>

        <div className="flex-1 grid gap-3 md:grid-cols-2">
          <div>
            <Label className="text-xs">Section key</Label>
            <Input value={section.section_key} disabled className="font-mono text-xs" />
          </div>
          <div>
            <Label className="text-xs">Title</Label>
            <Input
              value={section.title ?? ''}
              onChange={(e) => onChange({ ...section, title: e.target.value, _dirty: true })}
            />
          </div>
          <div className="md:col-span-2">
            <Label className="text-xs">Subtitle</Label>
            <Textarea
              rows={2}
              value={section.subtitle ?? ''}
              onChange={(e) => onChange({ ...section, subtitle: e.target.value, _dirty: true })}
            />
          </div>
          <div>
            <Label className="text-xs">Image URL</Label>
            <Input
              value={section.image_url ?? ''}
              placeholder="https://…"
              onChange={(e) => onChange({ ...section, image_url: e.target.value, _dirty: true })}
            />
          </div>
          <div className="flex items-center gap-3 self-end">
            <Switch
              checked={section.is_enabled}
              onCheckedChange={(v) => onChange({ ...section, is_enabled: v, _dirty: true })}
            />
            <span className="text-sm flex items-center gap-1">
              {section.is_enabled ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              {section.is_enabled ? 'Visible' : 'Hidden'}
            </span>
            <Button
              size="sm"
              variant="ghost"
              className="ml-auto text-destructive"
              onClick={() => onDelete(section.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PreviewPane({ sections }: { sections: DraftSection[] }) {
  const visible = sections.filter((s) => s.is_enabled);
  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="text-sm">Live preview (order)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {visible.length === 0 && (
          <p className="text-sm text-muted-foreground">No sections will be shown.</p>
        )}
        {visible.map((s, i) => (
          <div key={s.id} className="border border-border rounded-md p-3 bg-muted/30">
            <div className="text-xs text-muted-foreground">#{i + 1} · {s.section_key}</div>
            <div className="font-display font-semibold">{s.title || '—'}</div>
            {s.subtitle && <div className="text-xs text-muted-foreground">{s.subtitle}</div>}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default function AdminSections() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['admin_homepage_sections'],
    queryFn: async (): Promise<HomepageSection[]> => {
      const { data, error } = await supabase
        .from('homepage_sections')
        .select('*')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return (data ?? []) as HomepageSection[];
    },
  });

  const [draft, setDraft] = useState<DraftSection[]>([]);
  const [orderDirty, setOrderDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data) {
      setDraft(data.map((s) => ({ ...s })));
      setOrderDirty(false);
    }
  }, [data]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = draft.findIndex((s) => s.id === active.id);
    const newIndex = draft.findIndex((s) => s.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    setDraft(arrayMove(draft, oldIndex, newIndex));
    setOrderDirty(true);
  };

  const updateRow = (next: DraftSection) =>
    setDraft((prev) => prev.map((s) => (s.id === next.id ? next : s)));

  const removeRow = async (id: string) => {
    if (!confirm('Delete this section? This cannot be undone.')) return;
    const { error } = await supabase.from('homepage_sections').delete().eq('id', id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success('Section deleted');
    qc.invalidateQueries({ queryKey: ['admin_homepage_sections'] });
    qc.invalidateQueries({ queryKey: ['homepage_sections'] });
  };

  const saveAll = async () => {
    setSaving(true);
    try {
      const updates = draft.map((s, idx) => ({
        id: s.id,
        section_key: s.section_key,
        title: s.title,
        subtitle: s.subtitle,
        image_url: s.image_url,
        is_enabled: s.is_enabled,
        sort_order: (idx + 1) * 10,
        content: s.content ?? {},
      }));
      const { error } = await supabase.from('homepage_sections').upsert(updates, { onConflict: 'id' });
      if (error) throw error;
      toast.success('Homepage sections saved');
      qc.invalidateQueries({ queryKey: ['admin_homepage_sections'] });
      qc.invalidateQueries({ queryKey: ['homepage_sections'] });
    } catch (e: any) {
      toast.error(e.message ?? 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const dirty = orderDirty || draft.some((s) => s._dirty);

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="font-display text-2xl font-bold">Homepage Sections</h1>
          <p className="text-sm text-muted-foreground">
            Add, edit, reorder, and toggle homepage sections. Empty / disabled sections hide gracefully on the storefront.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <NewSectionButton existingKeys={draft.map((s) => s.section_key)} />
          <Button onClick={saveAll} disabled={!dirty || saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving…' : 'Save changes'}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-3">
          {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={draft.map((s) => s.id)} strategy={verticalListSortingStrategy}>
              {draft.map((s) => (
                <SortableRow key={s.id} section={s} onChange={updateRow} onDelete={removeRow} />
              ))}
            </SortableContext>
          </DndContext>
        </div>
        <PreviewPane sections={draft} />
      </div>
    </div>
  );
}

function NewSectionButton({ existingKeys }: { existingKeys: string[] }) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [key, setKey] = useState('');
  const [title, setTitle] = useState('');

  const submit = async () => {
    const slug = key.trim().toLowerCase().replace(/[^a-z0-9_]+/g, '_');
    if (!slug) return toast.error('Section key required');
    if (existingKeys.includes(slug)) return toast.error('Key already exists');
    const { error } = await supabase.from('homepage_sections').insert({
      section_key: slug,
      title: title || slug,
      sort_order: (existingKeys.length + 1) * 10,
      is_enabled: true,
    });
    if (error) return toast.error(error.message);
    toast.success('Section added');
    setOpen(false);
    setKey(''); setTitle('');
    qc.invalidateQueries({ queryKey: ['admin_homepage_sections'] });
    qc.invalidateQueries({ queryKey: ['homepage_sections'] });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="h-4 w-4 mr-2" /> New section
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add homepage section</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Section key</Label>
            <Input value={key} onChange={(e) => setKey(e.target.value)} placeholder="fabric_guide" />
            <p className="text-xs text-muted-foreground mt-1">
              Lower-case identifier. Used by the homepage to render this slot.
            </p>
          </div>
          <div>
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Know Your Fabrics" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={submit}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
