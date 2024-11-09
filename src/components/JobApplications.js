import React, { useState } from 'react';
import * as XLSX from 'xlsx';

// Function to generate the Gmail link for the acceptance email
const generateGmailLink = (applicant) => {
  const { applicantName, applicantEmail, jobPosition, companyName } = applicant;
  const subject = `Application Accepted - ${jobPosition} at ${companyName}`;
  const body = `
    Dear ${applicantName},
    
    Thank you for applying for the ${jobPosition} position at ${companyName}. 
    
    We are pleased to inform you that your application has been accepted, and we will get in touch with you soon.
  `.trim();
  
  const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(applicantEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  
  return gmailLink;
};

// Function to generate the Gmail link for the rejection email
const generateRejectGmailLink = (applicant) => {
  const { applicantName, applicantEmail, jobPosition, companyName } = applicant;
  const subject = `Application Status - ${jobPosition} at ${companyName}`;
  const body = `
    Dear ${applicantName},
    
    Thank you for your interest in the ${jobPosition} position at ${companyName}.
    
    We have reviewed your application carefully, but unfortunately, we will not be moving forward with your application at this time.
  `.trim();
  
  const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(applicantEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  
  return gmailLink;
};

// Function to export applicants to Excel
const exportToExcel = (applications) => {
  const data = applications.map(app => ({
    Name: app.applicantName,
    Email: app.applicantEmail,
    "Applied for": `${app.jobPosition} at ${app.companyName}`,
    "Resume Link": app.resume || "No Resume"
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Applications");

  // Generate and trigger the download of the Excel file
  XLSX.writeFile(workbook, "Job_Applications.xlsx");
};

const JobApplications = ({ applications }) => {
  const [completedApplications, setCompletedApplications] = useState([]);
  const [markedCompleted, setMarkedCompleted] = useState({});

  const handleMarkAsCompleted = (appId) => {
    if (window.confirm("Are you sure you want to mark this application as completed?")) {
      setCompletedApplications((prev) => [...prev, appId]);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mt-12 mb-6 text-center">Job Applications</h2>
      
      {/* Export Button */}
      <div className="text-center mb-6">
        <button 
          onClick={() => exportToExcel(applications)} 
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200">
          Export to Excel
        </button>
      </div>
      
      <ul className="space-y-4">
        {applications.map((app) => {
          if (completedApplications.includes(app.id)) return null;

          return (
            <li key={app.id} className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <p className="font-semibold">Name: <span className="font-normal">{app.applicantName}</span></p>
              <p className="font-semibold">Email: <span className="font-normal">{app.applicantEmail}</span></p>
              <p className="font-semibold">Applied for: <span className="font-normal">{app.jobPosition} at {app.companyName}</span></p>
              
              {app.resume && (
                <a href={app.resume} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline hover:text-blue-700 transition-colors duration-200">
                  View Resume
                </a>
              )}

              <div className="mt-4 flex space-x-4">
                <a 
                  href={generateGmailLink(app)} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
                  onClick={() => setMarkedCompleted({ ...markedCompleted, [app.id]: true })}>
                  Accept
                </a>
                <a 
                  href={generateRejectGmailLink(app)} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                  onClick={() => setMarkedCompleted({ ...markedCompleted, [app.id]: true })}>
                  Reject
                </a>

                {markedCompleted[app.id] && (
                  <button 
                    onClick={() => handleMarkAsCompleted(app.id)} 
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200">
                    Mark as Completed
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default JobApplications;
