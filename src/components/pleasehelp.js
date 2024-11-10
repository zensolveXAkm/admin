import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { FiPhone, FiMail, FiXCircle, FiBell, FiUser, FiClock } from 'react-icons/fi';
import { FaEnvelopeOpenText, FaCalendarAlt, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';

const PleaseHelp = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMessagePopup, setNewMessagePopup] = useState(null);
  const [showContactOptions, setShowContactOptions] = useState(false);
  const [isPopupHidden, setIsPopupHidden] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      const messagesCollection = collection(db, 'contactMessages');
      const querySnapshot = await getDocs(messagesCollection);
      const messagesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const lastMessage = messagesData[messagesData.length - 1];
      if (lastMessage && !isPopupHidden) {
        setNewMessagePopup(lastMessage);
      }

      setMessages(messagesData);
      setLoading(false);
    };

    fetchMessages();
  }, [isPopupHidden]);

  const handleRemindNextTime = () => {
    setIsPopupHidden(true);
    setNewMessagePopup(null);
  };

  const handleAccept = () => {
    setShowContactOptions(true);
  };

  const handleResolved = async (messageId) => {
    try {
      await deleteDoc(doc(db, 'contactMessages', messageId));
      setMessages((prevMessages) =>
        prevMessages.filter((message) => message.id !== messageId)
      );
    } catch (error) {
      console.error('Error removing resolved message:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg">Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8 flex items-center justify-center">
        <FaEnvelopeOpenText className="mr-2 text-blue-500" /> Admin - Contact Messages
      </h2>

      {newMessagePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 animate-fadeIn">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center relative animate-slideIn">
            <IoMdClose
              onClick={() => setNewMessagePopup(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 cursor-pointer"
              size={20}
            />
            <p className="text-lg font-semibold mb-4 text-gray-800 flex items-center justify-center">
              <FiBell className="mr-2 text-yellow-500" /> A person needs help right now
            </p>
            {!showContactOptions ? (
              <>
                <button
                  onClick={handleAccept}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md font-semibold shadow-md hover:bg-blue-600 focus:outline-none transition-colors mb-4 flex items-center justify-center"
                >
                  <FaCheckCircle className="mr-2" /> Accept
                </button>
                <button
                  onClick={handleRemindNextTime}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md font-semibold hover:bg-gray-400 transition-colors flex items-center justify-center"
                >
                  <FiClock className="mr-2" /> Remind Me Next Time
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center space-y-4">
                <button
                  onClick={() => window.location.href = `tel:${newMessagePopup.phone}`}
                  className="flex items-center bg-green-500 text-white py-2 px-4 rounded-md font-semibold hover:bg-green-600 transition-colors"
                >
                  <FiPhone className="mr-2" /> Call
                </button>
                <button
                  onClick={() => {
                    const subject = `Help Request from ${newMessagePopup.name}`;
                    const body = `Hello ${newMessagePopup.name},\n\nI received your request for help. How can I assist you?\n\nBest regards,\nYour Team`;
                    const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${newMessagePopup.email}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                    window.open(gmailComposeUrl, '_blank');
                  }}
                  className="flex items-center bg-blue-500 text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-600 transition-colors"
                >
                  <FiMail className="mr-2" /> Email
                </button>
                <button
                  onClick={() => {
                    const subject = `Regarding Your Help Request`;
                    const body = `Hello ${newMessagePopup.name},\n\nWe regret to inform you that we are unable to assist with your request at this time.\n\nBest regards,\nYour Team`;
                    const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${newMessagePopup.email}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                    window.open(gmailComposeUrl, '_blank');
                  }}
                  className="flex items-center bg-red-500 text-white py-2 px-4 rounded-md font-semibold hover:bg-red-600 transition-colors"
                >
                  <FiXCircle className="mr-2" /> Reject
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="overflow-hidden bg-white shadow sm:rounded-lg mt-8">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <FiUser className="inline-block mr-1 text-gray-500" /> Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <FiMail className="inline-block mr-1 text-gray-500" /> Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <FiPhone className="inline-block mr-1 text-gray-500" /> Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <FaExclamationTriangle className="inline-block mr-1 text-yellow-500" /> Message
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <FaCalendarAlt className="inline-block mr-1 text-gray-500" /> Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <FaCheckCircle className="inline-block mr-1 text-green-500" /> Action
              </th>
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
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => handleResolved(message.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md font-semibold hover:bg-red-600 transition-colors flex items-center"
                  >
                    <FaCheckCircle className="mr-2" /> Resolved
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PleaseHelp;
