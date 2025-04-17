import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLogin from './components/AdminLogin';
import Footer from './components/Footer';
import RecruiterLogin from './components/RecruiterLogin';
import RecruiterHome from './components/RecruiterHome';
import AdminHome from './components/AdminHome';

const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow"> {/* This ensures content takes available space */}
          <Routes>
            <Route path="/" element={<AdminLogin />} />
            <Route path="/admin-home" element={<AdminHome />} />    
            <Route path="/recruiter-login" element={<RecruiterLogin />} />
            <Route path="/recruiter-home/:rid" element={<RecruiterHome />} />
          </Routes>
        </main>
        <Footer /> 
      </div>
    </Router>
  );
};

export default App;

