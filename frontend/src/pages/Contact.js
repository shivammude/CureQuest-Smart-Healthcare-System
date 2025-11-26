import React from "react";
import Layout from "../components/Layout";
import { Mail, Phone, MapPin } from "lucide-react";

const Contact = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Contact Us</h1>

        <p className="text-gray-700 mb-8">
          Have any questions, feedback, or need help? Reach out to us and we'll be happy to assist!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <Mail className="h-6 w-6 text-indigo-600" />
              <span className="text-gray-700">support@curequest.com</span>
            </div>

            <div className="flex items-center space-x-3">
              <Phone className="h-6 w-6 text-indigo-600" />
              <span className="text-gray-700">+91 98765 43210</span>
            </div>

            <div className="flex items-center space-x-3">
              <MapPin className="h-6 w-6 text-indigo-600" />
              <span className="text-gray-700">Mumbai, Maharashtra, India</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
