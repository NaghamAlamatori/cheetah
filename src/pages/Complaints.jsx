import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "../utils/supabase";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from "../context/AuthContext";

const MAX_CONTACT_LENGTH = 500;

const Complaints = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    contact: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [publicComplaints, setPublicComplaints] = useState([]);
  const [loadingComplaints, setLoadingComplaints] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      updateFormData(user);
    }
  }, [user]);

  useEffect(() => {
    fetchPublicComplaints();
  }, []);

  const updateFormData = (user) => {
    if (!user) return;
    
    const updates = {};
    if (user.user_metadata?.full_name) {
      updates.name = user.user_metadata.full_name;
    }
    if (user.phone) {
      updates.phone = user.phone;
    }
    if (Object.keys(updates).length > 0) {
      setFormData(prev => ({
        ...prev,
        ...updates
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'contact' && value.length > MAX_CONTACT_LENGTH) {
      return;
    }
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    if (!formData.name || !formData.phone || !formData.contact) {
      toast.error(t('errors.requiredFields'));
      return;
    }

    if (formData.contact.length > MAX_CONTACT_LENGTH) {
      toast.error(t('errors.messageTooLong'));
      return;
    }

    setIsSubmitting(true);

    try {
      // Create complaint data object
      const complaintData = {
        name: formData.name,
        phone: formData.phone,
        contact: formData.contact,
        status: 'pending',
        is_public: false
      };

      // Only add user_id if user is logged in
      if (user?.id) {
        complaintData.user_id = user.id;
      }

      const { error: insertError } = await supabase
        .from('complaints')
        .insert([complaintData]);

      if (insertError) {
        console.error("Error submitting complaint:", insertError);
        if (insertError.code === '42501') {
          toast.error(t('errors.unauthorized'));
          return;
        }
        throw insertError;
      }
      
      toast.success(t('success.submitted'));
      setFormData({
        name: user?.user_metadata?.full_name || "",
        phone: user?.phone || "",
        contact: ""
      });
      fetchPublicComplaints();
    } catch (error) {
      console.error('Error submitting complaint:', error);
      toast.error(t('errors.submitComplaint'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchPublicComplaints = async () => {
    try {
      setLoadingComplaints(true);
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .eq('status', 'accepted')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPublicComplaints(data || []);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      toast.error(t('errors.fetchComplaints'));
    } finally {
      setLoadingComplaints(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer position="top-right" autoClose={5000} />
      
      <div className="mb-8">
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
              placeholder={t("complaints.name")}
            />
          </div>
          
          <div>
            <label className="block mb-1 font-medium">{t("complaints.phone")}</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 dark:bg-gray-700 dark:text-white"
              placeholder={t("complaints.phone")}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              {t("complaints.content")}
              <span className="text-sm text-gray-500 ml-2">
                ({formData.contact.length}/{MAX_CONTACT_LENGTH} {t("complaints.characters")})
              </span>
            </label>
            <textarea
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              required
              rows="4"
              className="w-full border border-gray-300 rounded px-3 py-2 dark:bg-gray-700 dark:text-white"
              placeholder={t("complaints.contentPlaceholder")}
              maxLength={MAX_CONTACT_LENGTH}
            ></textarea>
            <p className="text-sm text-gray-500 mt-1">{t("complaints.disclaimer")}</p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700 transition-colors duration-200 ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? t("loading") : t("complaints.submit")}
          </button>
        </form>
      </div>

      {/* Public Complaints Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">{t("complaints.publicTitle")}</h2>
        {loadingComplaints ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <div className="grid gap-4">
            {publicComplaints.map((complaint) => (
              <div
                key={complaint.id}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md"
              >
                <p className="font-medium">{complaint.name}</p>
                <p className="text-gray-600 dark:text-gray-400 mt-2">{complaint.contact}</p>
                <div className="mt-2 text-sm text-gray-500">
                  {new Date(complaint.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
            {publicComplaints.length === 0 && (
              <p className="text-center text-gray-500">{t("complaints.noComplaints")}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Complaints;
