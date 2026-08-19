import { useState, useEffect } from 'react';
import { User } from './types';
import { db } from './store';

const AUTH_KEY = 'diamante_crm_auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_KEY);
    if (stored) {
      try {
        const userData = JSON.parse(stored);
        // Verify if user still exists in DB
        const users = db.getAll('users');
        const found = users.find(u => u.id === userData.id && u.status === 'Ativo');
        if (found) {
          setUser(found);
        } else {
          localStorage.removeItem(AUTH_KEY);
        }
      } catch (e) {
        localStorage.removeItem(AUTH_KEY);
      }
    }
    setLoading(false);
  }, []);

  const login = (email: string, pass: string): boolean => {
    const users = db.getAll('users');
    const found = users.find(u => u.email === email && u.passwordHash === pass && u.status === 'Ativo');
    
    if (found) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(found));
      setUser(found);
      
      // Update last access
      db.upsert('users', { ...found, lastAccess: new Date().toISOString() });
      
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    setUser(null);
  };

  const checkPermission = (moduleId: string, action: string = 'view') => {
    if (!user) return false;
    if (user.role === 'OWNER') return true;
    
    const perm = user.permissions.find(p => p.moduleId === moduleId);
    if (!perm) return false;
    
    return perm.actions.includes(action);
  };

  return { user, loading, login, logout, checkPermission };
}
