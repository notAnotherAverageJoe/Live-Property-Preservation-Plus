import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const { user, token } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/api/users/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProfileData(response.data);
        setFormData({
          first_name: response.data.first_name,
          last_name: response.data.last_name,
          email: response.data.email,
        });
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfile();
  }, [id, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const handleUpdateProfile = async () => {
    try {
      await axios.put(`http://localhost:3000/api/api/users/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditMode(false);
      setProfileData({ ...profileData, ...formData });
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handlePasswordUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:3000/api/api/users/${id}/password`,
        passwordData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Password updated successfully");
      setPasswordData({ oldPassword: "", newPassword: "" });
    } catch (error) {
      console.error(
        "Error updating password:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleDeleteProfile = async () => {
    try {
      await axios.delete(`http://localhost:3000/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/"); // Redirect after deletion
    } catch (error) {
      console.error("Error deleting profile:", error);
    }
  };

  if (!profileData) return <div>Loading...</div>;

  return (
    <div>
      <h3>Profile</h3>
      {editMode ? (
        <div>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleInputChange}
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
          <button onClick={handleUpdateProfile}>Save</button>
          <button onClick={() => setEditMode(false)}>Cancel</button>
        </div>
      ) : (
        <div>
          <p>First Name: {profileData.first_name}</p>
          <p>Last Name: {profileData.last_name}</p>
          <p>Email: {profileData.email}</p>
          <button onClick={() => setEditMode(true)}>Edit</button>
          <button onClick={handleDeleteProfile}>Delete Account</button>
        </div>
      )}

      <div>
        <h2>Change Password</h2>
        <input
          type="password"
          name="oldPassword"
          placeholder="Old Password"
          value={passwordData.oldPassword}
          onChange={handlePasswordChange}
        />
        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={passwordData.newPassword}
          onChange={handlePasswordChange}
        />
        <button onClick={handlePasswordUpdate}>Change Password</button>
      </div>
    </div>
  );
};

export default ProfilePage;
