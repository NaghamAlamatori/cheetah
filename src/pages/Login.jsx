import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await login(email, password);
    if (error) return setError(error.message);

    alert("👋 Welcome back to Cheetah!");
    navigate("/profile");
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold text-center text-orange-600">{t("login")}</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleLogin} className="space-y-4">
        <input type="email" placeholder={t("email")} className="w-full border p-2 rounded"
          value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder={t("password")} className="w-full border p-2 rounded"
          value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600">
          {t("login")}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-700">{t("haveAccount")} <Link to="/signup" className="text-orange-500">{t("signup")}</Link></p>
    </div>
  );
};

export default Login;
