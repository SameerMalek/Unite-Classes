import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './Pages/homePage/HomePage.jsx';
import ClassDetailPage from './Pages/classDetailPage/ClassDetailPage';
// import CourseDetailPage from './Pages/courseDetailPage/CourseDetailPage';
import Header from './Components/header/header';
import Footer from './Components/footer/Footer';
import SubjectCategoryPage from './Pages/categoryDetailPage/CategoryDetailPage.jsx' // Import your new category page component
import CategoryContentPage from './Pages/CategoryContentPage/CategoryContentPage.jsx'
import AdminDashboard from './Components/AdminDashboard.jsx';
function App () {
  return (
    <Router>
      <div className='container'>
        <Header />
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/class/:classId' element={<ClassDetailPage />} />
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
