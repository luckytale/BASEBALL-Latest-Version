import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Auth0UserContext = createContext<string | undefined>(undefined);

export const Auth0UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [userId, setUserId] = useState<string | undefined>('1');

  useEffect(() => {
    if (isAuthenticated && user) {
      setUserId(user.sub);
    }
  }, [isAuthenticated, user]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Auth0UserContext.Provider value={userId}>
      {children}
    </Auth0UserContext.Provider>
  );
};

export const Auth0UserId = () => {
  const context = useContext(Auth0UserContext);
  if (context === undefined) {
    throw new Error('useAuth0User must be used within an Auth0UserProvider');
  }
  return context;
};
