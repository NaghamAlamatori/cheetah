import React, { useState } from "react";
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
    profile_picture: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { email, password, name, mobileno, city, country, profile_picture } = form;

    const { data: authData, error: signUpError } = await supabase.auth.signUp({ email, password });
    if (signUpError) return setError(signUpError.message);

    const { error: insertError } = await supabase.from("users").insert([
      {
        name,
        email,
        password, // you might want to hash this before storing!
        mobileno,
        city,
        country,
        profile_picture,
        email_verified: false,
        role: "user",
      },
    ]);

    if (insertError) return setError(insertError.message);

    alert("🎉 Welcome to Cheetah!");
    navigate("/profile");
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold text-center text-orange-600">{t("signup")}</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSignup} className="space-y-3 mt-4">
        <input name="name" placeholder="Full Name" onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} className="w-full p-2 border rounded" required />
        <input name="mobileno" placeholder="Mobile No" onChange={handleChange} className="w-full p-2 border rounded" required />
        <input name="city" placeholder="City" onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="country" placeholder="Country" onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="profile_picture" placeholder="Profile Picture URL" onChange={handleChange} className="w-full p-2 border rounded" />
        <button type="submit" className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600">
          {t("signup")}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-700">{t("haveAccount")} <Link to="/login" className="text-orange-500">{t("login")}</Link></p>
      </div>
  );
};

export default Signup;
