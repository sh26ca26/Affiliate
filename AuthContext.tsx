import React, { createContext } from 'react';

interface AuthContextType {
  state: {
    isLoading: boolean;
    isSignout: boolean;
    userToken: string | null;
  };
  dispatch: React.Dispatch<any>;
  signIn?: (credentials: any) => Promise<void>;
  signUp?: (credentials: any) => Promise<void>;
  signOut?: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  state: {
    isLoading: true,
    isSignout: false,
    userToken: null,
  },
  dispatch: () => {},
});

