import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Hero, AboutUs, ContactUs, Footer, Impact, Navbar, Chatbot } from '../components/imports';
import Login from '../components/Authorization_Authentication/Login';
import Signup from '../components/Authorization_Authentication/Signup';
import E_Shop from '../components/E_Shop/E_Shop';
import Profile from '../components/Profile/Profile';
import CentresList from '../components/Profile/CentresList';
import Admin from '../components/Admin/Admin';
import AdminCenter from "../components/Admin/Center.jsx"
import AdminShop from "../components/Admin/E_Shop.jsx"
import './App.css';
import { BASE_URL } from '../components/config.js';

function App() {
  // Initialize state from local storage or default values
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem('isLoggedIn') === 'true'
  );
  const [userRole, setUserRole] = useState(
    localStorage.getItem('userRole') || 'no'
  );

  // Update local storage whenever isLoggedIn or userRole changes
  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn);
    localStorage.setItem('userRole', userRole);
  }, [isLoggedIn, userRole]);

  // Handle login by receiving the role from the Login component
  const handleLogin = (role) => {
    setIsLoggedIn(true);
    if (role === 'admin') {
      setUserRole('yes');
    } else {
      setUserRole('no');
    }
  };

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole('no');
    // Clear local storage on logout
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
  };

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} userRole={userRole} />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero />
              <Impact />
              <AboutUs />
              <ContactUs />
              <Footer />
              <Chatbot />
            </>
          }
        />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/collectionCenter" element={<AdminCenter list="1" heading="Collection Centers" url={`${BASE_URL}/admin/collectionCenter`}/>}/>
        <Route path="/admin/recyclingFacility" element={<AdminCenter list="2" heading="Recycling Facilities" url={`${BASE_URL}/admin/recyclingFacility`}/>}/>
        <Route path="/admin/shop" element={<AdminShop/>}/>
        <Route path="/centresList" element={<CentresList />} />
        <Route path="/e-shop" element={<E_Shop />} />
      </Routes>
    </Router>
  );
}

export default App;
