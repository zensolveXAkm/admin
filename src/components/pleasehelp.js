import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

const PleaseHelp = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastFetchedMessageCount, setLastFetchedMessageCount] = useState(0);
  const [soundAllowed, setSoundAllowed] = useState(false);  // State to track user interaction

  // Audio notification
  const notificationSound = new Audio('path_to_your_notification_sound.mp3'); // Add your sound path here

  // Fetch all contact messages from Firestore
  useEffect(() => {
    const fetchMessages = async () => {
      const messagesCollection = collection(db, 'contactMessages');
      const querySnapshot = await getDocs(messagesCollection);
      const messagesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Check if new messages are fetched
      if (messagesData.length > lastFetchedMessageCount) {
        // Trigger sound if user has interacted (allowed)
        if (soundAllowed) {
          notificationSound.play();  // Sound is allowed, so play it
        }
      }

      setMessages(messagesData);
      setLoading(false);
      setLastFetchedMessageCount(messagesData.length); // Update the message count
    };

    fetchMessages();
  }, [lastFetchedMessageCount, soundAllowed]); // Re-fetch when new messages come in

  // Trigger sound after user interaction
  const handleUserInteraction = () => {
    setSoundAllowed(true);  // Allow the sound to play after user interaction
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg">Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12" onClick={handleUserInteraction}>
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">Admin - Contact Messages</h2>

      <div className="overflow-hidden bg-white shadow sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {messages.map((message) => (
              <tr key={message.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{message.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{message.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{message.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{message.message}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(message.createdAt.seconds * 1000).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PleaseHelp;
