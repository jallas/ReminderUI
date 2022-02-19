/* global chrome */
import React, { useEffect, useState } from 'react';
import './App.css';
import './assets/css/style.css';
import Reminder from '../src/pages/Reminder'

function App() {
 
  const [url, setUrl] = useState('');

  useEffect(() => {
    const queryInfo = {active: true, lastFocusedWindow: true};
    // eslint-disable-next-line no-undef
    chrome.tabs && chrome.tabs.query(queryInfo, tabs => {
        const url = tabs[0].url;
        setUrl(url);
    });
}, []);

  return (
   <Reminder/>
  );
}

export default App;
