import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import './css/EditData.css'; // Import the custom CSS file

const EditData = () => {
  const [contactData, setContactData] = useState({
    address: '',
    email: '',
    phone: '',
    linkedin: '',
    facebook: '',
    twitter: ''
  });

  // Load contact data from Firestore on component mount
  useEffect(() => {
    const fetchContactData = async () => {
      const docRef = doc(db, 'settings', 'contactData');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setContactData(docSnap.data());
      }
    };
    fetchContactData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContactData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, 'settings', 'contactData'), contactData);
      alert('Contact details updated successfully!');
    } catch (error) {
      console.error('Error updating contact details: ', error);
    }
  };

  return (
    <div className="edit-container">
      <h1 className="edit-title">Edit Contact and Social Media Links</h1>
      <form onSubmit={handleSubmit} className="edit-form">
        {[
          { label: 'Address', type: 'text', name: 'address', required: true },
          { label: 'Email', type: 'email', name: 'email', required: true },
          { label: 'Phone', type: 'tel', name: 'phone', required: true },
          { label: 'LinkedIn URL', type: 'url', name: 'linkedin' },
          { label: 'Facebook URL', type: 'url', name: 'facebook' },
          { label: 'Twitter URL', type: 'url', name: 'twitter' }
        ].map((field) => (
          <div key={field.name} className="form-group">
            <label className="form-label">{field.label}</label>
            <input
              type={field.type}
              name={field.name}
              value={contactData[field.name]}
              onChange={handleChange}
              className="form-input"
              required={field.required}
            />
          </div>
        ))}
        <button type="submit" className="submit-button">Save Changes</button>
      </form>
    </div>
  );
};

export default EditData;
