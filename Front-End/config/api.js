const BASE = import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const USER_API  = `${BASE}/api/v1/user`;
export const ADMIN_API = `${BASE}/api/v1/admin`;

export default BASE;