import { useState, useEffect, useCallback } from 'react';

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('accessToken'));
  const [token, setToken] = useState(() => localStorage.getItem('accessToken'));

  const login = useCallback((accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
    setToken(accessToken);
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setToken(null);
    setIsLoggedIn(false);
  }, []);

  // Lắng nghe event logout từ axios interceptor (khi token hết hạn)
  useEffect(() => {
    const handler = () => logout();
    window.addEventListener('auth:logout', handler);
    return () => window.removeEventListener('auth:logout', handler);
  }, [logout]);

  return { isLoggedIn, token, login, logout };
}
