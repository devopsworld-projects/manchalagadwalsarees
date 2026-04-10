import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, GripVertical, ChevronRight, ArrowUp, ArrowDown } from 'lucide-react';
import { toast } from 'sonner';

type MenuItem = {
  id: string;
  label: string;
  slug: string | null;
  url: string | null;
  parent_id: string | null;
  sort_order: number;
  is_active: boolean;
  menu_group: string;
};

const defaultForm = {
  label: '',
  slug: '',
  url: '',
  parent_id: '',
  sort_order: 0,
  is_active: true,
  menu_group: 'main',
};

export default function AdminMenu() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['admin-menu-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return data as MenuItem[];
    },
  });

  const topItems = items.filter(i => !i.parent_id);
  const getChildren = (parentId: string) => items.filter(i => i.parent_id === parentId);

  const saveMutation = useMutation({
    mutationFn: async (data: typeof form & { id?: string }) => {
      const payload = {
        label: data.label,
        slug: data.slug || null,
        url: data.url || null,
        parent_id: data.parent_id || null,
        sort_order: data.sort_order,
        is_active: data.is_active,
        menu_group: data.menu_group,
      };
      if (data.id) {
        const { error } = await supabase.from('menu_items').update(payload).eq('id', data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('menu_items').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-menu-items'] });
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
      toast.success(editingId ? 'Menu item updated' : 'Menu item created');
      closeDialog();
    },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('menu_items').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-menu-items'] });
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
      toast.success('Menu item deleted');
      setDeleteId(null);
    },
    onError: (e: any) => toast.error(e.message),
  });

  const reorderMutation = useMutation({
    mutationFn: async ({ id, newOrder }: { id: string; newOrder: number }) => {
      const { error } = await supabase.from('menu_items').update({ sort_order: newOrder }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-menu-items'] });
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
    },
  });

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingId(null);
    setForm(defaultForm);
  };

  const openEdit = (item: MenuItem) => {
    setEditingId(item.id);
    setForm({
      label: item.label,
      slug: item.slug || '',
      url: item.url || '',
      parent_id: item.parent_id || '',
      sort_order: item.sort_order,
      is_active: item.is_active,
      menu_group: item.menu_group,
    });
    setDialogOpen(true);
  };

  const openCreate = (parentId?: string) => {
    const siblings = parentId ? getChildren(parentId) : topItems;
    const maxOrder = siblings.length > 0 ? Math.max(...siblings.map(s => s.sort_order)) : 0;
    setEditingId(null);
    setForm({
      ...defaultForm,
      parent_id: parentId || '',
      sort_order: maxOrder + 1,
    });
    setDialogOpen(true);
  };

  const moveItem = (item: MenuItem, direction: 'up' | 'down') => {
    const siblings = item.parent_id ? getChildren(item.parent_id) : topItems;
    const idx = siblings.findIndex(s => s.id === item.id);
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= siblings.length) return;
    const other = siblings[swapIdx];
    reorderMutation.mutate({ id: item.id, newOrder: other.sort_order });
    reorderMutation.mutate({ id: other.id, newOrder: item.sort_order });
  };

  const handleSave = () => {
    if (!form.label.trim()) { toast.error('Label is required'); return; }
    saveMutation.mutate({ ...form, id: editingId || undefined });
  };

  const renderRow = (item: MenuItem, isChild = false) => (
    <TableRow key={item.id} className={isChild ? 'bg-muted/30' : ''}>
      <TableCell>
        <div className="flex items-center gap-2">
          {isChild && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
          <span className={isChild ? 'text-sm' : 'font-medium'}>{item.label}</span>
        </div>
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">{item.slug || '—'}</TableCell>
      <TableCell className="text-sm text-muted-foreground">{item.url || '—'}</TableCell>
      <TableCell>
        <Badge variant={item.is_active ? 'default' : 'secondary'}>
          {item.is_active ? 'Active' : 'Hidden'}
        </Badge>
      </TableCell>
      <TableCell className="text-sm">{item.sort_order}</TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => moveItem(item, 'up')}>
            <ArrowUp className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => moveItem(item, 'down')}>
            <ArrowDown className="h-3.5 w-3.5" />
          </Button>
          {!isChild && (
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openCreate(item.id)}>
              <Plus className="h-3.5 w-3.5" />
            </Button>
          )}
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(item)}>
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteId(item.id)}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Menu Management</h1>
          <p className="text-muted-foreground">Manage your website navigation menus</p>
        </div>
        <Button onClick={() => openCreate()}>
          <Plus className="h-4 w-4 mr-2" /> Add Menu Item
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Label</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8">Loading...</TableCell></TableRow>
            ) : topItems.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No menu items yet</TableCell></TableRow>
            ) : (
              topItems.map(item => (
                <>
                  {renderRow(item)}
                  {getChildren(item.id).map(child => renderRow(child, true))}
                </>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={v => { if (!v) closeDialog(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Menu Item' : 'Add Menu Item'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Label *</Label>
              <Input value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} placeholder="e.g. Silk Sarees" />
            </div>
            <div>
              <Label>Slug (for collection filter)</Label>
              <Input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="e.g. silk-sarees" />
              <p className="text-xs text-muted-foreground mt-1">Used in /collections?filter=slug</p>
            </div>
            <div>
              <Label>Custom URL (overrides slug)</Label>
              <Input value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} placeholder="e.g. /collections or https://..." />
            </div>
            <div>
              <Label>Parent Item</Label>
              <Select value={form.parent_id} onValueChange={v => setForm(f => ({ ...f, parent_id: v === 'none' ? '' : v }))}>
                <SelectTrigger><SelectValue placeholder="None (top-level)" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None (top-level)</SelectItem>
                  {topItems.map(ti => (
                    <SelectItem key={ti.id} value={ti.id}>{ti.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Sort Order</Label>
                <Input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))} />
              </div>
              <div>
                <Label>Menu Group</Label>
                <Select value={form.menu_group} onValueChange={v => setForm(f => ({ ...f, menu_group: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main">Main Nav</SelectItem>
                    <SelectItem value="footer">Footer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.is_active} onCheckedChange={v => setForm(f => ({ ...f, is_active: v }))} />
              <Label>Active (visible on website)</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Cancel</Button>
            <Button onClick={handleSave} disabled={saveMutation.isPending}>
              {saveMutation.isPending ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteId} onOpenChange={v => { if (!v) setDeleteId(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Menu Item?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">This will also delete all child items. This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteId && deleteMutation.mutate(deleteId)} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
