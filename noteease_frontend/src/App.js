import React from 'react';
import './App.css';
import MainContainer from './MainContainer';

// PUBLIC_INTERFACE
function App() {
  return (
    <div className="app" style={{ background: '#f6f6f6', minHeight: '100vh' }}>
      <MainContainer />
    </div>
  );
}

export default App;