import React from "react";
import './adminDashb.css';

const adminDashboard = () => {
  const handleAddTask = () => {
    alert("Add Task functionality to be implemented!");
  };

  const handleLogout = () => {
    alert("Logout functionality to be implemented!");
  };

  const adminTasks = [
    { name: "Recipe Management", category: "Content", action: "Read/Update/Delete/Edit" },
    { name: "User Accounts", category: "Users", action: "Delete/Approve/Update" },
    { name: "Language Options", category: "Languages", action: "Delete/Approve/Update" },
    { name: "System Analytics", category: "Metrics", action: "Read/Update/Delete" }
  ];

  return (
    <div className="dashboard">
      {/* Sidebar Section */}
      <div className="sidebar">
        <ul>
          <li><a href="/manage-content">Dashboard</a></li>
          <li><a href="/manage-users">Users</a></li>
          <li><a href="/manage-languages">Languages</a></li>
          <li><a href="/manage-metrics">Metrics</a></li>
          <li><a href="/content">Content</a></li>
          <li><a href="/settings">Settings</a></li>
        
        </ul>
      </div>

      {/* Main Content Section */}
      <div className="main-content">
        {/* Header Section */}
        <div className="header">
          <input type="text" placeholder="Search admin tasks..." />
          <button onClick={handleAddTask}>Add New Task</button>
          <button onClick={handleLogout}>Logout</button>
        </div>

        {/* Metrics Section */}
        <div className="metrics">
          <div className="metric-card">
            <h3>Users</h3>
            <p>Number of users: 100</p>
          </div>
          <div className="metric-card">
            <h3>Content Management</h3>
            <p>Number of contents: 50</p>
          </div>
        </div>

        {/* Admin Tasks Table */}
        <table className="admin-tasks-table">
          <thead>
            <tr>
              <th>Entity</th>
              <th>Category</th>
              <th>Action</th>
              <th>Operations</th>
            </tr>
          </thead>
          <tbody>
            {adminTasks.map((task, index) => (
              <tr key={index}>
                <td>{task.name}</td>
                <td>{task.category}</td>
                <td>{task.action}</td>
                <td>
                  <button>Read</button>
                  <button>Edit</button>
                  <button>Update</button>
                  <button>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default adminDashboard;
