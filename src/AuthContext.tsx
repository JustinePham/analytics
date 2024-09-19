
import axios from 'axios';
import React, { createContext, useState, useContext, ReactNode } from 'react';


export type User = {
  accessToken: string;
  displayName: string;
  id: string;
  emails: string[];
  photos: string [];
  profileUrl: string;
  provider: string;
  username: string;
  _json: any;
}
interface AuthContextType {
  authenticated: boolean;
  login: (res: any) => void;
  logout: () => void;
  user: User | null;
}

// Create a default context value
const AuthContext = createContext<AuthContextType | undefined>(undefined);
 
// AuthProvider component that provides the context value
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [ user , setUser ] = useState<User | null>(null)
  
  // Function to log in (set authenticated to true)
  const login = ( res: any ) => {
    setAuthenticated(true);
    setUser(res);
  };

  // Function to log out (set authenticated to false)
  const logout = () => {
    axios.get('http://localhost:4000/auth/logout', { withCredentials: true })
    .then(() => {
      setAuthenticated(false);
      setUser(null);
    }).catch((error) => {
      console.error('Logout failed:', error);
    });
  };

  return (
    <AuthContext.Provider value={{ authenticated, login, logout, user}}>
      {children}
    </AuthContext.Provider>
  );
};
// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
export default AuthContext;