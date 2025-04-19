import { createContext, useContext, useState, useEffect } from "react";
import supabase from "../utils/supabase";
import { toast } from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (!mounted) return;
        
        if (error) throw error;
        setUser(session?.user ?? null);
      } catch (error) {
        if (!mounted) return;
        console.error("Error getting session:", error.message);
        setAuthError(error.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;
        setUser(session?.user ?? null);

        switch (event) {
          case "SIGNED_IN":
            toast.success("Login successful!");
            break;
          case "SIGNED_OUT":
            toast.success("Logged out successfully");
            break;
          case "PASSWORD_RECOVERY":
            toast.success("Password recovery initiated");
            break;
        }
      }
    );

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Login error:", error.message);
      setAuthError(error.message);
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email, password, userMetadata = {}) => {
    setLoading(true);
    setAuthError(null);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userMetadata,
          emailRedirectTo: `${window.location.origin}/profile`
        }
      });
      if (error) throw error;
      toast.success("Account created! Please check your email for confirmation.");
      return data;
    } catch (error) {
      console.error("Signup error:", error.message);
      setAuthError(error.message);
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error("Logout error:", error.message);
      setAuthError(error.message);
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      if (error) throw error;
      toast.success("Password reset link sent to your email");
    } catch (error) {
      console.error("Password reset error:", error.message);
      setAuthError(error.message);
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (updates) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.updateUser(updates);
      if (error) throw error;
      toast.success("Profile updated successfully");
      return data;
    } catch (error) {
      console.error("Update error:", error.message);
      setAuthError(error.message);
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    authError,
    login,
    signUp,
    logout,
    resetPassword,
    updateUser,
    isAuthenticated: !!user,
    userRole: user?.user_metadata?.role || "user"
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
