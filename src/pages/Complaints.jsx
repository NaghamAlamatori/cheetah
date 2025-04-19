import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const Complaints = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    content: "",
    isPublic: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: connect to Supabase or backend
    console.log("Submitted complaint:", formData);
    alert(t("complaints.thankYou"));
    setFormData({ name: "", phone: "", content: "", isPublic: false });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-orange-600">{t("complaints.title")}</h1>
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
        <div>
          <label className="block mb-1 font-medium">{t("complaints.name")}</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">{t("complaints.phone")}</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">{t("complaints.content")}</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows={4}
            className="w-full border border-gray-300 rounded px-3 py-2 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            name="isPublic"
            checked={formData.isPublic}
            onChange={handleChange}
            className="mr-2"
          />
          <label>{t("complaints.public")}</label>
        </div>
        <button
          type="submit"
          className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600"
        >
          {t("complaints.submit")}
        </button>
      </form>
    </div>
  );
};

export default Complaints;
