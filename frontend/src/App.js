import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing.jsx';
import Dashboard from './pages/Dashboard.jsx';

function App() {
  const [apiData, setApiData] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing onDataLoaded={setApiData} />} />
        <Route path="/dashboard" element={<Dashboard data={apiData} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
