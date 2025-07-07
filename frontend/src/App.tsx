import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import './App.css';
import EULA from './components/EULA';
import Home from './components/Home';

function App() {
  const [termsaccepted, setAccepted] = useState(false);

  useEffect(() => {
    setAccepted(Cookies.get('termsaccepted') === 'true');
  }, []);

  const handleAccept = () => {
    Cookies.set('termsaccepted', 'true', { expires: 30 });
    setAccepted(true);
  };

  return <>{termsaccepted ? <Home /> : <EULA onAccept={handleAccept} />}</>;
}

export default App;
