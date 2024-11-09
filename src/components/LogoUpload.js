import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebaseConfig';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { addDoc, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

const LogoUpload = () => {
  const [logo, setLogo] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [logos, setLogos] = useState([]);

  // Fetch uploaded logos from Firestore
  useEffect(() => {
    const fetchLogos = async () => {
      const logosCollection = await getDocs(collection(db, 'companyLogos'));
      const logosData = logosCollection.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLogos(logosData);
    };
    fetchLogos();
  }, []);

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
        console.error('Upload Error:', error);
        setError('Upload failed: ' + error.message);
      },
      async () => {
        try {
          const logoUrl = await getDownloadURL(logoRef);
          const docRef = await addDoc(collection(db, 'companyLogos'), { logoUrl, createdAt: new Date() });
          setLogos([...logos, { id: docRef.id, logoUrl }]);

          setSuccessMessage('Logo uploaded successfully!');
          setLogo(null);
          setUploadProgress(0);
          setError(null);
        } catch (err) {
          console.error('Firestore Error:', err);
          setError('Failed to save logo URL: ' + err.message);
        }
      }
    );
  };

  const handleDeleteLogo = async (id, logoUrl) => {
    try {
      // Delete from Firestore
      await deleteDoc(doc(db, 'companyLogos', id));

      // Delete from Storage
      const logoRef = ref(storage, logoUrl);
      await deleteObject(logoRef);

      // Remove from state
      setLogos(logos.filter(logo => logo.id !== id));
      setSuccessMessage('Logo deleted successfully!');
    } catch (error) {
      console.error('Error deleting logo:', error);
      setError('Failed to delete logo: ' + error.message);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Upload Company Logo</h2>
      <form onSubmit={handleLogoUpload} className="mb-6">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {logos.map((logo) => (
          <div key={logo.id} className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
            <img src={logo.logoUrl} alt="Company Logo" className="w-full h-32 object-contain mb-4" />
            <button
              onClick={() => handleDeleteLogo(logo.id, logo.logoUrl)}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogoUpload;
