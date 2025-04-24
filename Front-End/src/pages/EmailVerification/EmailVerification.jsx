import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { verifyEmail, reset } from '../../features/auth/authSlice';
import toast from 'react-hot-toast';
import './emailVerification.css';

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, isSuccess, isError, message } = useSelector(state => state.auth);

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      dispatch(verifyEmail(token));
    } else {
      toast.error('Verification token is missing');
      navigate('/login');
    }
  }, [searchParams, dispatch, navigate]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
      navigate('/login');
    }

    if (isSuccess) {
      toast.success('Email verified successfully! Please login to continue.');
      navigate('/login');
    }

    return () => {
      dispatch(reset());
    };
  }, [isSuccess, isError, message, navigate, dispatch]);

  return (
    <div className="verification-container">
      <div className="verification-card">
        {isLoading ? (
          <>
            <div className="verification-spinner"></div>
            <h2>Verifying your email...</h2>
            <p>Please wait while we verify your email address</p>
          </>
        ) : (
          <>
            <div className="verification-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </div>
            <h2>Verifying your email address</h2>
            <p>You will be redirected to the login page shortly...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default EmailVerification; 