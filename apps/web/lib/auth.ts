'use client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function saveToken(token: string, role: string) {
  localStorage.setItem('miyu_token', token);
  localStorage.setItem('miyu_role', role);
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('miyu_token');
}

export function getRole(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('miyu_role');
}

export function logout() {
  localStorage.removeItem('miyu_token');
  localStorage.removeItem('miyu_role');
}

function handleUnauthorized() {
  logout();
  if (typeof window !== 'undefined') {
    window.location.href = '/admin/login';
  }
}

export async function authGet(path: string) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (res.status === 401) {
    handleUnauthorized();
    throw new Error('unauthorized');
  }
  if (!res.ok) throw new Error(`GET ${path} failed`);
  return res.json();
}

export async function authPost(path: string, body: unknown) {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify(body),
  });
  if (res.status === 401) {
    handleUnauthorized();
    throw new Error('unauthorized');
  }
  if (!res.ok) throw new Error(`POST ${path} failed`);
  return res.json();
}

export async function authPatch(path: string, body: unknown) {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify(body),
  });
  if (res.status === 401) {
    handleUnauthorized();
    throw new Error('unauthorized');
  }
  if (!res.ok) throw new Error(`PATCH ${path} failed`);
  return res.json();
}