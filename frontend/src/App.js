import VendorTable from './VendorTable';
import VendorRecommendationForm from './VendorRecommendationForm';

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <Router>
      <nav style={{ padding: '1rem' }}>
        <Link to="/">Vendors</Link> | <Link to="/recommend">Recommend</Link>
      </nav>
      <Routes>
        <Route path="/" element={<VendorTable />} />
        <Route path="/recommend" element={<VendorRecommendationForm />} />
      </Routes>
    </Router>
  );
}

export default App;
