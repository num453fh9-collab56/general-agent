import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse user from local storage', e);
      }
    }
    setLoading(false);
  }, []);

  const login = (email, _password) => {
    // Basic mock authentication
    const mockUser = {
      id: '1',
      email,
      name: email.split('@')[0],
    };

    // Store user data
    localStorage.setItem('user', JSON.stringify(mockUser));
    setUser(mockUser);
    return true;
  };

  const register = (email, _password, name) => {
    const mockUser = {
      id: Date.now().toString(),
      email,
      name: name || email.split('@')[0],
    };

    localStorage.setItem('user', JSON.stringify(mockUser));
    setUser(mockUser);
    return true;
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
