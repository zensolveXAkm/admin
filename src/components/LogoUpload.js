import React, { useState } from 'react';
import { db, storage } from '../firebaseConfig'; // Ensure this is the correct path to your Firebase configuration
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { addDoc, collection } from 'firebase/firestore';

const LogoUpload = () => {
  const [logo, setLogo] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleLogoUpload = (e) => {
    e.preventDefault();
    if (!logo) {
      setError('Please select a logo to upload.');
      return;
    }

    const logoRef = ref(storage, `companyLogos/${logo.name}`);
    const uploadTask = uploadBytesResumable(logoRef, logo);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error('Upload Error:', error); // Log upload error
        setError('Upload failed: ' + error.message);
      },
      async () => {
        try {
          const logoUrl = await getDownloadURL(logoRef);
          await addDoc(collection(db, 'companyLogos'), { logoUrl, createdAt: new Date() });

          setSuccessMessage('Logo uploaded successfully!');
          setLogo(null);
          setUploadProgress(0);
          setError(null);
        } catch (err) {
          console.error('Firestore Error:', err); // Log Firestore error
          setError('Failed to save logo URL: ' + err.message);
        }
      }
    );
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Upload Company Logo</h2>
      <form onSubmit={handleLogoUpload}>
        <input
          type="file"
          onChange={(e) => setLogo(e.target.files[0])}
          className="border p-2 mb-2 w-full"
          accept="image/*"
          required
        />
        {uploadProgress > 0 && (
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div
              className="bg-blue-500 h-2.5 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}
        {error && <p className="text-red-500">{error}</p>}
        {successMessage && <p className="text-green-500">{successMessage}</p>}
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Upload Logo</button>
      </form>
    </div>
  );
};

export default LogoUpload;
