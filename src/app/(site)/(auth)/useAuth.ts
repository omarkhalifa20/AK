import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js';

export interface AuthReturn {
  user: User | null;
  userName: string;
  loading: boolean;
  role: string | null; 
}

export const useAuth = (): AuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [role, setRole] = useState<string | null>(null); 

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUser(session.user);
        // بنجيب الاسم من الداتا اللي متسجلة في الـ Auth نفسه
        setUserName(session.user.user_metadata?.userName || session.user.user_metadata?.full_name || session.user.user_metadata?.name || '');
        // بنجيب الـ role من الـ Auth
        setRole(session.user.user_metadata?.role || 'user');
      } else {
        setUser(null);
        setUserName('');
        setRole(null);
      }
      setLoading(false);
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          setUserName(session.user.user_metadata?.userName || session.user.user_metadata?.full_name || session.user.user_metadata?.name || '');
          setRole(session.user.user_metadata?.role || 'user');
        } else {
          setUser(null);
          setUserName('');
          setRole(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return { user, userName, loading, role }; 
};