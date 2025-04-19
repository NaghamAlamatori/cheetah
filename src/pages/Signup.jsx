import React, { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import supabase from "../utils/supabase";
import { useTranslation } from "react-i18next";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    mobileno: "",
    city: "",
    country: "",
  });
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

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `profile_pictures/${fileName}`;

    const { data, error } = await supabase.storage
      .from('profile-pictures') // Your bucket name
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
      });

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('profile-pictures')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Upload file if exists
      let profilePictureUrl = null;
      if (file) {
        profilePictureUrl = await uploadFile();
      }

      // 2. Sign up with auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            name: form.name,
            profile_picture: profilePictureUrl
          }
        }
      });

      if (signUpError) throw signUpError;

      // 3. Insert user data
      const { error: insertError } = await supabase.from("users").insert([
        {
          id: authData.user.id,
          name: form.name,
          email: form.email,
          mobileno: form.mobileno,
          city: form.city,
          country: form.country,
          profile_picture: profilePictureUrl,
          email_verified: false,
          role: "user",
        },
      ]);

      if (insertError) throw insertError;

      alert("🎉 Welcome! Please check your email to verify your account.");
      navigate("/profile");
    } catch (err) {
      setError(err.message);
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
        <input 
          type="password" 
          name="password" 
          placeholder="Password" 
          onChange={handleChange} 
          className="w-full p-2 border rounded" 
          required 
          minLength="6"
        />
        <input 
          name="mobileno" 
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