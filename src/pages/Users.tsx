import React, { useMemo, useState } from 'react';
import { CheckIcon, MinusIcon, PencilIcon, SearchIcon, Trash2Icon, UserPlusIcon, UsersIcon } from 'lucide-react';
import { Avatar } from '../components/Avatar';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Toggle } from '../components/Toggle';
import { useToast } from '../components/ToastProvider';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';
import { Panel } from '../components/Panel';
import { UserFormDialog } from '../components/users/UserFormDialog';
import { usePos } from '../contexts/PosContext';
import { permissions } from '../data/permissions';
import type { User, UserInput } from '../types/pos';
import { formatDateTime } from '../utils/date';

export function UsersPage() {
  const { data, currentUser, addUser, updateUser, deleteUser } = usePos();
  const { addToast } = useToast();
  const [query, setQuery] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [deleting, setDeleting] = useState<User | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.users.filter((u) => !q || u.name.toLowerCase().includes(q) || u.username.includes(q));
  }, [data.users, query]);

  const handleSubmit = (input: UserInput) => {
    const result = editing ? updateUser(editing.id, input) : addUser(input);
    if (result.ok) {
      addToast({ type: 'success', message: editing ? `Data ${input.name} diperbarui.` : `Pengguna ${input.name} ditambahkan.` });
      setFormOpen(false);
      setEditing(null);
    }
    return result;
  };

  const handleToggle = (user: User, active: boolean) => {
    const result = updateUser(user.id, { active });
    if (!result.ok) addToast({ type: 'error', message: result.error });else
    addToast({ type: 'success', message: `${user.name} ${active ? 'diaktifkan' : 'dinonaktifkan'}.` });
  };

  const handleDelete = () => {
    if (!deleting) return;
    const result = deleteUser(deleting.id);
    if (!result.ok) addToast({ type: 'error', message: result.error });else
    addToast({ type: 'success', message: `Pengguna ${deleting.name} dihapus.` });
    setDeleting(null);
  };

  return (
    <div>
      <PageHeader
        eyebrow="KF2 · Kelola data pengguna"
        title="Pengguna & Hak Akses"
        description="Kelola akun admin dan kasir, atur role, serta status aktif pengguna."
        actions={
        <Button
          leftIcon={<UserPlusIcon size={16} />}
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}>
          
            Tambah pengguna
          </Button>
        } />
      

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="rounded-lg border border-line bg-surface">
          <div className="border-b border-line p-4">
            <Input placeholder="Cari nama atau username…" value={query} onChange={(e) => setQuery(e.target.value)} startAdornment={<SearchIcon size={16} />} aria-label="Cari pengguna" />
          </div>
          {filtered.length === 0 ?
          <div className="p-6">
              <EmptyState icon={UsersIcon} title="Pengguna tidak ditemukan" description="Coba kata kunci lain." />
            </div> :

          <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead className="bg-gray-50 font-mono text-[11px] uppercase tracking-wider text-muted">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Pengguna</th>
                    <th className="px-4 py-3 text-left font-medium">Role</th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                    <th className="px-4 py-3 text-left font-medium">Login terakhir</th>
                    <th className="px-4 py-3 text-right font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {filtered.map((u) => {
                  const isSelf = u.id === currentUser?.id;
                  return (
                    <tr key={u.id} className="hover:bg-gray-50/60">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar name={u.name} alt={u.name} size="sm" />
                            <div>
                              <p className="font-medium">
                                {u.name} {isSelf && <span className="font-mono text-[11px] text-muted">(Anda)</span>}
                              </p>
                              <p className="font-mono text-[11px] text-muted">@{u.username}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={u.role === 'admin' ? 'primary' : 'secondary'} size="small" style="bordered">
                            {u.role === 'admin' ? 'Admin' : 'Kasir'}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Toggle size="small" checked={u.active} disabled={isSelf} onChange={(v) => handleToggle(u, v)} aria-label={`Status aktif ${u.name}`} />
                            <span className={`text-xs ${u.active ? 'text-ink' : 'text-muted'}`}>{u.active ? 'Aktif' : 'Nonaktif'}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-muted">{u.lastLogin ? formatDateTime(u.lastLogin) : 'Belum pernah'}</td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-1">
                            <Button
                            size="small"
                            variant="tertiary"
                            iconOnly={<PencilIcon size={15} />}
                            aria-label={`Edit ${u.name}`}
                            onClick={() => {
                              setEditing(u);
                              setFormOpen(true);
                            }} />
                          
                            <Button size="small" variant="tertiary" disabled={isSelf} iconOnly={<Trash2Icon size={15} />} aria-label={`Hapus ${u.name}`} onClick={() => setDeleting(u)} />
                          </div>
                        </td>
                      </tr>);

                })}
                </tbody>
              </table>
            </div>
          }
        </div>

        <Panel title="Matriks hak akses" description="Permission per role (role-based access)" bodyClassName="">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 font-mono text-[11px] uppercase tracking-wider text-muted">
              <tr>
                <th className="px-4 py-2.5 text-left font-medium">Fitur</th>
                <th className="px-2 py-2.5 text-center font-medium">Admin</th>
                <th className="px-2 py-2.5 text-center font-medium">Kasir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {permissions.map((p) =>
              <tr key={p.feature}>
                  <td className="px-4 py-2.5 text-xs text-accent">{p.feature}</td>
                  {[p.admin, p.kasir].map((allowed, i) =>
                <td key={i} className="px-2 py-2.5 text-center">
                      {allowed ? <CheckIcon size={15} className="mx-auto text-ink" aria-label="Diizinkan" /> : <MinusIcon size={15} className="mx-auto text-gray-300" aria-label="Tidak diizinkan" />}
                    </td>
                )}
                </tr>
              )}
            </tbody>
          </table>
        </Panel>
      </div>

      <UserFormDialog
        open={formOpen}
        user={editing}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSubmit} />
      
      <ConfirmDialog
        open={deleting !== null}
        title="Hapus pengguna?"
        description={
        <>
            Akun <strong className="text-ink">{deleting?.name}</strong> akan dihapus dan tidak dapat login lagi. Riwayat transaksinya tetap tersimpan.
          </>
        }
        confirmLabel="Hapus"
        destructive
        onConfirm={handleDelete}
        onClose={() => setDeleting(null)} />
      
    </div>);

}