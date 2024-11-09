import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebaseConfig';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { addDoc, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

const SSUpload = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [images, setImages] = useState([]);

  // Fetch uploaded images from Firestore
  useEffect(() => {
    const fetchImages = async () => {
      const imagesCollection = await getDocs(collection(db, 'images'));
      const imagesData = imagesCollection.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setImages(imagesData);
    };
    fetchImages();
  }, []);

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
      const imageRef = ref(storage, `images/${image.name}`);
      const uploadTask = uploadBytesResumable(imageRef, image);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error('Upload Error:', error);
          setError(error.message);
        },
        async () => {
          const imageUrl = await getDownloadURL(uploadTask.snapshot.ref);

          const docRef = await addDoc(collection(db, 'images'), {
            title,
            description,
            imageUrl,
            createdAt: new Date(),
          });

          setImages([...images, { id: docRef.id, title, description, imageUrl }]);
          setSuccessMessage('Image uploaded successfully!');
          setTitle('');
          setDescription('');
          setImage(null);
          setError(null);
          setUploadProgress(0);
        }
      );
    } catch (err) {
      console.error('Upload Error:', err);
      setError(err.message);
    }
  };

  const handleDeleteImage = async (id, imageUrl) => {
    try {
      await deleteDoc(doc(db, 'images', id));

      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);

      setImages(images.filter((img) => img.id !== id));
      setSuccessMessage('Image deleted successfully!');
    } catch (error) {
      console.error('Error deleting image:', error);
      setError('Failed to delete image: ' + error.message);
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
          onChange={(e) => setImage(e.target.files[0])}
          className="border p-2 mb-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          accept="image/*"
          required
        />
        {error && <p className="text-red-500">{error}</p>}
        {successMessage && <p className="text-green-500">{successMessage}</p>}

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

        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded w-full">
          Upload Image
        </button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {images.map((img) => (
          <div key={img.id} className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
            <img src={img.imageUrl} alt={img.title} className="w-full h-32 object-contain mb-4" />
            <h3 className="text-lg font-semibold">{img.title}</h3>
            <p className="text-gray-600">{img.description}</p>
            <button
              onClick={() => handleDeleteImage(img.id, img.imageUrl)}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SSUpload;
