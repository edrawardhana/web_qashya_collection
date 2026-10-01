import type { User } from '../types/pos';

export const users: User[] = [
{ id: 'u1', name: 'Hana Pratiwi', username: 'admin', password: 'admin123', role: 'admin', active: true, lastLogin: '2026-09-26T19:12:00' },
{ id: 'u2', name: 'Siti Rahmawati', username: 'kasir', password: 'kasir123', role: 'kasir', active: true, lastLogin: '2026-09-27T08:55:00' },
{ id: 'u3', name: 'Putri Anjani', username: 'putri', password: 'putri123', role: 'kasir', active: true, lastLogin: '2026-09-26T09:02:00' },
{ id: 'u4', name: 'Dian Lestari', username: 'dian', password: 'dian123', role: 'kasir', active: false, lastLogin: '2026-08-30T16:40:00' }];