// src/pages/admin/Profile.js
import React, { useEffect, useState } from "react";
import { User, Mail, Key, Save } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../utils/api";
import { useAuthStore } from "../../store/authStore";
import Layout from "../../components/Layout";

const AdminProfile = () => {
  const { user, setAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Load profile into form
  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name,
        email: user.email,
      });
    }
  }, [user]);

  // Update profile
  const updateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.put("/auth/update-profile", profile);
      const existingToken = useAuthStore.getState().token;
      setAuth(data.user, existingToken);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  // Change password
  const changePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }

    try {
      await api.put("/auth/change-password", passwordData);
      toast.success("Password updated successfully!");

      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Password update failed");
    }
  };

  return (
    <Layout>
      <div className="p-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Admin Profile</h2>

        {/* Profile Section */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h3 className="text-lg font-semibold mb-4">Profile Information</h3>

          <form onSubmit={updateProfile} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Name</label>
              <div className="flex items-center border rounded px-3">
                <User className="h-5 w-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                  className="w-full py-2 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1">Email</label>
              <div className="flex items-center border rounded px-3">
                <Mail className="h-5 w-5 text-gray-400 mr-2" />
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({ ...profile, email: e.target.value })
                  }
                  className="w-full py-2 focus:outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 flex items-center"
            >
              <Save className="h-5 w-5 mr-2" />
              Save Changes
            </button>
          </form>
        </div>

        {/* Change Password Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Change Password</h3>

          <form onSubmit={changePassword} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Old Password</label>
              <input
                type="password"
                className="w-full border rounded px-3 py-2"
                value={passwordData.oldPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    oldPassword: e.target.value,
                  })
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1">New Password</label>
              <input
                type="password"
                className="w-full border rounded px-3 py-2"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Confirm New Password</label>
              <input
                type="password"
                className="w-full border rounded px-3 py-2"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  })
                }
                required
              />
            </div>

            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 flex items-center"
            >
              <Key className="h-5 w-5 mr-2" />
              Update Password
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AdminProfile;