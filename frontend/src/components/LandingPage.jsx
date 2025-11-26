import React from "react";
import { useNavigate } from "react-router-dom";
import { HeartPulse } from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-center relative overflow-hidden">
      {/* Floating gradient blobs for background depth */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-indigo-200 opacity-30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-purple-200 opacity-30 rounded-full blur-3xl animate-pulse delay-200"></div>

      {/* Logo and Name */}
      <div className="flex items-center mb-6 z-10">
        <div className="bg-indigo-600 p-3 rounded-full shadow-md animate-pulse">
          <HeartPulse className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-5xl font-extrabold text-gray-900 ml-3 tracking-tight">
          CureQuest
        </h1>
      </div>

      {/* Tagline */}
      <p className="text-lg text-gray-700 mb-10 z-10">
        <span className="font-medium text-indigo-700">
          Your complete journey from diagnosis to recovery.
        </span>
      </p>

      {/* Get Started Button */}
      <button
        onClick={handleGetStarted}
        className="bg-indigo-600 text-white text-lg font-semibold px-10 py-4 rounded-full shadow-lg hover:bg-indigo-700 transform hover:scale-110 transition-all duration-300 animate-pulse-slow"
      >
        Get Started
      </button>

      {/* Footer */}
      <p className="mt-16 text-gray-500 text-sm z-10">
        © {new Date().getFullYear()} CureQuest. All rights reserved.
      </p>

      {/* Custom Pulse Animation */}
      <style>
        {`
          @keyframes pulse-slow {
            0%, 100% {
              transform: scale(1);
              box-shadow: 0 0 0 0 rgba(79, 70, 229, 0.5);
            }
            50% {
              transform: scale(1.05);
              box-shadow: 0 0 20px 8px rgba(79, 70, 229, 0.25);
            }
          }

          .animate-pulse-slow {
            animation: pulse-slow 2.5s infinite;
          }
        `}
      </style>
    </div>
  );
};

export default LandingPage;
