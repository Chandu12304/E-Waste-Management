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
import UserComponent from '../components/UserComponent/UserComponent.jsx';
import { jwtDecode } from 'jwt-decode';

function App() {
  // Check for a valid JWT token in localStorage
  const getInitialLoginState = () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    try {
      const decoded = jwtDecode(token);
      // Check if token is expired
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem('token');
        return false;
      }
      return true;
    } catch (e) {
      localStorage.removeItem('token');
      return false;
    }
  };

  const getInitialUserRole = () => {
    const token = localStorage.getItem('token');
    if (!token) return 'no';
    try {
      const decoded = jwt_decode(token);
      return decoded.role === 'admin' ? 'yes' : 'no';
    } catch (e) {
      return 'no';
    }
  };

  const [isLoggedIn, setIsLoggedIn] = useState(getInitialLoginState());
  const [userRole, setUserRole] = useState(getInitialUserRole());

  // Update local storage whenever isLoggedIn or userRole changes
  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn);
    localStorage.setItem('userRole', userRole);
  }, [isLoggedIn, userRole]);

  // Handle login by receiving the role from the Login component
  const handleLogin = (role) => {
    setIsLoggedIn(true);
    setUserRole(role === 'admin' ? 'yes' : 'no');
  };

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole('no');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
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
              {isLoggedIn && userRole === 'no' && <UserComponent />}
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
