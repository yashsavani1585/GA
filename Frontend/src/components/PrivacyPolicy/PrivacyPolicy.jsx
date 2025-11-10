import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-5xl mx-auto my-10 p-6 bg-white rounded-lg ">
      {/* Title */}
      <h1 className="text-2xl font-bold text-yellow-700 mb-4">PRIVACY POLICY</h1>
      <p className="text-gray-700 mb-6">
        At Crystova, your privacy is important to us. We are committed to protecting
        your personal information and handling it transparently and responsibly in
        accordance with applicable privacy laws.
      </p>

      {/* Information We Collect */}
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Information We Collect</h2>
      <p className="text-gray-700 mb-2">
        When you use the Crystova app, we may collect:
      </p>
      <ul className="list-disc list-inside text-gray-700 mb-6">
        <li>
          Information you provide, such as your name, email, phone number, and address
          during sign-up or use of services.
        </li>
        <li>
          Automatically collected data like your IP address, device type, browser, and
          how you interact with the app.
        </li>
        <li>
          Location data, if you enable location services, to show you nearby offers or
          features.
        </li>
      </ul>

      {/* How We Use Your Data */}
      <h2 className="text-xl font-semibold text-gray-800 mb-2">How We Use Your Data</h2>
      <p className="text-gray-700 mb-2">We use your information to:</p>
      <ul className="list-disc list-inside text-gray-700 mb-6">
        <li>Provide and personalize your experience within the app</li>
        <li>Send you updates, recommendations, or promotional offers</li>
        <li>Improve our services based on usage patterns and feedback</li>
        <li>Display publicly shared reviews or comments, where applicable</li>
      </ul>

      {/* Sharing Your Information */}
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Sharing Your Information</h2>
      <p className="text-gray-700 mb-6">
        We don’t sell your personal information. We may share limited data with trusted
        third-party service providers who help us run the app—strictly under confidentiality
        obligations. Information may also be shared if required by law or to protect the
        rights and safety of our users.
      </p>

      {/* Your Choices */}
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Your Choices</h2>
      <p className="text-gray-700 mb-6">
        You can manage your preferences, including opting out of promotional communications,
        through your account settings or unsubscribe options.
      </p>

      {/* Data Security */}
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Data Security</h2>
      <p className="text-gray-700 mb-6">
        We implement reasonable security measures to protect your data. While we strive to
        ensure safety, no system can be 100% secure.
      </p>

      {/* Links to Other Services */}
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Links to Other Services</h2>
      <p className="text-gray-700 mb-6">
        The app may contain links to external websites or services. We are not responsible
        for their privacy policies, so please review them before sharing personal data.
      </p>

      {/* Policy Updates */}
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Policy Updates</h2>
      <p className="text-gray-700">
        We may update this policy from time to time. When changes are made, we’ll notify
        you through the app or website and update the effective date.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
