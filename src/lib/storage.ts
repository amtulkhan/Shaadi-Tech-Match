import type { UserData } from '../types';

const STORAGE_KEY = 'techshaadi_users';

export function saveUserData(name: string, phone: string, resumeFile: File): void {
  const users = getUserData();
  const resumeUrl = URL.createObjectURL(resumeFile);
  
  users.push({
    name,
    phone,
    resumeUrl,
    createdAt: new Date().toISOString()
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

export function getUserData(): UserData[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function exportUserData(): void {
  const users = getUserData();
  const headers = 'Name,Phone,Resume URL,Created At\n';
  const csvContent = headers + users.map(user => 
    `"${user.name}","${user.phone}","${user.resumeUrl}","${user.createdAt}"`
  ).join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `techshaadi_users_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}