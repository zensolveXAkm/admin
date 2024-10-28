import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig'; // Import Firestore
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';

const categories = [
  'IT & Software',
  'Construction',
  'Finance',
  'Healthcare',
  'Education',
  'Business',
  'Teaching',
  'Logistics',
];

const AdminPanel = () => {
  const [jobs, setJobs] = useState([]);
  const [users, setUsers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [companyName, setCompanyName] = useState('');
  const [position, setPosition] = useState('');
  const [vacancies, setVacancies] = useState(0);
  const [salaryFrom, setSalaryFrom] = useState('');
  const [salaryTo, setSalaryTo] = useState('');
  const [location, setLocation] = useState('');
  const [companyLogo, setCompanyLogo] = useState('');
  const [category, setCategory] = useState(''); // New state for category

  // Fetch jobs, users, and applications
  const fetchJobs = async () => {
    const jobsCollection = collection(db, 'jobs'); // Ensure you have a 'jobs' collection in Firestore
    const jobsSnapshot = await getDocs(jobsCollection);
    const jobsList = jobsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setJobs(jobsList);
  };

  const fetchUsers = async () => {
    const usersCollection = collection(db, 'users'); // Your users collection
    const userSnapshot = await getDocs(usersCollection);
    const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setUsers(userList);
  };

  const fetchApplications = async () => {
    const applicationsCollection = collection(db, 'jobApplications'); // Your job applications collection
    const applicationSnapshot = await getDocs(applicationsCollection);
    const applicationList = applicationSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setApplications(applicationList);
  };

  useEffect(() => {
    fetchJobs();
    fetchUsers();
    fetchApplications();
  }, []);

  const handleAddJob = async (e) => {
    e.preventDefault();
    const jobData = {
      companyName,
      position,
      vacancies,
      salaryFrom,
      salaryTo,
      location,
      companyLogo,
      category, // Include category in the job data
    };

    try {
      await addDoc(collection(db, 'jobs'), jobData);
      fetchJobs(); // Refresh the job list
      // Reset form fields including category
      setCompanyName('');
      setPosition('');
      setVacancies(0);
      setSalaryFrom('');
      setSalaryTo('');
      setLocation('');
      setCompanyLogo('');
      setCategory(''); // Reset category
    } catch (error) {
      console.error("Error adding job: ", error);
    }
  };

  const handleDeleteJob = async (jobId) => {
    try {
      await deleteDoc(doc(db, 'jobs', jobId));
      fetchJobs(); // Refresh the job list
    } catch (error) {
      console.error("Error deleting job: ", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteDoc(doc(db, 'users', userId));
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error("Error deleting user: ", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Admin Panel</h1>

      {/* Add Job Form */}
      <form onSubmit={handleAddJob} className="mb-6 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-4">Add New Job</h2>
        <input
          type="text"
          placeholder="Company Name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className="border p-2 mb-2 w-full"
          required
        />
        <input
          type="text"
          placeholder="Position"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          className="border p-2 mb-2 w-full"
          required
        />
        <input
          type="number"
          placeholder="Vacancies"
          value={vacancies}
          onChange={(e) => setVacancies(e.target.value)}
          className="border p-2 mb-2 w-full"
          required
        />
        <input
          type="text"
          placeholder="Salary From"
          value={salaryFrom}
          onChange={(e) => setSalaryFrom(e.target.value)}
          className="border p-2 mb-2 w-full"
          required
        />
        <input
          type="text"
          placeholder="Salary To"
          value={salaryTo}
          onChange={(e) => setSalaryTo(e.target.value)}
          className="border p-2 mb-2 w-full"
          required
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border p-2 mb-2 w-full"
          required
        />
        <input
          type="text"
          placeholder="Company Logo URL"
          value={companyLogo}
          onChange={(e) => setCompanyLogo(e.target.value)}
          className="border p-2 mb-2 w-full"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 mb-2 w-full"
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Add Job</button>
      </form>

      {/* Job Listings */}
      <h2 className="text-xl font-semibold mb-4">Job Listings</h2>
      <ul>
        {jobs.map(job => (
          <li key={job.id} className="border p-2 mb-2 flex justify-between items-center">
            <span>{job.position} at {job.companyName}</span>
            <button onClick={() => handleDeleteJob(job.id)} className="text-red-500">Delete</button>
          </li>
        ))}
      </ul>

      {/* User Listings */}
      <h2 className="text-xl font-semibold mb-4">User Listings</h2>
      <ul>
        {users.map(user => (
          <li key={user.id} className="border p-2 mb-2 flex justify-between items-center">
            <span>{user.email}</span>
            <button onClick={() => handleDeleteUser(user.id)} className="text-red-500">Delete</button>
          </li>
        ))}
      </ul>

      {/* Applications */}
      <h2 className="text-xl font-semibold mb-4">Job Applications</h2>
      <ul>
        {applications.map(app => (
          <li key={app.id} className="border p-2 mb-2">
            <p>Name: {app.applicantName}</p>
            <p>Email: {app.applicantEmail}</p>
            <p>Applied for: {app.jobPosition} at {app.companyName}</p>
            {app.resume && (
              <a href={app.resume} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                View Resume
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPanel;
