import axios from "axios";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

// Car-related functions
export const fetchCars = async () => {
  try {
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching cars:", error);
    throw error;
  }
};

export const addCar = async (carData) => {
  try {
    // Get current session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('cars')
      .insert([{
        ...carData,
        user_id: session.user.id
      }])
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error("Error adding car:", error);
    throw error;
  }
};

export const getCarDetails = async (carId) => {
  try {
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .eq('id', carId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching car details:", error);
    throw error;
  }
};

// User-related functions
export const getUserProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

export const updateUserProfile = async (userId, updates) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

// Complaint functions
export const submitComplaint = async (complaintData) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('complaints')
      .insert([{
        ...complaintData,
        user_id: session.user.id
      }])
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error("Error submitting complaint:", error);
    throw error;
  }
};

export const getUserComplaints = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('complaints')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching user complaints:", error);
    throw error;
  }
};

// File upload functions
export const uploadFile = async (bucketName, filePath, file) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export const deleteFile = async (bucketName, filePath) => {
  try {
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};

// Default export
export default {
  supabase,
  fetchCars,
  addCar,
  getCarDetails,
  getUserProfile,
  updateUserProfile,
  submitComplaint,
  getUserComplaints,
  uploadFile,
  deleteFile
};