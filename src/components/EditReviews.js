import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig'; // Import Firestore
import { collection, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';

const EditReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewsCollection = collection(db, 'testimonials');
        const reviewsSnapshot = await getDocs(reviewsCollection);
        const reviewsList = reviewsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReviews(reviewsList);
      } catch (err) {
        setError('Failed to fetch reviews');
      }
    };

    fetchReviews();
  }, []);

  // Handle deleting review
  const handleDelete = async (reviewId) => {
    try {
      const docRef = doc(db, 'testimonials', reviewId);
      await deleteDoc(docRef);
      setReviews(reviews.filter(review => review.id !== reviewId));
    } catch (error) {
      setError('Failed to delete review');
    }
  };

  // Handle updating review
  const handleUpdate = async (reviewId, newReview) => {
    try {
      const docRef = doc(db, 'testimonials', reviewId);
      await updateDoc(docRef, { review: newReview });
      setReviews(reviews.map(review =>
        review.id === reviewId ? { ...review, review: newReview } : review
      ));
    } catch (error) {
      setError('Failed to update review');
    }
  };

  return (
    <div className="my-4">
      <h2 className="text-xl font-bold mb-4">Edit Reviews</h2>
      {error && <p className="text-red-500">{error}</p>}
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <div key={review.id} className="border p-4 mb-2">
            <h3 className="font-semibold">{review.name}</h3>
            <textarea
              value={review.review}
              onChange={(e) => handleUpdate(review.id, e.target.value)}
              className="border p-2 w-full mb-2"
            />
            <button
              onClick={() => handleDelete(review.id)}
              className="text-red-500 mt-2"
            >
              Delete Review
            </button>
          </div>
        ))
      ) : (
        <p>No reviews to display</p>
      )}
    </div>
  );
};

export default EditReviews;
