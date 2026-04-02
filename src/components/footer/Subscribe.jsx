import React, { useState, useEffect, useRef } from 'react';

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

const Subscribe = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'
  const [message, setMessage] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const turnstileRef = useRef(null);
  const turnstileWidgetId = useRef(null);

  // Load Cloudflare Turnstile script and render widget
  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return;
    if (!document.getElementById('cf-turnstile-script')) {
      const script = document.createElement('script');
      script.id = 'cf-turnstile-script';
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      document.head.appendChild(script);
    }
    const interval = setInterval(() => {
      if (window.turnstile && turnstileRef.current && turnstileWidgetId.current === null) {
        clearInterval(interval);
        turnstileWidgetId.current = window.turnstile.render(turnstileRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          theme: 'dark',
          size: 'compact',
          callback: (token) => setTurnstileToken(token),
          'expired-callback': () => setTurnstileToken(''),
        });
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/subscribe-newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, turnstileToken }),
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
      setTurnstileToken('');
      if (turnstileWidgetId.current !== null && window.turnstile) {
        window.turnstile.reset(turnstileWidgetId.current);
      }

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
          disabled={status === 'loading' || (TURNSTILE_SITE_KEY && !turnstileToken)}
        >
          {status === 'loading' ? 'Signing Up...' : 'Sign Up'}
        </button>
      </form>
      {TURNSTILE_SITE_KEY && (
        <div ref={turnstileRef} style={{ marginTop: '10px' }} />
      )}
      
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