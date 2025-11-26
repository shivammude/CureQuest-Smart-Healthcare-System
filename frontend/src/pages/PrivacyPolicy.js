import Layout from "../components/Layout";

const PrivacyPolicy = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-10">
        
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Privacy Policy</h1>

        <p className="text-gray-700 leading-relaxed mb-6">
          Your privacy is extremely important to us. This Privacy Policy explains how
          CureQuest collects, uses, protects, and handles your personal and medical
          information within our platform.
        </p>

        <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
        <p className="text-gray-700 mb-4">
          We collect information such as your name, email, phone number, medical history,
          appointment details, and communication records to enhance your healthcare experience.
        </p>

        <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
        <ul className="list-disc pl-6 text-gray-700 mb-6">
          <li>To manage appointments</li>
          <li>To store and maintain medical records</li>
          <li>To communicate updates and alerts</li>
          <li>To improve service quality</li>
        </ul>

        <h2 className="text-2xl font-bold mb-4">3. Data Security</h2>
        <p className="text-gray-700 mb-6">
          We use encryption, secure storage, and strict access controls to ensure your data
          remains private and protected at all times.
        </p>

        <h2 className="text-2xl font-bold mb-4">4. Contact Us</h2>
        <p className="text-gray-700">
          If you have any questions about this Privacy Policy, contact us at:
          <span className="font-semibold"> support@curequest.com</span>.
        </p>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;
