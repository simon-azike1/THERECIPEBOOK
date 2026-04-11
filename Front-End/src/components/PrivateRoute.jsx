import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!user.isApproved) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Pending Approval</h2>
          <p className="text-gray-600 mb-6">Your account is waiting for admin approval. You'll be notified via WhatsApp once approved.</p>
          <button 
            onClick={() => { localStorage.removeItem('userToken'); window.location.href = '/login'; }}
            className="text-[#3a5d8f] hover:text-emerald-600 font-medium"
          >
            Log out and try again later
          </button>
        </div>
      </div>
    );
  }

  return <Outlet />;
};

export default PrivateRoute; 