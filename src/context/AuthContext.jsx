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
        
        // Additional verification
        if (session?.user) {
          const { data: { user } } = await supabase.auth.getUser();
          setUser(user ?? null);
        } else {
          setUser(null);
        }
      } catch (error) {
        if (!mounted) return;
        console.error("Session error:", error);
        setAuthError("Session verification failed");
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
          case "USER_UPDATED":
            toast.success("User information updated");
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

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          throw new Error("Invalid email or password. Please try again.");
        } else if (error.message.includes("Email not confirmed")) {
          throw new Error("Please verify your email before logging in.");
        }
        throw error;
      }

      // Verify the session was actually created
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Session creation failed");
      
      return data;
    } catch (error) {
      console.error("Login error:", error);
      const friendlyError = error.message || "Login failed. Please try again.";
      setAuthError(friendlyError);
      toast.error(friendlyError);
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
          data: {
            ...userMetadata,
            role: 'user'
          },
          emailRedirectTo: `${window.location.origin}/profile`
        }
      });

      if (error) throw error;

      // Check if email confirmation is required
      if (data.user?.identities?.length === 0) {
        throw new Error("User already registered");
      }

      if (data.user?.confirmation_sent) {
        toast.success("Confirmation email sent! Please verify your email.");
      } else {
        toast.success("Account created successfully!");
      }
      
      return data;
    } catch (error) {
      console.error("Signup error:", error);
      const friendlyError = error.message.includes("already registered") 
        ? "This email is already registered" 
        : "Signup failed. Please try again.";
      setAuthError(friendlyError);
      toast.error(friendlyError);
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
      setUser(null);
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
      setUser({ ...user, ...updates });
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
      {!loading && children}
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