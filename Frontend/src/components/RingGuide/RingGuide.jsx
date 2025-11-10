import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";

// ✅ Proper worker setup for Vite
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";
pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

const RingGuide = () => {
  const [numPages, setNumPages] = useState(null);
  const [width, setWidth] = useState(window.innerWidth);

  const onLoadSuccess = ({ numPages }) => setNumPages(numPages);

  // ✅ Update width on resize
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ Responsive PDF width logic
  const getPageWidth = () => {
    if (width < 500) return width * 0.9; // mobile
    if (width < 1024) return width * 0.7; // tablet
    return width * 0.5; // desktop
  };

  return (
    <div className="w-full min-h-screen bg-white flex justify-center items-center ">
      <Document file="/gems global ring_size_chart_pdf.pdf" onLoadSuccess={onLoadSuccess}>
        {Array.from(new Array(numPages), (el, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            width={getPageWidth()}
            renderAnnotationLayer={false}
            renderTextLayer={false}
          />
        ))}
      </Document>
    </div>
  );
};

export default RingGuide;
