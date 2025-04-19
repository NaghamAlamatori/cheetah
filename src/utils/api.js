import axios from "axios";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const API_BASE_URL = "https://your-backend-api.com"; // Change this to your actual backend URL

export const fetchCars = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cars`);
    return response.data;
  } catch (error) {
    console.error("Error fetching cars:", error);
  }
};

export const submitComplaint = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/complaints`, data);
    return response.data;
  } catch (error) {
    console.error("Error submitting complaint:", error);
  }
};

export const getUserProfile = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
  }
};

// ✅ Add a default export
export default {
  supabase,
  fetchCars,
  submitComplaint,
  getUserProfile,
};
