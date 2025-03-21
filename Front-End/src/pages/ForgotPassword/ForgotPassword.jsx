import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { sendResetEmail } from '../../features/auth/authSlice';
import toast from 'react-hot-toast';
import '../auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(sendResetEmail(email))
      .then(() => {
        toast.success('Password reset email sent! Please check your inbox.');
      })
      .catch((error) => {
        toast.error('Failed to send reset email. Please try again.');
      });
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-left">
          <div className="auth-header">
            <h1>Forgot Password</h1>
            <p>Enter your email to receive a password reset link</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="auth-button">
              Send Reset Link
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword; 