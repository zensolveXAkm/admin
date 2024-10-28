import React, { useState } from 'react';
import { db } from '../firebaseConfig'; // Adjust to your Firestore instance
import { storage } from '../firebaseConfig'; // Import your Firebase Storage
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'; // Use uploadBytesResumable for progress tracking
import { addDoc, collection } from 'firebase/firestore';

const SSUpload = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0); // State for upload progress

  const handleImageUpload = async (e) => {
    e.preventDefault();

    if (!image) {
      setError('Please select an image to upload.');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(image.type)) {
      setError('Please upload a valid image (jpeg, png, gif).');
      return;
    }

    try {
      // Create a storage reference
      const imageRef = ref(storage, `images/${image.name}`);
      // Create a reference to the file
      const uploadTask = uploadBytesResumable(imageRef, image);

      // Monitor the upload progress
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress); // Update progress state
        },
        (error) => {
          console.error('Upload Error:', error);
          setError(error.message);
        },
        async () => {
          // Get the download URL after successful upload
          const imageUrl = await getDownloadURL(uploadTask.snapshot.ref);

          // Add the image details to Firestore
          await addDoc(collection(db, 'images'), {
            title,
            description,
            imageUrl,
            createdAt: new Date(),
          });

          setSuccessMessage('Image uploaded successfully!');
          setTitle('');
          setDescription('');
          setImage(null);
          setError(null);
          setUploadProgress(0); // Reset progress after upload
        }
      );
    } catch (err) {
      console.error('Upload Error:', err); // Log the error for debugging
      setError(err.message);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-md max-w-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Upload Image</h2>
      <form onSubmit={handleImageUpload}>
        <input
          type="text"
          placeholder="Image Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 mb-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <textarea
          placeholder="Image Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 mb-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="file"
          onChange={(e) => {
            console.log(e.target.files[0]); // Log the selected file
            setImage(e.target.files[0]);
          }}
          className="border p-2 mb-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          accept="image/*"
          required
        />
        {error && <p className="text-red-500">{error}</p>}
        {successMessage && <p className="text-green-500">{successMessage}</p>}

        {/* Progress Bar */}
        {uploadProgress > 0 && (
          <div className="mt-4">
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-teal-600 bg-teal-200">
                    Uploading...
                  </span>
                </div>
                <div>
                  <span className="text-xs font-semibold inline-block text-teal-600">
                    {Math.round(uploadProgress)}%
                  </span>
                </div>
              </div>
              <div className="flex h-2 mb-4 bg-gray-200 rounded">
                <div
                  className="bg-teal-600 h-full rounded"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          </div>
        )}

        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded w-full">Upload Image</button>
      </form>
    </div>
  );
};

export default SSUpload;
