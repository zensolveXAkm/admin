import React from 'react';
import { useLocation } from 'react-router-dom';
// eslint-disable-next-line
// import html2pdf from 'html2pdf.js';



const ThankYou = () => {
  const location = useLocation();
  const { applicantName, applicantEmail, jobPosition } = location.state || {};

  return (
    <div className="container mx-auto my-8 p-6 bg-gray-100">
      <h1 className="text-2xl font-bold text-center text-green-500">Thank You for Applying!</h1>
      <div className="mt-4 text-center">
        <p>Name: <strong>{applicantName}</strong></p>
        <p>Email: <strong>{applicantEmail}</strong></p>
        <p>Applied for: <strong>{jobPosition}</strong></p>
        <div className="mt-4">
          <p>We appreciate your interest in joining our team!</p>
          <p>Our team will review your application and get back to you soon.</p>
        </div>
        <div className="company-info mt-4">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/filterbot-daca0.appspot.com/o/WhatsApp%20Image%202024-10-24%20at%2018.43.25.jpeg?alt=media&token=43fe7052-3e06-4f8c-8911-11cff908256f"
            alt="ZenSolve Infotech Solution Logo"
            className="w-24 h-24 mx-auto"
          />
          <h3>ZenSolve Infotech Solution</h3>
          <p>Phone: +91 70616 12534</p>
          <p>Address: Bhagalpur Road, Godda, Jharkhand, 814133</p>
        </div>
        {/* <button onClick={downloadPDF} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
          Download as PDF
        </button> */}
      </div>
    </div>
  );
};

// const downloadPDF = () => {
//   const element = document.querySelector('.container');
//   const opt = {
//     margin:       1,
//     filename:     'thank_you.pdf',
//     image:        { type: 'jpeg', quality: 0.98 },
//     html2canvas:  { scale: 2 },
//     jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
//   };
//   html2pdf().from(element).set(opt).save();
// };

export default ThankYou;
