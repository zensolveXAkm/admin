import React from 'react';

// Function to generate the Gmail link for the acceptance email
const generateGmailLink = (applicant) => {
  const { applicantName, applicantEmail, jobPosition, companyName } = applicant;
  const subject = `Application Accepted - ${jobPosition} at ${companyName}`;
  const body = `
    Dear ${applicantName},
    
    Thank you for applying for the ${jobPosition} position at ${companyName}. 
    
    We are pleased to inform you that your application has been accepted, and we will get in touch with you soon. Here are the details we received:
    
    - Name: ${applicantName}
    - Email: ${applicantEmail}
    - Position: ${jobPosition} at ${companyName}

    We look forward to working with you!
    
    Best regards,
    The Recruitment Team
    ZenSolve Infotech Solution

    Contact Information:
    - Address: 2nd floor, Bhagalpur Road, Godda, Near Railway Station
    - Email: support@infozensolve.in
    - Call us: 02269622941

    Copyright © 2024 by ZenSolve Infotech Solution Private Limited. All Rights Reserved.
  `.trim();
  
  // Creating the Gmail link
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
    
    We have reviewed your application carefully, but unfortunately, we will not be moving forward with your application at this time. We encourage you to apply again in the future if a suitable opportunity arises.
    
    Best of luck with your job search and future career endeavors.

    Sincerely,
    The Recruitment Team
    ZenSolve Infotech Solution

    Contact Information:
    - Address: 2nd floor, Bhagalpur Road, Godda, Near Railway Station
    - Email: support@infozensolve.in
    - Call us: 02269622941

    Copyright © 2024 by ZenSolve Infotech Solution Private Limited. All Rights Reserved.
  `.trim();
  
  const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(applicantEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  
  return gmailLink;
};

const JobApplications = ({ applications }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mt-12 mb-6 text-center">Job Applications</h2>
      <ul className="space-y-4">
        {applications.map(app => (
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
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200">
                Accept
              </a>
              <a 
                href={generateRejectGmailLink(app)} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200">
                Reject
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JobApplications;
