import React, { useEffect, useState } from 'react';

// IMPORTANT: Replace this with an actual _id from your MongoDB once you create a user.
const TEST_USER_ID = '69abc778a3cbe96cddfa4b11';
const API_URL = `http://localhost:5000/api/profile/${TEST_USER_ID}`;

export default function Suraiya_Profile() {
  const [user, setUser] = useState({
    name: 'Loading...',
    email: 'loading...',
    phone: '',
    location: '',
    bio: '',
    totalRecycledItems: 0,
    ecoPoints: 0,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUser(data.data);
          setFormData(data.data);
        } else {
          setStatusMsg(data.message || 'Profile not found');
        }
      })
      .catch((err) => {
        console.error('Make sure your backend is running!', err);
        setStatusMsg('Cannot load profile. Check backend server.');
      });
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setStatusMsg('Saving...');
    try {
      const response = await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          location: formData.location,
          bio: formData.bio,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setUser(data.data);
        setIsEditing(false);
        setStatusMsg('Profile updated successfully!');
        setTimeout(() => setStatusMsg(''), 3000);
      } else {
        setStatusMsg(data.message || 'Failed to update profile.');
      }
    } catch (_err) {
      setStatusMsg('Error saving profile.');
    }
  };

  return (
    <div className="flex flex-col items-center py-6 px-4 font-sans">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-3xl overflow-hidden border border-emerald-100">
        <div className="h-32 bg-gradient-to-r from-[#10b981] to-[#047857]"></div>

        <div className="px-6 md:px-10 pb-10 relative">
          <div className="w-24 h-24 bg-white rounded-full p-1 absolute -top-12 border-4 border-white shadow-md">
            <div className="w-full h-full bg-[#d1fae5] rounded-full flex items-center justify-center text-4xl">🌿</div>
          </div>

          <div className="flex justify-end pt-4 h-12 items-center gap-3">
            {statusMsg && <span className="text-sm text-green-600 font-semibold">{statusMsg}</span>}
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-[#10b981] hover:bg-[#059669] text-white px-6 py-2 rounded-full text-sm font-semibold transition-colors shadow-sm"
              >
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-full text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="bg-[#064e3b] hover:bg-[#022c22] text-white px-6 py-2 rounded-full text-sm font-semibold shadow-sm"
                >
                  Save
                </button>
              </div>
            )}
          </div>

          <div className="mt-2">
            {!isEditing ? (
              <>
                <h1 className="text-3xl font-extrabold text-[#064e3b]">{user.name}</h1>
                <p className="text-[#047857] mt-1 font-medium">{user.email}</p>
                <p className="text-gray-600 mt-3 text-sm max-w-md leading-relaxed">{user.bio}</p>
              </>
            ) : (
              <div className="space-y-3 mt-4">
                <input
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                  placeholder="Your Name"
                />
                <textarea
                  name="bio"
                  value={formData.bio || ''}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                  placeholder="Short Bio"
                  rows="2"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="bg-[#ecfdf5] border border-[#a7f3d0] p-5 rounded-2xl text-center">
              <div className="text-3xl mb-2">♻️</div>
              <div className="text-3xl font-extrabold text-[#064e3b]">{user.totalRecycledItems}</div>
              <div className="text-xs text-[#047857] font-bold uppercase mt-1">Items Recycled</div>
            </div>
            <div className="bg-[#ecfdf5] border border-[#a7f3d0] p-5 rounded-2xl text-center">
              <div className="text-3xl mb-2">🌱</div>
              <div className="text-3xl font-extrabold text-[#064e3b]">{user.ecoPoints}</div>
              <div className="text-xs text-[#047857] font-bold uppercase mt-1">Eco Points</div>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-100 pt-6">
            <h2 className="text-lg font-bold text-[#064e3b] mb-4">Account Details</h2>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between border-b border-gray-50 pb-3 items-center">
                <span className="text-gray-500 font-medium w-1/3">Phone Number</span>
                {!isEditing ? (
                  <span className="font-semibold text-gray-800 text-right">{user.phone || 'Not set'}</span>
                ) : (
                  <input
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleInputChange}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-1 text-sm text-right"
                  />
                )}
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-3 items-center">
                <span className="text-gray-500 font-medium w-1/3">Location</span>
                {!isEditing ? (
                  <span className="font-semibold text-gray-800 text-right">{user.location || 'Not set'}</span>
                ) : (
                  <input
                    name="location"
                    value={formData.location || ''}
                    onChange={handleInputChange}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-1 text-sm text-right"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}