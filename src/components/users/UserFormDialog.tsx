import React, { useEffect, useState } from 'react';
import { Button } from '../Button';
import { Dialog, DialogContent, DialogFooter, DialogHeader } from '../Dialog';
import { Input } from '../Input';
import { Select } from '../Select';
import { Toggle } from '../Toggle';
import type { ActionResult, Role, User, UserInput } from '../../types/pos';

interface UserFormDialogProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onSubmit: (input: UserInput) => ActionResult<User>;
}

interface FormState {
  name: string;
  username: string;
  password: string;
  role: Role;
  active: boolean;
}

type FormErrors = Partial<Record<'name' | 'username' | 'password' | 'form', string>>;

const emptyForm: FormState = { name: '', username: '', password: '', role: 'kasir', active: true };

export function UserFormDialog({ open, user, onClose, onSubmit }: UserFormDialogProps) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (!open) return;
    setErrors({});
    setForm(user ? { name: user.name, username: user.username, password: '', role: user.role, active: user.active } : emptyForm);
  }, [open, user]);

  const set = <K extends keyof FormState,>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined, form: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: FormErrors = {};
    if (!form.name.trim()) errs.name = 'Nama lengkap wajib diisi.';
    if (!form.username.trim()) errs.username = 'Username wajib diisi.';else
    if (!/^[a-zA-Z0-9_.]{3,20}$/.test(form.username.trim())) errs.username = '3–20 karakter: huruf, angka, titik, atau garis bawah.';
    if (!user && form.password.length < 6) errs.password = 'Password minimal 6 karakter.';
    if (user && form.password && form.password.length < 6) errs.password = 'Password minimal 6 karakter.';
    if (Object.keys(errs).length) return setErrors(errs);
    const result = onSubmit({ name: form.name.trim(), username: form.username.trim(), password: form.password, role: form.role, active: form.active });
    if (!result.ok) setErrors({ form: result.error });
  };

  return (
    <Dialog isOpen={open} onClose={onClose} size="md">
      <form onSubmit={handleSubmit} noValidate>
        <DialogHeader>{user ? 'Edit Pengguna' : 'Tambah Pengguna'}</DialogHeader>
        <DialogContent>
          <div className="space-y-4">
            {errors.form &&
            <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {errors.form}
              </p>
            }
            <Input id="u-name" label="Nama lengkap" value={form.name} onChange={(e) => set('name', e.target.value)} error={errors.name} placeholder="mis. Siti Rahmawati" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input id="u-username" label="Username" value={form.username} onChange={(e) => set('username', e.target.value.toLowerCase())} error={errors.username} placeholder="mis. siti" />
              <Select
                key={`role-${open}-${user?.id ?? 'new'}`}
                label="Role / hak akses"
                options={[
                { value: 'kasir', label: 'Kasir' },
                { value: 'admin', label: 'Admin' }]
                }
                value={form.role}
                onChange={(v) => set('role', v as Role)} />
              
            </div>
            <Input
              id="u-password"
              type="password"
              label={user ? 'Password baru' : 'Password'}
              value={form.password}
              onChange={(e) => set('password', e.target.value)}
              error={errors.password}
              helperText={user ? 'Kosongkan jika tidak ingin mengubah password.' : 'Minimal 6 karakter. Password disimpan terenkripsi.'} />
            
            <div className="flex items-center justify-between rounded-md border border-dashed border-gray-300 px-4 py-3">
              <div>
                <p className="text-sm font-medium">Status akun</p>
                <p className="text-xs text-muted">{form.active ? 'Aktif — pengguna dapat login.' : 'Nonaktif — pengguna tidak dapat login.'}</p>
              </div>
              <Toggle checked={form.active} onChange={(v) => set('active', v)} aria-label="Status akun aktif" />
            </div>
          </div>
        </DialogContent>
        <DialogFooter>
          <div className="flex w-full justify-end gap-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit">{user ? 'Simpan perubahan' : 'Tambah pengguna'}</Button>
          </div>
        </DialogFooter>
      </form>
    </Dialog>);

}