import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import toast from 'react-hot-toast';

const EditProfile = () => {
  const { user, setUser } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    mobile_no: '',
    city: '',
    country: '',
    profile_picture: ''
  });
  const [preview, setPreview] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.user_metadata?.name || '',
        email: user.email || '',
        mobile_no: user.user_metadata?.mobile_no || '',
        city: user.user_metadata?.city || '',
        country: user.user_metadata?.country || '',
        profile_picture: user.user_metadata?.profile_picture || ''
      });
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const selectedFile = files[0];
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(selectedFile.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    // Create preview
    const previewUrl = URL.createObjectURL(selectedFile);
    
    // Update state
    setFile(selectedFile);
    setPreview(previewUrl);
    
    // Clean up the object URL when component unmounts or when a new file is selected
    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    let successMessage = t('profileUpdated');
    let profilePictureUrl = form.profile_picture;

    try {
      console.log('Starting profile update...');
      
      // Prepare updates
      const updates = {
        name: form.name,
        mobile_no: form.mobile_no,
        city: form.city,
        country: form.country
      };

      console.log('Prepared user data updates:', updates);

      // Handle file upload if a new file is selected
      if (file) {
        console.log('🚀 Starting file upload process...');
        
        try {
          // 1. Verify Supabase client is initialized
          if (!supabase) {
            throw new Error('Supabase client is not initialized');
          }
          
          // 2. Verify file is valid
          if (!(file instanceof File)) {
            throw new Error('Invalid file provided');
          }
          
          // 3. Prepare file details
          const fileExt = file.name.split('.').pop().toLowerCase();
          const filePath = `${user.id}/profile.${fileExt}`;
          
          console.log('📄 File details:', {
            name: file.name,
            type: file.type,
            size: file.size,
            path: filePath
          });

          // 4. Upload the new file
          console.log('⬆️ Uploading file...');
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('profile-pictures')
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: true,
              contentType: file.type || 'image/jpeg'
            });
            
          if (uploadError) {
            console.error('❌ Upload error:', uploadError);
            throw new Error(`Upload failed: ${uploadError.message}`);
          }
          
          console.log('✅ File upload response:', uploadData);
          
          // 5. Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('profile-pictures')
            .getPublicUrl(filePath);
            
          console.log('🔗 Generated public URL:', publicUrl);
          profilePictureUrl = publicUrl;
          updates.profile_picture = publicUrl;
          
        } catch (error) {
          console.error('❌ File upload error:', error);
          toast.error(`Failed to upload profile picture: ${error.message}`);
          throw error;
        }
      }

      // Update the user data in the database
      console.log('Updating user data in database...');
      const { data: userData, error: updateError } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (updateError) {
        console.error('Database update error:', updateError);
        throw updateError;
      }
      
      console.log('Database update successful:', userData);
      
      // Update the auth user data
      console.log('Updating auth user data...');
      const { data: authData, error: authUpdateError } = await supabase.auth.updateUser({
        data: { ...updates, profile_picture: profilePictureUrl }
      });
      
      if (authUpdateError) {
        console.warn('Auth update warning:', authUpdateError.message);
        // Don't throw, as the database update was successful
        successMessage += ' (some settings may require re-login to take effect)';
      } else {
        console.log('Auth update successful:', authData);
      }
      
      // Update local state
      setUser(prev => ({
        ...prev,
        user_metadata: {
          ...prev?.user_metadata,
          ...updates,
          profile_picture: profilePictureUrl
        }
      }));
      
      console.log('User data updated successfully');
      toast.success(successMessage);
      
      // Navigate back to profile page after successful update
      navigate('/profile');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">{t('editProfile')}</h1>
      
      <form onSubmit={handleUpdate} className="space-y-4">
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-32 h-32 mb-4">
            <img
              src={preview || form.profile_picture || '/default-avatar.png'}
              alt="Profile"
              className="w-full h-full rounded-full object-cover border-2 border-gray-200"
            />
          </div>
          <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg transition duration-200">
            {t('changePhoto')}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              {t('name')}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              {t('email')}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 bg-gray-100"
              disabled
            />
          </div>

          <div>
            <label htmlFor="mobile_no" className="block text-sm font-medium text-gray-700">
              {t('mobileNumber')}
            </label>
            <input
              type="tel"
              id="mobile_no"
              name="mobile_no"
              value={form.mobile_no}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                {t('city')}
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={form.city}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              />
            </div>
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                {t('country')}
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={form.country}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <Link
            to="/profile"
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            {t('cancel')}
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
          >
            {loading ? t('updating') : t('updateProfile')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
