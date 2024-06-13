import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import FileUpload from './components/FileUpload'; // Changed import statement
import './FileUpload.css'; // Ensure this matches your file name

import Header from './components/Header';

const App = () => {
  return (
    <Router>
      <div>
        <Header />
       
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/file-upload" element={<FileUpload />} /> {/* Changed route */}
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
