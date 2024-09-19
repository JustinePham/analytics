
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { UserDetails } from './widgets/userSearch';


interface UserDetailsContext {
  user: UserDetails | null;
  setUserDetails: (user: UserDetails) => void;
 }
// Create a default context value
const UserDetailsContext = createContext<UserDetailsContext | undefined>(undefined);
 
// useDetailsProvider component that provides the context value
export const UserDetailsProvider = ({ children }: { children: ReactNode }) => {
  const [ user , setUser ] = useState<UserDetails | null>(null)
  
  // Function to log in (set authenticated to true)
  const setUserDetails = ( result: UserDetails ) => {
    setUser(result)
  };

  return (
    <UserDetailsContext.Provider value={{user, setUserDetails}}>
      {children}
    </UserDetailsContext.Provider>
  );
};
// Custom hook to use the AuthContext
export const useDetails = () => {
  const context = useContext(UserDetailsContext);
  if (!context) {
    throw new Error('useDetails must be used within an details provider');
  }
  return context;
};
export default UserDetailsProvider;