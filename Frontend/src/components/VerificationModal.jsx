// import React, { useState } from "react";

// const VerificationModal = ({ onVerify }) => {
//   const [accepted, setAccepted] = useState(false);
//   const [pan, setPan] = useState("");
//   const [aadhar, setAadhar] = useState("");
//   const [passport, setPassport] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!accepted) return alert("Please accept the rules first!");
//     if (!pan && !aadhar && !passport)
//       return alert("Please submit at least one document (PAN, Aadhar, or Passport)");
//     onVerify({ pan, aadhar, passport });
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//       <div className="bg-white rounded-lg p-6 max-w-xl w-full">
//         <h2 className="text-2xl font-bold mb-4 text-center">Auction Rules & Verification</h2>

        // <div className="mb-4 max-h-64 overflow-y-auto">
        //   <h3 className="font-semibold mb-2">English</h3>
        //   <ul className="list-disc ml-5 text-sm mb-3">
        //     <li>All participants must verify their profile before participating.</li>
        //     <li>Verification requires PAN, Aadhar, or Passport.</li>
        //     <li>Until verified by admin, the user cannot bid in any auction.</li>
        //     <li>Verification will typically take up to 7 hours / 1 day.</li>
        //     <li>Once verified, the user will not need to verify again.</li>
        //     <li>Users must accept the rules before participating.</li>
        //     <li>Any violation may lead to temporary or permanent suspension.</li>
        //     <li>Only registered users can participate.</li>
        //     <li>Bids are final and cannot be cancelled once placed.</li>
        //   </ul>

        //   <h3 className="font-semibold mb-2">Hindi</h3>
        //   <ul className="list-disc ml-5 text-sm">
        //     <li>सभी प्रतिभागियों को नीलामी में भाग लेने से पहले अपना प्रोफ़ाइल सत्यापित करना आवश्यक है।</li>
        //     <li>सत्यापन के लिए PAN, Aadhaar या Passport जमा करना होगा।</li>
        //     <li>जब तक एडमिन सत्यापन नहीं करता, उपयोगकर्ता नीलामी में भाग नहीं ले सकता।</li>
        //     <li>सत्यापन में आमतौर पर 7 घंटे / 1 दिन लग सकते हैं।</li>
        //     <li>एक बार सत्यापित होने के बाद, उपयोगकर्ता को फिर से सत्यापन की आवश्यकता नहीं होगी।</li>
        //     <li>प्रतिभागी को नियम स्वीकार करना आवश्यक है।</li>
        //     <li>नियमों का उल्लंघन करने पर अस्थायी या स्थायी निलंबन हो सकता है।</li>
        //     <li>केवल पंजीकृत उपयोगकर्ता भाग ले सकते हैं।</li>
        //     <li>लगाई गई बोली अंतिम है और रद्द नहीं की जा सकती।</li>
        //   </ul>
        // </div>

//         <form onSubmit={handleSubmit}>
//           <div className="mb-3">
//             <label className="block mb-1 font-semibold">
//               PAN:
//               <input
//                 type="text"
//                 value={pan}
//                 onChange={(e) => setPan(e.target.value)}
//                 className="border rounded w-full p-2 mt-1"
//               />
//             </label>
//           </div>
//           <div className="mb-3">
//             <label className="block mb-1 font-semibold">
//               Aadhar:
//               <input
//                 type="text"
//                 value={aadhar}
//                 onChange={(e) => setAadhar(e.target.value)}
//                 className="border rounded w-full p-2 mt-1"
//               />
//             </label>
//           </div>
//           <div className="mb-3">
//             <label className="block mb-1 font-semibold">
//               Passport:
//               <input
//                 type="text"
//                 value={passport}
//                 onChange={(e) => setPassport(e.target.value)}
//                 className="border rounded w-full p-2 mt-1"
//               />
//             </label>
//           </div>

//           <div className="mb-4 flex items-center">
//             <input
//               type="checkbox"
//               checked={accepted}
//               onChange={() => setAccepted(!accepted)}
//               id="acceptRules"
//               className="mr-2"
//             />
//             <label htmlFor="acceptRules" className="text-sm">
//               I have read and accept the auction rules.
//             </label>
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-yellow-700 hover:bg-yellow-800 text-white font-semibold py-2 px-4 rounded"
//           >
//             Confirm & Submit
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default VerificationModal;


import React, { useState } from "react";

const VerificationModal = ({ onVerify, onClose, verificationPending }) => {
  const [accepted, setAccepted] = useState(false);
  const [documentType, setDocumentType] = useState("PAN");
  const [documentFile, setDocumentFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (verificationPending)
      return alert("Your verification is already pending admin approval!");

    if (!accepted) return alert("Please accept the auction rules first!");
    if (!documentFile) return alert("Please upload your document!");

    const formData = new FormData();
    formData.append("documentType", documentType);
    formData.append("documentFile", documentFile);

    onVerify(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-xl w-full shadow-xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-black text-lg font-bold"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">
          Auction Rules & Verification
        </h2>

        <div className="mb-4 max-h-64 overflow-y-auto text-sm border p-3 rounded">
          <h3 className="font-semibold mb-2">English</h3>
          <ul className="list-disc ml-5 mb-3">
            <li>All participants must verify their profile before bidding.</li>
            <li>Valid documents: PAN, Aadhar, or Passport.</li>
            <li>Admin approval is required before bidding.</li>
            <li>Verification takes up to 7 hours / 1 day.</li>
            <li>Once verified, you will not need to re-verify.</li>
            <li>Breaking rules may lead to suspension.</li>
            <li>Bids are final and cannot be canceled.</li>
          </ul>

          <h3 className="font-semibold mb-2">Hindi</h3>
          <ul className="list-disc ml-5">
            <li>
              नीलामी में भाग लेने से पहले प्रोफ़ाइल का सत्यापन अनिवार्य है।
            </li>
            <li>सत्यापन के लिए PAN, Aadhaar या Passport आवश्यक है।</li>
            <li>
              एडमिन द्वारा सत्यापन पूरा होने के बाद ही नीलामी में भाग ले
              सकते हैं।
            </li>
            <li>सत्यापन में 7 घंटे से 1 दिन का समय लग सकता है।</li>
            <li>एक बार सत्यापित होने पर पुनः सत्यापन की आवश्यकता नहीं होगी।</li>
            <li>नियमों का उल्लंघन करने पर खाता निलंबित हो सकता है।</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block mb-1 font-semibold">Document Type</label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="border rounded w-full p-2"
            >
              <option value="PAN">PAN</option>
              <option value="Aadhar">Aadhar</option>
              <option value="Passport">Passport</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-semibold">Upload Document</label>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => setDocumentFile(e.target.files[0])}
              className="w-full"
            />
          </div>

          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              checked={accepted}
              onChange={() => setAccepted(!accepted)}
              id="acceptRules"
              className="mr-2"
            />
            <label htmlFor="acceptRules" className="text-sm">
              I have read and accept the auction rules.
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-700 hover:bg-yellow-800 text-white font-semibold py-2 px-4 rounded"
          >
            {verificationPending ? "Verification Pending..." : "Confirm & Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerificationModal;
