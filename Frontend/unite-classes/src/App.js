import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import HomePage from './Pages/homePage/HomePage.jsx';
import ClassDetailPage from './Pages/classDetailPage/ClassDetailPage';
import CourseDetailPage from './Pages/courseDetailPage/CourseDetailPage';
import UploadContentPage from './Pages/uploadContentPage/UploadContentPage';
import Header from './Components/header/header';
import Footer from './Components/footer/Footer';

function App() {
  return (
    <Router>
      <div className="container">
        <Header/>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/class/:classId" element={<ClassDetailPage />} />
          <Route path="/course/:courseId" element={<CourseDetailPage />} />
          <Route path="/upload/:courseId" element={<UploadContentPage />} />
        </Routes>
        <Footer/>
      </div>
    </Router>
  );
}

export default App;
