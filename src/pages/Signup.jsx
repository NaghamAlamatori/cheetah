import React, { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from '../utils/supabase';
import { useTranslation } from "react-i18next";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    mobile_no: "",
    city: "",
    country: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file type and size
      if (!selectedFile.type.match("image.*")) {
        setError("Please select an image file");
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
        setError("File size should be less than 5MB");
        return;
      }
      setFile(selectedFile);
      setError("");
    }
  };

  const uploadFile = async () => {
    if (!file) return null;

    try {
      // Use a simpler file upload approach
      const { data, error } = await supabase.storage
        .from('profile-pictures')
        .upload(file.name, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type,
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = await supabase.storage
        .from('profile-pictures')
        .getPublicUrl(file.name);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Failed to upload profile picture');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      // 1. Sign up with Supabase Auth first
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            name: form.name,
            mobileno: form.mobileno,
            city: form.city,
            country: form.country
          }
        }
      });

      if (signUpError) throw signUpError;

      if (!authData.user) {
        throw new Error("Signup failed. Please try again.");
      }

      // Wait for the session to be updated
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Verify the user is authenticated
      const { data: session, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session?.user) {
        throw new Error("Authentication failed. Please check your email for verification instructions.");
      }

      // 2. Upload profile picture if selected
      if (file) {
        const { data: fileData, error: fileError } = await supabase
          .storage
          .from('profile-pictures')
          .upload(
            `${authData.user.id}/${file.name}`,
            file,
            {
              cacheControl: '3600',
              upsert: false,
              contentType: file.type,
            }
          );

        if (fileError) throw fileError;

        // Update user metadata with profile picture URL
        const { data: updateData, error: updateError } = await supabase.auth.updateUser({
          data: {
            profile_picture: fileData.path
          }
        });

        if (updateError) throw updateError;
      }

      alert("🎉 Welcome! Please check your email to verify your account.");
      navigate("/profile");
    } catch (err) {
      if (err.message.includes('Authentication failed')) {
        setError("Authentication failed. Please check your email for verification instructions.");
      } else {
        setError(err.message || "An error occurred during signup.");
      }
    } finally {
      setLoading(false);
    }
  };
  

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold text-center text-orange-600">{t("signup")}</h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      
      <form onSubmit={handleSignup} className="space-y-3 mt-4">
        <input 
          name="name" 
          placeholder="Full Name" 
          onChange={handleChange} 
          className="w-full p-2 border rounded" 
          required 
        />
        <input 
          type="email" 
          name="email" 
          placeholder="Email" 
          onChange={handleChange} 
          className="w-full p-2 border rounded" 
          required 
        />
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            {t('Password')}
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm pr-10"
              required
            />
            <button
              type="button"
              className="absolute right-2 top-2.5 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>
        <input 
          name="mobile_no" 
          placeholder="Mobile No" 
          onChange={handleChange} 
          className="w-full p-2 border rounded" 
          required 
        />
        <input 
          name="city" 
          placeholder="City" 
          onChange={handleChange} 
          className="w-full p-2 border rounded" 
        />
        <input 
          name="country" 
          placeholder="Country" 
          onChange={handleChange} 
          className="w-full p-2 border rounded" 
        />
        
        {/* Hidden file input */}
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        
        {/* Custom file upload button */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={triggerFileInput}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            {file ? "Change Photo" : "Upload Profile Photo"}
          </button>
          {file && (
            <span className="text-sm text-gray-600 truncate max-w-xs">
              {file.name}
            </span>
          )}
        </div>
        
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-orange-500 h-2.5 rounded-full" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}

        <button 
          type="submit" 
          className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 disabled:bg-orange-300"
          disabled={loading}
        >
          {loading ? "Creating account..." : t("signup")}
        </button>
      </form>
      
      <p className="mt-4 text-center text-sm text-gray-700">
        {t("haveAccount")} <Link to="/login" className="text-orange-500">{t("login")}</Link>
      </p>
    </div>
  );
};

export default Signup;