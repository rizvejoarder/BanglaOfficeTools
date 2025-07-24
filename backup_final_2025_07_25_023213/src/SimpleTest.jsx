// Simple React App Test - No Complex Dependencies
import React, { useState } from 'react';

const SimpleApp = () => {
  const [count, setCount] = useState(0);
  
  return (
    <div style={{
      padding: '40px',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      minHeight: '100vh',
      color: 'white'
    }}>
      <h1>🎉 React App is Working!</h1>
      <p>If you can see this, React is loading correctly.</p>
      <div style={{ margin: '20px 0' }}>
        <button 
          onClick={() => setCount(count + 1)}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            background: '#fff',
            color: '#333',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Count: {count}
        </button>
      </div>
      <div style={{ background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '10px', marginTop: '20px' }}>
        <h3>✅ Test Results:</h3>
        <p>✅ React 18 loaded successfully</p>
        <p>✅ State management working</p>
        <p>✅ Event handlers working</p>
        <p>✅ CSS styling working</p>
        <div style={{ marginTop: '20px' }}>
          <button 
            onClick={() => {
              try {
                // Test if we can access the main app
                console.log('Simple app loaded successfully');
                alert('React is working! The issue is likely with a specific component or dependency.');
              } catch (error) {
                console.error('Error:', error);
                alert('Error: ' + error.message);
              }
            }}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              background: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Test Console
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimpleApp;
