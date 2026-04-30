import { useState, Fragment } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, GripVertical, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { MenuPreview } from '@/components/admin/MenuPreview';

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

function SortableRow({
  item,
  isChild,
  onEdit,
  onDelete,
  onAddChild,
}: {
  item: MenuItem;
  isChild?: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onAddChild?: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 px-4 py-3 border-b border-border ${isChild ? 'bg-muted/30 pl-10' : 'bg-background'}`}
    >
      <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing touch-none">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </button>
      {isChild && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
      <span className={`flex-1 ${isChild ? 'text-sm' : 'font-medium'}`}>{item.label}</span>
      <span className="text-xs text-muted-foreground hidden sm:block w-28 truncate">{item.slug || item.url || '—'}</span>
      <Badge variant={item.is_active ? 'default' : 'secondary'} className="text-[10px]">
        {item.is_active ? 'Active' : 'Hidden'}
      </Badge>
      <div className="flex items-center gap-0.5">
        {!isChild && onAddChild && (
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onAddChild} title="Add sub-item">
            <Plus className="h-3.5 w-3.5" />
          </Button>
        )}
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onEdit}>
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={onDelete}>
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

export default function AdminMenu() {
  const queryClient = useQueryClient();
  const [activeGroup, setActiveGroup] = useState('main');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

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

  const groupItems = items.filter(i => i.menu_group === activeGroup);
  const topItems = groupItems.filter(i => !i.parent_id);
  const getChildren = (parentId: string) => groupItems.filter(i => i.parent_id === parentId);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-menu-items'] });
    queryClient.invalidateQueries({ queryKey: ['menu-items'] });
  };

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
      invalidate();
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
      invalidate();
      toast.success('Menu item deleted');
      setDeleteId(null);
    },
    onError: (e: any) => toast.error(e.message),
  });

  const reorderMutation = useMutation({
    mutationFn: async (updates: { id: string; sort_order: number }[]) => {
      for (const u of updates) {
        const { error } = await supabase.from('menu_items').update({ sort_order: u.sort_order }).eq('id', u.id);
        if (error) throw error;
      }
    },
    onSuccess: () => invalidate(),
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
      menu_group: activeGroup,
    });
    setDialogOpen(true);
  };

  const handleDragEnd = (event: DragEndEvent, list: MenuItem[], parentId?: string) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = list.findIndex(i => i.id === active.id);
    const newIndex = list.findIndex(i => i.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const reordered = arrayMove(list, oldIndex, newIndex);
    const updates = reordered.map((item, idx) => ({ id: item.id, sort_order: idx + 1 }));
    reorderMutation.mutate(updates);
  };

  const handleSave = () => {
    if (!form.label.trim()) { toast.error('Label is required'); return; }
    saveMutation.mutate({ ...form, id: editingId || undefined });
  };

  // Build a flat sortable list for top-level items
  const topIds = topItems.map(i => i.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Menu Management</h1>
          <p className="text-muted-foreground">Drag to reorder. Manage main nav and footer menus.</p>
        </div>
        <Button onClick={() => openCreate()}>
          <Plus className="h-4 w-4 mr-2" /> Add Item
        </Button>
      </div>

      <Tabs value={activeGroup} onValueChange={setActiveGroup}>
        <TabsList>
          <TabsTrigger value="main">Main Navigation</TabsTrigger>
          <TabsTrigger value="footer">Footer Links</TabsTrigger>
          <TabsTrigger value="mobile">Mobile Only</TabsTrigger>
          <TabsTrigger value="topbar">Top Bar</TabsTrigger>
        </TabsList>

        {['main', 'footer', 'mobile', 'topbar'].map(group => (
          <TabsContent key={group} value={group}>
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_minmax(0,520px)] gap-6">
              <div>
                {isLoading ? (
                  <div className="text-center py-12 text-muted-foreground">Loading...</div>
                ) : topItems.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground border rounded-lg">
                    No menu items yet. Click "Add Item" to create one.
                  </div>
                ) : (
                  <div className="border rounded-lg overflow-hidden">
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, topItems)}>
                      <SortableContext items={topIds} strategy={verticalListSortingStrategy}>
                        {topItems.map(item => {
                          const children = getChildren(item.id);
                          const childIds = children.map(c => c.id);
                          return (
                            <Fragment key={item.id}>
                              <SortableRow
                                item={item}
                                onEdit={() => openEdit(item)}
                                onDelete={() => setDeleteId(item.id)}
                                onAddChild={() => openCreate(item.id)}
                              />
                              {children.length > 0 && (
                                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, children, item.id)}>
                                  <SortableContext items={childIds} strategy={verticalListSortingStrategy}>
                                    {children.map(child => (
                                      <SortableRow
                                        key={child.id}
                                        item={child}
                                        isChild
                                        onEdit={() => openEdit(child)}
                                        onDelete={() => setDeleteId(child.id)}
                                      />
                                    ))}
                                  </SortableContext>
                                </DndContext>
                              )}
                            </Fragment>
                          );
                        })}
                      </SortableContext>
                    </DndContext>
                  </div>
                )}
              </div>

              {/* Live Preview */}
              <div className="xl:sticky xl:top-4 xl:self-start">
                <MenuPreview items={items} group={group} />
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>

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
              <p className="text-xs text-muted-foreground mt-1">Links to /collections?filter=slug</p>
            </div>
            <div>
              <Label>Custom URL (overrides slug)</Label>
              <Input value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} placeholder="e.g. /about or https://..." />
            </div>
            <div>
              <Label>Parent Item</Label>
              <Select value={form.parent_id || 'none'} onValueChange={v => setForm(f => ({ ...f, parent_id: v === 'none' ? '' : v }))}>
                <SelectTrigger><SelectValue placeholder="None (top-level)" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None (top-level)</SelectItem>
                  {items.filter(i => !i.parent_id && i.menu_group === form.menu_group).map(ti => (
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
                    <SelectItem value="mobile">Mobile Only</SelectItem>
                    <SelectItem value="topbar">Top Bar</SelectItem>
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
