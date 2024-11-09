import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';

// Import all category pages
import AdminPanel from './components/AdminPanel';
import SSUpload from './components/SSUpload';
import LogoUpload from './components/LogoUpload';
import EditData from './components/EditData';
import EditReviews from './components/EditReviews';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Home Route */}
        <Route path="/" element={<AdminPanel />} />
        <Route path='/ss' element={ <SSUpload/> } />
        <Route path='/logo' element={<LogoUpload/>} />
        <Route path='/ed-ftr' element={<EditData/>} />
        <Route path='ed-rvw' element={<EditReviews/>}/>


      </Routes>
    </Router>
  );
};

export default App;
