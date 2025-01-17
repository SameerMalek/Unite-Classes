import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './Pages/homePage/HomePage.jsx';
import ClassDetailPage from './Pages/classDetailPage/ClassDetailPage';
import Footer from './Components/footer/Footer';
import Navbar from './Components/Navbar.js'
import SubjectCategoryPage from './Pages/categoryDetailPage/CategoryDetailPage.jsx' // Import your new category page component
import CategoryContentPage from './Pages/CategoryContentPage/CategoryContentPage.jsx'
import AdminDashboard from './Components/AdminDashboard.jsx';
import About from "./Components/About.js";
import './App.css';  // or './App.css' depending on where your global styles are located

function App () {
  return (
    <Router>
      <div className='container'>
        <Navbar/>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/class/:classId' element={<ClassDetailPage />} />
          <Route path="/about" element={<About />} />
          {/* Admin routes */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/classes/:classId/subjects/:subjectName/categories" element={<SubjectCategoryPage />} />  {/* Corrected the component name */}
          <Route path="/classes/:classId/subjects/:subjectName/categories/:categoryType" element={<CategoryContentPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
