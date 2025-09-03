import VendorTable from './VendorTable';
import VendorRecommendationForm from './VendorRecommendationForm';

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <Router>
      <nav style={{ padding: '1rem' }}>
        <Link to="/">Home</Link> | <Link to="/vendors">Vendors</Link> | <Link to="/recommend">Recommend</Link>
      </nav>
      <Routes>
        <Route path="/" element={
          <div className="App">
            <header className="App-header">
              <p>Welcome to the React Frontend!</p>
            </header>
          </div>
        } />
        <Route path="/vendors" element={<VendorTable />} />
        <Route path="/recommend" element={<VendorRecommendationForm />} />
      </Routes>
    </Router>
  );
}

export default App;
