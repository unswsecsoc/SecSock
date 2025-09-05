import { useState } from 'react';
import Cookies from 'js-cookie';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import EULA from './components/EULA';
import Home from './components/Home';
import Learn from './components/Learn';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [termsAccepted, setAccepted] = useState(Cookies.get('termsaccepted') === 'true');

  const handleAccept = () => {
    Cookies.set('termsaccepted', 'true', { expires: 30 });
    setAccepted(true);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute isAllowed={termsAccepted}>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/eula" element={<EULA onAccept={handleAccept} />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="*" element={<p>There's nothing here! 404</p>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
