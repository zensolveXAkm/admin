import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig'; // Import Firestore
import { collection, getDocs } from 'firebase/firestore';

const TestimonialsList = () => {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const testimonialsCollection = collection(db, 'testimonials');
      const testimonialsSnapshot = await getDocs(testimonialsCollection);
      const testimonialsList = testimonialsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTestimonials(testimonialsList);
    };

    fetchTestimonials();
  }, []);

  return (
    <div className="my-4">
      <h2 className="text-xl font-bold mb-4">User Testimonials</h2>
      {testimonials.length > 0 ? (
        testimonials.map((testimonial) => (
          <div key={testimonial.id} className="border p-4 mb-2">
            <h3 className="font-semibold">{testimonial.name}</h3>
            <p>{testimonial.review}</p>
          </div>
        ))
      ) : (
        <p>No testimonials available yet.</p>
      )}
    </div>
  );
};

export default TestimonialsList;
