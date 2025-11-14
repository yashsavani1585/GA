import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

/**
 * CertifiedText
 * - Click SGL or IGI to show an inline preview of the certificate.
 * - Click "View Full Certificate" to navigate to /certificate (CertificateCard page).
 */

const labs = {
  sgl: {
    key: "sgl",
    name: "Solitaire Gemmological Laboratories (SGL)",
    website: "https://www.sgl-labs.com",
    short:
      "SGL is an independent international gem testing laboratory trusted by jewellers and consumers. Their reports represent high standards of reliability and integrity.",
  },
  igi: {
    key: "igi",
    name: "International Gemological Institute (IGI)",
    website: "https://www.igi.org",
    short:
      "IGI is one of the world's largest independent gem certification institutes, providing clear consumer-friendly documentation and global test centers.",
  },
};

const CertifiedText = () => {
  const [selected, setSelected] = useState(null); // 'sgl' | 'igi' | null
  const previewRef = useRef(null);
  const navigate = useNavigate();

  const openPreview = (labKey) => {
    setSelected(labKey);
    // Wait for preview to render, then scroll into view
    setTimeout(() => {
      previewRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 150);
  };

  return (
    <section className="w-full bg-[#CEBB98] py-10 px-4 sm:px-6 md:px-12 flex flex-col items-center justify-center text-center">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-gray-900">
        Certificate of Authenticity
      </h1>

      <p className="text-white text-sm sm:text-base md:text-lg max-w-3xl mb-6">
        Every piece of jewellery that we make is certified for authenticity by third-party international laboratories like{" "}
        <button
          onClick={() => openPreview("sgl")}
          className="text-gray-800 font-semibold underline hover:text-gray-900 transition ml-1"
        >
          SGL
        </button>{" "}
        and{" "}
        <button
          onClick={() => openPreview("igi")}
          className="text-gray-800 font-semibold underline hover:text-gray-900 transition"
        >
          IGI
        </button>
        .
      </p>

      <div className="flex gap-3">
        <button
          onClick={() => openPreview("sgl")}
          className="px-4 py-2 bg-white rounded-md text-sm font-medium shadow hover:bg-gray-100"
        >
          View SGL Preview
        </button>
        <button
          onClick={() => openPreview("igi")}
          className="px-4 py-2 bg-white rounded-md text-sm font-medium shadow hover:bg-gray-100"
        >
          View IGI Preview
        </button>
      </div>

      {/* Inline preview area */}
      <div ref={previewRef} className="w-full max-w-4xl mt-8">
        {selected && (
          <div className="bg-white rounded-lg shadow-md border p-6 text-left">
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{labs[selected].name}</h3>
                <p className="text-gray-700 mb-4">{labs[selected].short}</p>

                <div className="text-sm text-gray-600 mb-4">
                  <strong>What this means:</strong>{" "}
                  <span>
                    Certificates issued by {selected === "sgl" ? "SGL" : "IGI"} verify the gemological attributes and
                    treatment history of gemstones and provide buyers confidence about authenticity and quality.
                  </span>
                </div>

                <div className="flex gap-3 items-center">
                  {/* Navigate to full certificate page (CertificateCard must be mounted at /certificate) */}
                  <button
                    onClick={() => navigate("/certificate", { state: { lab: selected } })}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-700"
                  >
                    View Full Certificate
                  </button>

                  {/* Optional: open official lab website */}
                  <a
                    href={labs[selected].website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Official Website
                  </a>

                  {/* Close */}
                  <button
                    onClick={() => setSelected(null)}
                    className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700"
                  >
                    Close Preview
                  </button>
                </div>
              </div>

              <div className="w-36 flex-shrink-0">
                {/* small info box */}
                <div className="bg-yellow-50 border p-3 rounded-md">
                  <div className="text-xs font-semibold mb-2">Lab Info</div>
                  <div className="text-sm text-gray-600">{selected === "sgl" ? "SGL Centers" : "IGI Centers"}</div>
                  <ul className="text-sm text-gray-600 mt-2 list-disc list-inside">
                    {selected === "sgl" ? (
                      <>
                        <li>London</li>
                        <li>Mumbai</li>
                        <li>Bengaluru</li>
                      </>
                    ) : (
                      <>
                        <li>Antwerp</li>
                        <li>New York</li>
                        <li>Mumbai</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CertifiedText;
