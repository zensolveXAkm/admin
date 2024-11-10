import React, { useEffect, useState } from 'react';
import { db, storage } from '../firebaseConfig';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FaTrashAlt, FaPlusCircle } from 'react-icons/fa';
import {
  PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
} from 'recharts';
import JobApplications from './JobApplications'; // Import JobApplications component
import PleaseHelp from './pleasehelp';

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
  const [jobCategoryData, setJobCategoryData] = useState([]);
  const [companyName, setCompanyName] = useState('');
  const [position, setPosition] = useState('');
  const [vacancies, setVacancies] = useState(0);
  const [salaryFrom, setSalaryFrom] = useState('');
  const [salaryTo, setSalaryTo] = useState('');
  const [location, setLocation] = useState('');
  const [companyLogo, setCompanyLogo] = useState(null);
  const [category, setCategory] = useState('');

  useEffect(() => {
    fetchJobs();
    fetchUsers();
    fetchApplications();
  }, []);

  const fetchJobs = async () => {
    const jobsCollection = collection(db, 'jobs');
    const jobsSnapshot = await getDocs(jobsCollection);
    const jobsList = jobsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setJobs(jobsList);
    processJobCategoryData(jobsList);
  };

  const fetchUsers = async () => {
    const usersCollection = collection(db, 'users');
    const userSnapshot = await getDocs(usersCollection);
    const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setUsers(userList);
  };

  const fetchApplications = async () => {
    const applicationsCollection = collection(db, 'jobApplications');
    const applicationSnapshot = await getDocs(applicationsCollection);
    const applicationList = applicationSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setApplications(applicationList);
  };

  const processJobCategoryData = (jobsList) => {
    const categoryCount = categories.reduce((acc, category) => {
      acc[category] = jobsList.filter(job => job.category === category).length;
      return acc;
    }, {});
    const formattedData = Object.keys(categoryCount).map(key => ({
      name: key,
      value: categoryCount[key],
    }));
    setJobCategoryData(formattedData);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'];

  const handleAddJob = async (e) => {
    e.preventDefault();
    let logoURL = '';
    if (companyLogo) {
      const logoRef = ref(storage, `companyLogos/${companyLogo.name}`);
      await uploadBytes(logoRef, companyLogo);
      logoURL = await getDownloadURL(logoRef);
    }
    const jobData = { companyName, position, vacancies, salaryFrom, salaryTo, location, companyLogo: logoURL, category };
    try {
      await addDoc(collection(db, 'jobs'), jobData);
      fetchJobs();
      setCompanyName('');
      setPosition('');
      setVacancies(0);
      setSalaryFrom('');
      setSalaryTo('');
      setLocation('');
      setCompanyLogo(null);
      setCategory('');
    } catch (error) {
      console.error("Error adding job: ", error);
    }
  };

  const handleDeleteJob = async (jobId) => {
    try {
      await deleteDoc(doc(db, 'jobs', jobId));
      fetchJobs();
    } catch (error) {
      console.error("Error deleting job: ", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteDoc(doc(db, 'users', userId));
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user: ", error);
    }
  };

  const handleAccept = async (applicant) => {
    try {
      const applicantRef = doc(db, 'jobApplications', applicant.id);
      await updateDoc(applicantRef, { status: 'Accepted' });
      fetchApplications();
    } catch (error) {
      console.error("Error accepting application: ", error);
    }
  };

  const handleReject = async (applicationId) => {
    try {
      const applicantRef = doc(db, 'jobApplications', applicationId);
      await updateDoc(applicantRef, { status: 'Rejected' });
      fetchApplications();
    } catch (error) {
      console.error("Error rejecting application: ", error);
    }
  };

  return (
    <div className="container mx-auto p-8 text-gray-700">
      <h1 className="text-4xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 animate-pulse">
        Admin Panel
      </h1>

      {/* Visualization Section */}
      <div className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Job Category Distribution */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-center">Job Category Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={jobCategoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {jobCategoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Applications per Job */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-center">Applications per Job</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={applications.map(app => ({ job: app.jobPosition, applications: 1 }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="job" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="applications" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Add Job Form */}
      <div className="mb-10">
        <form onSubmit={handleAddJob} className="p-6 bg-white rounded-lg shadow-lg transform transition duration-500 hover:scale-105">
          <h2 className="text-2xl font-bold mb-6 text-center">Add New Job <FaPlusCircle className="inline ml-2 text-blue-600" /></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Company Name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="border-2 p-3 rounded-lg focus:outline-none focus:border-blue-300 transition"
              required
            />
            <input
              type="text"
              placeholder="Position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="border-2 p-3 rounded-lg focus:outline-none focus:border-blue-300 transition"
              required
            />
            <input
              type="number"
              placeholder="Vacancies"
              value={vacancies}
              onChange={(e) => setVacancies(e.target.value)}
              className="border-2 p-3 rounded-lg focus:outline-none focus:border-blue-300 transition"
              required
            />
            <input
              type="number"
              placeholder="Salary From"
              value={salaryFrom}
              onChange={(e) => setSalaryFrom(e.target.value)}
              className="border-2 p-3 rounded-lg focus:outline-none focus:border-blue-300 transition"
              required
            />
            <input
              type="number"
              placeholder="Salary To"
              value={salaryTo}
              onChange={(e) => setSalaryTo(e.target.value)}
              className="border-2 p-3 rounded-lg focus:outline-none focus:border-blue-300 transition"
              required
            />
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="border-2 p-3 rounded-lg focus:outline-none focus:border-blue-300 transition"
              required
            />
            <input
              type="file"
              onChange={(e) => setCompanyLogo(e.target.files[0])}
              className="border-2 p-3 rounded-lg focus:outline-none focus:border-blue-300 transition"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border-2 p-3 rounded-lg focus:outline-none focus:border-blue-300 transition"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="mt-6 w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition"
          >
            Add Job
          </button>
        </form>
      </div>

      {/* Job List */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-center">Manage Jobs</h2>
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-4 text-left">Company</th>
              <th className="p-4 text-left">Position</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-left">Vacancies</th>
              <th className="p-4 text-left">Salary</th>
              <th className="p-4 text-left">Location</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id} className="border-b hover:bg-gray-50">
                <td className="p-4">{job.companyName}</td>
                <td className="p-4">{job.position}</td>
                <td className="p-4">{job.category}</td>
                <td className="p-4">{job.vacancies}</td>
                <td className="p-4">{job.salaryFrom} - {job.salaryTo}</td>
                <td className="p-4">{job.location}</td>
                <td className="p-4">
                  <button
                    onClick={() => handleDeleteJob(job.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Job Applications Section */}
      <JobApplications 
        applications={applications} 
        onAccept={handleAccept} 
        onReject={handleReject} 
      />
      <PleaseHelp/>
    </div>
  );
};

export default AdminPanel;
