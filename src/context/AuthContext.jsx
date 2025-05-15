import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "../utils/supabase";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState("user");
  const [isAdmin, setIsAdmin] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const navigate = useNavigate();

  const fetchUserProfile = useCallback(async (userId) => {
    try {
      setLoading(true);
      console.log('Fetching user profile for ID:', userId);
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      console.log('User profile data:', data);
      console.log('Error fetching profile:', error);
      
      if (error) throw error;
      if (data) {
        setUserProfile(data);
        const role = data.role || 'user';
        console.log('Setting user role to:', role);
        console.log('Is admin?', role === 'admin');
        setUserRole(role);
        setIsAdmin(role === 'admin');
        console.log('After setUserRole and setIsAdmin');
      }
      return data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setAuthError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log('AuthContext: Starting auth initialization');
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        console.log('AuthContext: Session data:', { session, sessionError });
        if (sessionError) {
          console.error('AuthContext: Session error:', sessionError);
          throw sessionError;
        }

        if (session?.user) {
          const { data: { user }, error: userError } = await supabase.auth.getUser();
          console.log('AuthContext: User data:', { user, userError });
          if (userError) throw userError;

          if (isMounted && user) {
            setUser(user);
            const role = user?.app_metadata?.role || user?.user_metadata?.role || "user";
            setUserRole(role);
            await fetchUserProfile(user.id);
          }
        } else {
          if (isMounted) {
            setUser(null);
            setUserRole("user");
          }
        }
      } catch (error) {
        if (isMounted) {
          console.error("Auth initialization error:", error);
          setAuthError("Failed to initialize authentication");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;

        if (session?.user) {
          const { data: { user } } = await supabase.auth.getUser();
          setUser(user);
          const role = user?.app_metadata?.role || user?.user_metadata?.role || "user";
          setUserRole(role);
          await fetchUserProfile(user.id);
        } else {
          setUser(null);
          setUserRole("user");
          setUserProfile(null);
        }

        switch (event) {
          case "SIGNED_IN":
            toast.success("Welcome back!");
            break;
          case "SIGNED_OUT":
            toast.success("Logged out successfully");
            break;
          case "USER_UPDATED":
            toast.success("Profile updated");
            break;
        }
      }
    );

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setAuthError(null);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      // Fetch and set user profile after successful login
      if (data?.user) {
        await fetchUserProfile(data.user.id);
      }
      
      return data;
    } catch (error) {
      const message = error.message.includes("Invalid login credentials")
        ? "Invalid email or password"
        : error.message || "Login failed";
      setAuthError(message);
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email, password, userMetadata = {}) => {
    try {
      setLoading(true);
      setAuthError(null);
  
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { ...userMetadata, role: "user" },
          emailRedirectTo: `${window.location.origin}/profile`,
        },
      });
  
      if (error) throw error;
  
      const newUser = data?.user;
      let avatar_url = null;
  
      if (newUser && profileImageFile) {
        const fileExt = profileImageFile.name.split(".").pop();
        const filePath = `${newUser.id}.${fileExt}`;
  
        const { error: uploadError } = await supabase.storage
          .from("profile-pictures")
          .upload(filePath, profileImageFile, {
            cacheControl: "3600",
            upsert: true,
          });
  
        if (uploadError) throw uploadError;
  
        const { data: publicUrlData } = supabase.storage
          .from("profile-pictures")
          .getPublicUrl(filePath);
  
        avatar_url = publicUrlData.publicUrl;
      }
  
      await supabase.from("users").insert([
        {
          id: newUser.id,
          name: userMetadata.full_name || "",
          profile_picture: avatar_url,
          mobile_no: userMetadata.mobile_no || "",
          city: userMetadata.city || "",
          country: userMetadata.country || "",
          role: "user",
          email_verified: false,
        },
      ]);
  
      toast.success("Confirmation email sent! Please verify your email.");
      return data;
    } catch (error) {
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
    try {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw signOutError;

      setUser(null);
      setUserRole("user");
      setUserProfile(null);
      setAuthError(null);
      setIsAdmin(false);

      localStorage.removeItem('supabase.auth.token');
      sessionStorage.removeItem('supabase.auth.token');

      // Clear any session data
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');

      // Remove any Supabase session data
      localStorage.removeItem('sb-sid');
      localStorage.removeItem('sb-access-token');
      localStorage.removeItem('sb-refresh-token');

      // Clear any Supabase auth state
      localStorage.removeItem('supabase.auth.user');
      localStorage.removeItem('supabase.auth.session');

      // Clear any other auth-related storage
      localStorage.removeItem('auth');
      sessionStorage.removeItem('auth');

      // Redirect to home
      navigate("/");

      // Show success message
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error(error.message || "Failed to log out");
    }
  };

  const resetPassword = async (email) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      toast.success("Password reset link sent to your email");
    } catch (error) {
      setAuthError(error.message);
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (updates) => {
    try {
      setLoading(true);
      setAuthError(null);
      const { data, error } = await supabase.auth.updateUser(updates);

      if (error) throw error;

      setUser(data.user);
      
      // If role is being updated, update isAdmin state
      if (updates.data?.role) {
        setUserRole(updates.data.role);
        setIsAdmin(updates.data.role === 'admin');
      }
      
      toast.success('Profile updated successfully');
      return data;
    } catch (error) {
      console.error('Update user error:', error);
      setAuthError(error.message);
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates) => {
    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", user?.id);
    if (error) throw error;
    toast.success("Profile updated");
    setUserProfile(data[0]);
    return data[0];
  };

  const adminActions = {
    fetchAllUsers: async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*");
      if (error) throw error;
      return data;
    },
    
    deleteUser: async (id) => {
      const { error } = await supabase
        .from("users")
        .delete()
        .eq("id", id);
      if (error) throw error;
      toast.success("User deleted successfully");
    },
    
    deleteAd: async (id) => {
      const { error } = await supabase
        .from("ads")
        .delete()
        .eq("id", id);
      if (error) throw error;
      toast.success("Ad deleted successfully");
    },
    
    deleteReview: async (id) => {
      const { error } = await supabase
        .from("reviews")
        .delete()
        .eq("id", id);
      if (error) throw error;
      toast.success("Review deleted successfully");
    },
    
    deleteComplaint: async (id) => {
      const { error } = await supabase
        .from("complaints")
        .delete()
        .eq("id", id);
      if (error) throw error;
      toast.success("Complaint deleted successfully");
    }
  };

  const value = {
    user,
    userRole,
    isAdmin,
    userProfile,
    loading,
    error: authError,
    login,
    signup,
    logout,
    resetPassword,
    updateUser,
    updateProfile,
    adminActions,
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
