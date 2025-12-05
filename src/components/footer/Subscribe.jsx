import React, { useState } from 'react';

const Subscribe = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      // FIX: Call our internal API route (which handles Apollo + Strapi)
      const response = await fetch('/api/subscribe-newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle "Already subscribed" (409) or other errors
        throw new Error(data.message || 'Failed to subscribe.');
      }

      // Handle success
      setStatus('success');
      setMessage(data.message || 'Thank you for subscribing!');
      setEmail('');

    } catch (error) {
      console.error('Subscription error:', error);
      setStatus('error');
      setMessage(error.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="position-relative">
        <input 
          type="email" 
          placeholder="Enter your email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required 
          disabled={status === 'loading'}
        />
        <button 
          type="submit" 
          className="tran3s fw-500 position-absolute"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Signing Up...' : 'Sign Up'}
        </button>
      </form>
      
      {/* Display feedback messages to the user */}
      {message && (
        <p style={{ 
          color: status === 'success' ? 'lightgreen' : '#ff7a7a',
          marginTop: '10px',
          fontSize: '14px'
        }}>
          {message}
        </p>
      )}
    </>
  );
};

export default Subscribe;