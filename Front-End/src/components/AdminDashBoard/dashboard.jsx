import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  getAllUsers, 
  logout, 
  approveUser, 
  deleteUser, 
  updateUser,
  getUserById 
} from '../../features/auth/adminSlice';
import './adminDashb.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('users');
  const [showUserModal, setShowUserModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
  });

  const { admin, users, isLoading } = useSelector((state) => state.admin);

  useEffect(() => {
    if (!admin) {
      navigate('/admin/login');
    } else {
      dispatch(getAllUsers());
    }
  }, [admin, navigate, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/admin/login');
  };

  const handleApproveUser = async (userId) => {
    if (window.confirm('Are you sure you want to approve this user?')) {
      await dispatch(approveUser(userId));
      dispatch(getAllUsers()); // Refresh the users list
    }
  };

  const handleViewUser = async (userId) => {
    const result = await dispatch(getUserById(userId));
    if (!result.error) {
      setSelectedUser(result.payload);
      setShowUserModal(true);
    }
  };

  const handleEditUser = (user) => {
    setEditFormData({
      name: user.name,
      email: user.email,
    });
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    const result = await dispatch(updateUser({
      userId: selectedUser._id,
      userData: editFormData
    }));
    if (!result.error) {
      setShowEditModal(false);
      dispatch(getAllUsers());
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const result = await dispatch(deleteUser(userId));
      if (!result.error) {
        dispatch(getAllUsers());
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusCount = (status) => {
    if (status === 'total') return users.length;
    if (status === 'verified') return users.filter(user => user.isVerified).length;
    if (status === 'approved') return users.filter(user => user.isApproved).length;
    return users.filter(user => !user.isApproved).length;
  };

  if (isLoading) {
    return <div className="loading-screen">
      <div className="loader"></div>
      <p>Loading dashboard...</p>
    </div>;
  }

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>TheRecipeBook</h2>
          <span className="admin-role">Admin Panel</span>
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <i className="fas fa-users"></i>
            Users Management
          </button>
          <button 
            className={`nav-item ${activeTab === 'recipes' ? 'active' : ''}`}
            onClick={() => setActiveTab('recipes')}
          >
            <i className="fas fa-book"></i>
            Recipes
          </button>
          <button 
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <i className="fas fa-cog"></i>
            Settings
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="admin-info">
            <div className="admin-avatar">
              {admin?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="admin-details">
              <span className="admin-name">{admin?.email}</span>
              <span className="admin-status">Online</span>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="main-header">
          <div className="header-search">
            <i className="fas fa-search search-icon"></i>
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="header-actions">
            <button className="refresh-btn" onClick={() => dispatch(getAllUsers())}>
              <i className="fas fa-sync-alt"></i>
            </button>
          </div>
        </header>

        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon total">
              <i className="fas fa-users"></i>
            </div>
            <div className="stat-details">
              <h3>Total Users</h3>
              <p>{getStatusCount('total')}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon verified">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="stat-details">
              <h3>Verified Users</h3>
              <p>{getStatusCount('verified')}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon approved">
              <i className="fas fa-user-check"></i>
            </div>
            <div className="stat-details">
              <h3>Approved Users</h3>
              <p>{getStatusCount('approved')}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon pending">
              <i className="fas fa-user-clock"></i>
            </div>
            <div className="stat-details">
              <h3>Pending Approval</h3>
              <p>{getStatusCount('pending')}</p>
            </div>
          </div>
        </div>

        <div className="table-container">
          <div className="table-header">
            <h2>User Management</h2>
            <div className="table-actions">
              <button className="refresh-btn" onClick={() => dispatch(getAllUsers())}>
                <i className="fas fa-sync-alt"></i> Refresh
              </button>
              <button className="export-btn">
                <i className="fas fa-download"></i> Export Data
              </button>
            </div>
          </div>
          <table className="users-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Verification</th>
                <th>Status</th>
                <th>Registration Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>
                    <div className="user-info">
                      <div className="user-avatar">{user.name.charAt(0)}</div>
                      <div className="user-details">
                        <span className="user-name">{user.name}</span>
                        <span className="user-id">ID: {user._id.slice(-6)}</span>
                      </div>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`status ${user.isVerified ? 'verified' : 'unverified'}`}>
                      {user.isVerified ? 'Verified' : 'Unverified'}
                    </span>
                  </td>
                  <td>
                    <span className={`status ${user.isApproved ? 'approved' : 'pending'}`}>
                      {user.isApproved ? 'Approved' : 'Pending Approval'}
                    </span>
                  </td>
                  <td>
                    <div className="date-info">
                      <span>{formatDate(user.createdAt)}</span>
                    </div>
                  </td>
                  <td className="actions">
                    {!user.isApproved && (
                      <button 
                        className="action-btn approve"
                        onClick={() => handleApproveUser(user._id)}
                        title="Approve User"
                      >
                        <i className="fas fa-check"></i>
                      </button>
                    )}
                    <button 
                      className="action-btn view"
                      onClick={() => handleViewUser(user._id)}
                      title="View Details"
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                    <button 
                      className="action-btn edit"
                      onClick={() => handleEditUser(user)}
                      title="Edit User"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button 
                      className="action-btn delete"
                      onClick={() => handleDeleteUser(user._id)}
                      title="Delete User"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* User Details Modal */}
        {showUserModal && selectedUser && (
          <div className="modal">
            <div className="modal-content">
              <div className="modal-header">
                <h2>User Details</h2>
                <button onClick={() => setShowUserModal(false)} className="close-btn">
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="modal-body">
                <div className="user-detail">
                  <label>Name:</label>
                  <p>{selectedUser.name}</p>
                </div>
                <div className="user-detail">
                  <label>Email:</label>
                  <p>{selectedUser.email}</p>
                </div>
                <div className="user-detail">
                  <label>Status:</label>
                  <p>
                    <span className={`status ${selectedUser.isApproved ? 'approved' : 'pending'}`}>
                      {selectedUser.isApproved ? 'Approved' : 'Pending'}
                    </span>
                  </p>
                </div>
                <div className="user-detail">
                  <label>Verification:</label>
                  <p>
                    <span className={`status ${selectedUser.isVerified ? 'verified' : 'unverified'}`}>
                      {selectedUser.isVerified ? 'Verified' : 'Unverified'}
                    </span>
                  </p>
                </div>
                <div className="user-detail">
                  <label>Created:</label>
                  <p>{new Date(selectedUser.createdAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit User Modal */}
        {showEditModal && selectedUser && (
          <div className="modal">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Edit User</h2>
                <button onClick={() => setShowEditModal(false)} className="close-btn">
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleUpdateUser}>
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      value={editFormData.name}
                      onChange={(e) => setEditFormData({
                        ...editFormData,
                        name: e.target.value
                      })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={editFormData.email}
                      onChange={(e) => setEditFormData({
                        ...editFormData,
                        email: e.target.value
                      })}
                      required
                    />
                  </div>
                  <div className="modal-actions">
                    <button type="button" onClick={() => setShowEditModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="save-btn">
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
