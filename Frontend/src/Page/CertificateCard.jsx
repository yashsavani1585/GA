import React, { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";



const sampleData = {
  companyName: "Sparkle & Shine",
  companyGST: "27ABCDE1234F1Z5",
  certificateTitle: "Certificate of Authenticity",
  ownerName: "Mr. Yash Savani",
  productName: "Elegant Gold Diamond Hoop Earrings",
  productType: "Earrings",
  productDetails: "14K Yellow Gold, Total Diamond Weight: 0.50 CT, Round Brilliant",
  metal: {
    type: "Gold",
    purity: "14K (58.5% Au)",
    hallmark: "BIS 916",
  },
  gemstone: {
    type: "Diamond",
    carat: 0.50,
    color: "G",
    clarity: "VS2",
    cut: "Excellent",
    treatments: "None detected",
  },
  lab: {
    name: "Gemological Science International (GSI)",
    reportId: "GSI-2025-785421",
    reportUrl: "https://www.gsi.org/verify/GSI-2025-785421" // example
  },
  certificateId: "SS-2025-000471",
  certifiedBy: "Gemological Science International (GSI)",
  grade: "Color: G | Clarity: VS2 | Cut: Excellent | Carat: 0.50",
  issueDate: "14 November 2025",
  signatureName: "Authorized Signatory",
  signatureTitle: "Quality Manager",
  labLogoUrl: "/gsi-logo.jpg",       // place under public/
  companyLogoUrl: "/logo.png",      // place under public/
  remarks:
    "This certificate confirms the authenticity and described attributes of the supplied gem. For verification, visit the verification URL or scan the certificate code.",
  verificationUrl: "https://sparkle-and-shine.example.com/api/verify/SS-2025-000471"
};

export default function CertificateCard({ data = sampleData }) {
  const ref = useRef(null);

  // Export PNG (high-resolution)
  const exportAsImage = async () => {
    if (!ref.current) return;
    const canvas = await html2canvas(ref.current, { scale: 3, useCORS: true });
    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = `${data.companyName.replace(/\s+/g, "_")}_${data.certificateId}.png`;
    link.click();
  };

  // Export as A4 PDF, portrait
  const downloadAsPDF = async () => {
    if (!ref.current) return;
    // Render element to canvas at high scale
    const canvas = await html2canvas(ref.current, { scale: 3, useCORS: true, logging: false });
    const imgData = canvas.toDataURL("image/png");

    // jsPDF A4 dimensions in pt (portrait)
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4"
    });

    // A4 size in pt
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // calculate image ratio to fit width, keep aspect ratio
    const imgWidth = pageWidth - 40; // margin 20pt each side
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let positionY = 20;
    // If image height greater than page, scale down further to fit
    let finalImgHeight = imgHeight;
    let finalImgWidth = imgWidth;
    if (imgHeight > pageHeight - 40) {
      const scale = (pageHeight - 40) / imgHeight;
      finalImgHeight = imgHeight * scale;
      finalImgWidth = imgWidth * scale;
    }

    pdf.addImage(imgData, "PNG", 20, positionY, finalImgWidth, finalImgHeight);
    pdf.save(`${data.companyName.replace(/\s+/g, "_")}_${data.certificateId}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      {/* Banner */}
      <div className="w-full max-w-4xl mb-6">
        <div className="flex justify-between items-center bg-[#CEBB98] text-white rounded-md px-6 py-3 shadow-md">
          <div className="text-xl font-bold">{data.companyName}</div>
          <div className="text-sm opacity-90">Official Certificate</div>
        </div>
      </div>

      {/* Certificate card */}
      <div
        ref={ref}
        className="w-full max-w-4xl bg-white rounded-lg shadow-xl border border-gray-200 p-8"
        style={{ fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {/* Company logo */}
            {data.companyLogoUrl ? (
              <img src={data.companyLogoUrl} alt="Company Logo" className="w-28 h-16 object-contain" />
            ) : (
              <div className="w-28 h-16 rounded-md bg-gray-100 flex items-center justify-center text-gray-700 font-bold">
                {data.companyName.split(" ").slice(0,2).map(s=>s[0]).join("")}
              </div>
            )}

            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">{data.certificateTitle}</h1>
              <div className="text-sm text-gray-500">Official Authentication Document</div>
              <div className="text-xs text-gray-600 mt-1">GST: <span className="font-medium">{data.companyGST}</span></div>
            </div>
          </div>

          {/* Lab logo */}
          <div className="flex flex-col items-end">
            {data.labLogoUrl ? (
              <img src={data.labLogoUrl} alt="Lab Logo" className="w-28 h-16 object-contain" />
            ) : (
              <div className="w-20 h-12 rounded-md bg-yellow-100 flex items-center justify-center text-yellow-800 font-semibold">
                LAB
              </div>
            )}
            <div className="text-xs text-gray-400 mt-2">{data.certifiedBy}</div>
            <div className="text-xs text-gray-400">{data.lab.reportId}</div>
          </div>
        </div>

        {/* Body - product & validation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left */}
          <div className="space-y-4">
            <div>
              <div className="text-xs text-gray-500">Certificate ID</div>
              <div className="mt-1 font-semibold text-gray-800">{data.certificateId}</div>
            </div>

            <div>
              <div className="text-xs text-gray-500">Owner / Buyer</div>
              <div className="mt-1 font-semibold text-gray-800">{data.ownerName}</div>
            </div>

            <div>
              <div className="text-xs text-gray-500">Product</div>
              <div className="mt-1 font-semibold text-gray-800">{data.productName} • {data.productType}</div>
            </div>

            <div>
              <div className="text-xs text-gray-500">Metal Details</div>
              <div className="mt-1 text-gray-700 bg-gray-50 border border-gray-100 rounded-md p-3 text-sm">
                Type: {data.metal.type} • Purity: {data.metal.purity} • Hallmark: {data.metal.hallmark}
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="space-y-4">
            <div>
              <div className="text-xs text-gray-500">Gemstone / Diamond Details</div>
              <div className="mt-1 text-gray-800">
                <div><span className="font-medium">{data.gemstone.type}</span> • {data.gemstone.carat} CT</div>
                <div className="text-sm text-gray-600">Color: {data.gemstone.color} • Clarity: {data.gemstone.clarity}</div>
                <div className="text-sm text-gray-600">Cut: {data.gemstone.cut} • Treatments: {data.gemstone.treatments}</div>
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-500">Certified By</div>
              <div className="mt-1 font-semibold text-gray-800">{data.certifiedBy}</div>
            </div>

            <div>
              <div className="text-xs text-gray-500">Issue Date</div>
              <div className="mt-1 text-gray-800">{data.issueDate}</div>
            </div>

            <div>
              <div className="text-xs text-gray-500">Remarks</div>
              <div className="mt-1 text-sm text-gray-700 bg-gray-50 border border-gray-100 rounded-md p-3">
                {data.remarks}
              </div>
            </div>
          </div>
        </div>

        {/* Validation & verification */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div>
            <div className="text-xs text-gray-500">Lab Report Verification</div>
            <div className="mt-2 text-sm">
              Report ID: <b>{data.lab.reportId}</b> • <a className="text-indigo-600 underline" href={data.lab.reportUrl} target="_blank" rel="noopener noreferrer">Verify on lab site</a>
            </div>
            <div className="mt-2 text-sm">
              Certificate Verification: <b>{data.certificateId}</b> • <a className="text-indigo-600 underline" href={data.verificationUrl} target="_blank" rel="noopener noreferrer">Verify on Sparkle & Shine</a>
            </div>
          </div>

          <div className="flex justify-end md:justify-end">
            <div className="text-right">
              <div className="text-xs text-gray-500">Inspector</div>
              <div className="font-semibold text-gray-800">{data.signatureName}</div>
              <div className="text-xs text-gray-500">{data.signatureTitle}</div>
            </div>
          </div>
        </div>

        {/* Footer - signature and seal */}
        <div className="mt-8 flex items-center justify-between">
          <div className="flex flex-col">
            <div className="h-px w-56 bg-gray-300 mb-2" />
            <div className="font-semibold text-gray-800">{data.signatureName}</div>
            <div className="text-xs text-gray-500">{data.signatureTitle}</div>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full border-4 border-yellow-300 flex items-center justify-center mb-2 bg-clip-padding" >
              <div className="text-yellow-700 font-bold">AUTHENTIC</div>
            </div>
            <div className="text-xs text-gray-500">Verification code: <span className="font-medium">{data.certificateId}</span></div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex gap-3">
        <button
          onClick={exportAsImage}
          className="px-4 py-2 rounded-md bg-white border border-gray-300 text-sm font-semibold hover:shadow"
        >
          Export as PNG
        </button>
        <button
          onClick={downloadAsPDF}
          className="px-4 py-2 rounded-md bg-[#CEBB98] text-white text-sm font-semibold hover:opacity-90"
        >
          Download A4 PDF
        </button>
      </div>

      {/* small help text */}
      <p className="text-xs text-gray-500 mt-3 max-w-2xl text-center">
        For production: persist certificate records on server and provide a verification API endpoint. Client-side export is for printing and user convenience.
      </p>
    </div>
  );
}
