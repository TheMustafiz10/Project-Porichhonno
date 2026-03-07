import React from 'react';

export default function Profile() {
  return (
    <div className="min-h-screen bg-[#ecfdf5] flex flex-col items-center py-10 px-4 font-sans">
      
      <div className="w-full max-w-2xl bg-white shadow-2xl rounded-3xl overflow-hidden border border-emerald-100 mt-10">
        {/* Header/Cover Photo Area */}
        <div className="h-32 bg-gradient-to-r from-[#10b981] to-[#047857]"></div>

        {/* Profile Avatar & Info */}
        <div className="px-6 md:px-10 pb-10 relative">
          
          {/* Avatar Profile Pic */}
          <div className="w-24 h-24 bg-white rounded-full p-1 absolute -top-12 border-4 border-white shadow-md">
            <div className="w-full h-full bg-[#d1fae5] rounded-full flex items-center justify-center text-4xl font-bold text-[#064e3b]">
              🌿
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-end pt-4">
            <button className="bg-[#10b981] hover:bg-[#059669] text-white px-6 py-2 rounded-full text-sm font-semibold transition-colors shadow-sm">
              Edit Profile
            </button>
          </div>

          {/* User Details */}
          <div className="mt-2">
            <h1 className="text-3xl font-extrabold text-[#064e3b]">Test User</h1>
            <p className="text-[#047857] mt-1 font-medium">student@university.edu</p>
            <p className="text-gray-600 mt-3 text-sm max-w-md leading-relaxed">
              Eco-warrior in training! Trying to make the world a little greener every day by recycling and reducing plastic waste.
            </p>
          </div>

          {/* Porichonno App Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="bg-[#ecfdf5] border border-[#a7f3d0] p-5 rounded-2xl text-center shadow-sm">
              <div className="text-3xl mb-2">♻️</div>
              <div className="text-3xl font-extrabold text-[#064e3b]">142</div>
              <div className="text-xs text-[#047857] font-bold uppercase tracking-wider mt-1">Items Recycled</div>
            </div>
            <div className="bg-[#ecfdf5] border border-[#a7f3d0] p-5 rounded-2xl text-center shadow-sm">
              <div className="text-3xl mb-2">🌱</div>
              <div className="text-3xl font-extrabold text-[#064e3b]">850</div>
              <div className="text-xs text-[#047857] font-bold uppercase tracking-wider mt-1">Eco Points</div>
            </div>
          </div>

          {/* Contact Info Details */}
          <div className="mt-8 border-t border-gray-100 pt-6">
            <h2 className="text-lg font-bold text-[#064e3b] mb-4">Account Details</h2>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between border-b border-gray-50 pb-3">
                <span className="text-gray-500 font-medium">Phone Number</span>
                <span className="font-semibold text-gray-800">+880 1234 567890</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-3">
                <span className="text-gray-500 font-medium">Location</span>
                <span className="font-semibold text-gray-800">Dhaka, Bangladesh</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}