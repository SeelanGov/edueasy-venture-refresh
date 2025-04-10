
import { createContext, useContext, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { useSession } from '@/hooks/useSession';
import { useAuthOperations } from '@/hooks/useAuthOperations';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, idNumber: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<any>; // Updated return type to match what the function returns
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user, session, loading } = useSession();
  const { signUp, signIn, signOut } = useAuthOperations();

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut
  };

  console.log("AuthContext state:", { loading, isAuthenticated: !!user, userId: user?.id });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
