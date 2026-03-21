import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
  getAllUsers, logout, approveUser, deleteUser, updateUser, getUserById
} from '../../features/auth/adminSlice';
import {
  Users, BookOpen, LogOut, Search, RefreshCw, Eye, Edit2, Trash2,
  CheckCircle, XCircle, Clock, UserCheck, Shield, AlertCircle, X,
  TrendingUp, ChefHat, BarChart3, Menu, Flame, Star, Settings,
  ArrowUpRight, Lock, EyeOff, Save, Loader2, Sparkles, ArrowRight,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const BASE = 'http://localhost:5000/api/v1';
const HERO = 'https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=2070&q=80';

const getAdminConfig = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
});

// ─── Sparkline bar ────────────────────────────────────────────────────────────
const Sparkbar = ({ data, color }) => {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-0.5 h-7">
      {data.map((v, i) => (
        <div key={i} className="flex-1 rounded-sm transition-all"
          style={{ height: `${(v / max) * 100}%`, backgroundColor: color, opacity: 0.3 + (i / data.length) * 0.7 }} />
      ))}
    </div>
  );
};

// ─── Stat card — glassmorphism matching MealPlanning ─────────────────────────
const StatCard = ({ label, value, icon: Icon, gradient, sparkData, sparkColor, delay, change }) => (
  <motion.div
    initial={{ y: 24, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay, duration: 0.4, ease: 'easeOut' }}
    className="bg-white/60 backdrop-blur-xl rounded-3xl p-5 border border-white/60 shadow-lg hover:shadow-xl hover:bg-white/70 transition-all group"
  >
    <div className="flex items-start justify-between mb-4">
      <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      {change !== undefined && (
        <span className={`flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full
          ${change >= 0 ? 'text-emerald-700 bg-emerald-100/80' : 'text-red-600 bg-red-100/80'}`}>
          <ArrowUpRight className={`w-3 h-3 ${change < 0 ? 'rotate-180' : ''}`} />
          {Math.abs(change)}%
        </span>
      )}
    </div>
    <p className="text-3xl font-black text-gray-900 mb-0.5">{value}</p>
    <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3">{label}</p>
    {sparkData && <Sparkbar data={sparkData} color={sparkColor} />}
  </motion.div>
);

// ─── Password input ───────────────────────────────────────────────────────────
const PasswordInput = ({ label, value, onChange, placeholder }) => {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      <div className="relative">
        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type={show ? 'text' : 'password'} value={value} onChange={onChange} placeholder={placeholder}
          className="w-full pl-10 pr-11 py-3 rounded-2xl bg-white/50 backdrop-blur-sm border-2 border-gray-200/50 focus:border-[#3a5d8f]/70 focus:ring-4 focus:ring-[#3a5d8f]/10 transition-all text-sm placeholder-gray-400 font-medium outline-none"
          required />
        <button type="button" onClick={() => setShow(v => !v)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

// ─── Main ─────────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const dispatch = useDispatch();
  const nav      = useNavigate();

  const [activeTab,     setActiveTab]     = useState('users');
  const [searchTerm,    setSearchTerm]    = useState('');
  const [statusFilter,  setStatusFilter]  = useState('all');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [showUserModal, setShowUserModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser,  setSelectedUser]  = useState(null);
  const [editFormData,  setEditFormData]  = useState({ name: '', email: '' });

  const [recipes,        setRecipes]        = useState([]);
  const [recipesLoading, setRecipesLoading] = useState(false);

  const [pwForm,   setPwForm]   = useState({ current: '', newPw: '', confirm: '' });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwError,  setPwError]  = useState('');

  const { admin, users, isLoading } = useSelector((s) => s.admin);

  useEffect(() => {
    if (!admin) nav('/admin/login');
    else dispatch(getAllUsers());
  }, [admin, nav, dispatch]);

  useEffect(() => {
    if (activeTab !== 'recipes') return;
    const load = async () => {
      setRecipesLoading(true);
      try {
        const { data } = await axios.get(`${BASE}/admin/recipes`, getAdminConfig());
        setRecipes(data.data || []);
      } catch { toast.error('Failed to load recipes'); }
      finally { setRecipesLoading(false); }
    };
    load();
  }, [activeTab]);

  const handleLogout  = () => { dispatch(logout()); nav('/admin/login'); };
  const handleApprove = async (id) => {
    if (!window.confirm('Approve this user?')) return;
    await dispatch(approveUser(id)); dispatch(getAllUsers()); toast.success('User approved! ✓');
  };
  const handleView    = async (id) => {
    const r = await dispatch(getUserById(id));
    if (!r.error) { setSelectedUser(r.payload); setShowUserModal(true); }
  };
  const handleEdit    = (user) => { setEditFormData({ name: user.name, email: user.email }); setSelectedUser(user); setShowEditModal(true); };
  const handleUpdate  = async (e) => {
    e.preventDefault();
    const r = await dispatch(updateUser({ userId: selectedUser._id, userData: editFormData }));
    if (!r.error) { setShowEditModal(false); dispatch(getAllUsers()); toast.success('User updated!'); }
  };
  const handleDelete  = async (id) => {
    if (!window.confirm('Delete this user? This cannot be undone.')) return;
    const r = await dispatch(deleteUser(id));
    if (!r.error) { dispatch(getAllUsers()); toast.success('User deleted'); }
  };
  const handleDeleteRecipe = async (id) => {
    if (!window.confirm('Delete this recipe permanently?')) return;
    try {
      await axios.delete(`${BASE}/admin/recipes/${id}`, getAdminConfig());
      setRecipes(prev => prev.filter(r => r._id !== id));
      toast.success('Recipe deleted');
    } catch { toast.error('Failed to delete recipe'); }
  };
  const handleChangePassword = async (e) => {
    e.preventDefault(); setPwError('');
    if (pwForm.newPw !== pwForm.confirm) { setPwError('Passwords do not match'); return; }
    if (pwForm.newPw.length < 8) { setPwError('Password must be at least 8 characters'); return; }
    setPwSaving(true);
    try {
      await axios.patch(`${BASE}/admin/settings/change-password`,
        { adminId: admin?._id, currentPassword: pwForm.current, newPassword: pwForm.newPw },
        getAdminConfig()
      );
      toast.success('Password changed!');
      setPwForm({ current: '', newPw: '', confirm: '' });
    } catch (err) { setPwError(err.response?.data?.message || 'Failed to change password'); }
    finally { setPwSaving(false); }
  };

  const fmt  = (d) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  const total    = users.length;
  const verified = users.filter(u => u.isVerified).length;
  const approved = users.filter(u => u.isApproved).length;
  const pending  = users.filter(u => !u.isApproved).length;
  const spark    = (base) => Array.from({ length: 7 }, (_, i) => Math.max(1, Math.round(base * (0.4 + (i / 6) * 0.6))));

  const stats = [
    { label: 'Total Users',  value: total,    icon: Users,     gradient: 'from-[#3a5d8f] to-blue-500',    sparkData: spark(total),    sparkColor: '#3a5d8f', change: 12,  delay: 0    },
    { label: 'Verified',     value: verified, icon: Shield,    gradient: 'from-emerald-500 to-teal-400',  sparkData: spark(verified), sparkColor: '#10b981', change: 8,   delay: 0.07 },
    { label: 'Approved',     value: approved, icon: UserCheck, gradient: 'from-violet-500 to-purple-400', sparkData: spark(approved), sparkColor: '#8b5cf6', change: 5,   delay: 0.14 },
    { label: 'Pending',      value: pending,  icon: Clock,     gradient: 'from-amber-400 to-orange-400',  sparkData: spark(pending),  sparkColor: '#f59e0b', change: -3,  delay: 0.21 },
  ];

  const filteredUsers = useMemo(() => users.filter(u => {
    const q = searchTerm.toLowerCase();
    const matchSearch = u.email.toLowerCase().includes(q) || u.name.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'all' ? true : statusFilter === 'pending' ? !u.isApproved : u.isApproved;
    return matchSearch && matchStatus;
  }), [users, searchTerm, statusFilter]);

  const filteredRecipes = useMemo(() =>
    recipes.filter(r => r.recipeName?.toLowerCase().includes(searchTerm.toLowerCase()) || !searchTerm),
    [recipes, searchTerm]
  );

  const navItems = [
    { id: 'users',     icon: Users,    label: 'Users',    badge: pending        },
    { id: 'recipes',   icon: ChefHat,  label: 'Recipes',  badge: recipes.length },
    { id: 'analytics', icon: BarChart3, label: 'Analytics'                      },
    { id: 'settings',  icon: Settings, label: 'Settings'                        },
  ];

  if (isLoading) return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-blue-50/40 to-emerald-50/50 flex items-center justify-center">
      <div className="text-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-14 h-14 border-4 border-[#3a5d8f]/20 border-t-[#3a5d8f] rounded-2xl mx-auto mb-4" />
        <p className="text-gray-500 font-medium">Loading dashboard…</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-blue-50/40 to-emerald-50/50 flex relative overflow-hidden">

      {/* Background dot pattern */}
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#3a5d8f 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

      {/* Mobile overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)} />
        )}
      </AnimatePresence>

      {/* ── Sidebar ── */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72
        bg-white/70 backdrop-blur-xl border-r border-white/50 shadow-2xl
        flex flex-col transform transition-transform duration-300
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-white/40">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#3a5d8f] to-emerald-500 flex items-center justify-center shadow-lg shadow-[#3a5d8f]/30">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-black text-gray-900 leading-none">TheRecipeBook</p>
              <div className="flex items-center gap-1.5 mt-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Admin Panel</p>
              </div>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 p-5 space-y-2">
          {navItems.map(({ id, icon: Icon, label, badge }) => (
            <motion.button key={id}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => { setActiveTab(id); setIsSidebarOpen(false); setSearchTerm(''); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all
                ${activeTab === id
                  ? 'bg-gradient-to-r from-[#3a5d8f] to-emerald-500 text-white shadow-lg shadow-[#3a5d8f]/25'
                  : 'text-gray-600 hover:bg-white/60 hover:text-[#3a5d8f]'
                }`}>
              <span className="flex items-center gap-3"><Icon className="w-4 h-4" />{label}</span>
              {badge > 0 && (
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full min-w-[20px] text-center
                  ${activeTab === id ? 'bg-white/25 text-white' : 'bg-[#3a5d8f]/10 text-[#3a5d8f]'}`}>
                  {badge}
                </span>
              )}
            </motion.button>
          ))}
        </nav>

        {/* Admin profile + logout */}
        <div className="p-5 border-t border-white/40">
          <div className="flex items-center gap-3 mb-4 p-3 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/50">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3a5d8f] to-emerald-500 flex items-center justify-center text-white font-black shadow-md flex-shrink-0">
              {admin?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-800 truncate">{admin?.email}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <p className="text-[10px] text-emerald-600 font-semibold">Online</p>
              </div>
            </div>
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-semibold rounded-2xl border border-red-200/60 transition-colors">
            <LogOut className="w-4 h-4" /> Sign Out
          </motion.button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">

        {/* Hero banner */}
        <div className="relative h-44 overflow-hidden flex-shrink-0">
          <img src={HERO} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-stone-50/90" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#3a5d8f]/20 to-emerald-900/10" />

          {/* Floating food thumbnails */}
          {[
            'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80',
            'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=200&q=80',
          ].map((src, i) => (
            <div key={i} className={`absolute hidden lg:block rounded-2xl overflow-hidden border-2 border-white/30 shadow-2xl
              ${i === 0 ? 'right-8 top-4 w-20 h-20 rotate-3' : 'right-32 top-8 w-16 h-16 -rotate-2'}`}>
              <img src={src} alt="" className="w-full h-full object-cover" />
            </div>
          ))}

          {/* Header content */}
          <div className="absolute inset-0 flex items-end">
            <div className="w-full px-5 pb-4 flex items-end justify-between">
              <div className="flex items-center gap-3">
                <button onClick={() => setIsSidebarOpen(true)}
                  className="lg:hidden p-2 bg-white/20 backdrop-blur-sm text-white rounded-xl border border-white/30 mr-1">
                  <Menu className="w-5 h-5" />
                </button>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-amber-300 text-[11px] font-bold tracking-widest uppercase">Dashboard</span>
                  </div>
                  <h1 className="text-2xl font-black text-white leading-none capitalize">{activeTab}</h1>
                </div>
              </div>

              {/* Search + refresh */}
              <div className="hidden sm:flex items-center gap-2">
                {['users', 'recipes'].includes(activeTab) && (
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
                    <input type="text" placeholder={`Search ${activeTab}…`}
                      value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                      className="pl-9 pr-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl text-sm text-white placeholder-white/50 focus:outline-none focus:bg-white/30 transition-all w-48" />
                  </div>
                )}
                <button onClick={() => dispatch(getAllUsers())}
                  className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-xl border border-white/30 hover:bg-white/30 transition-all">
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-auto px-5 md:px-7 py-6">

          {/* Mobile search */}
          {['users', 'recipes'].includes(activeTab) && (
            <div className="relative sm:hidden mb-5">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder={`Search ${activeTab}…`}
                value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/50 focus:outline-none focus:ring-2 focus:ring-[#3a5d8f]/20 text-sm" />
            </div>
          )}

          {/* ══ USERS ══════════════════════════════════════════════════ */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              {/* Stat cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((s, i) => <StatCard key={i} {...s} />)}
              </div>

              {/* Filter pills */}
              <div className="flex gap-2 overflow-x-auto pb-1">
                {[
                  { id: 'all',      label: `All (${total})`        },
                  { id: 'pending',  label: `Pending (${pending})`  },
                  { id: 'approved', label: `Approved (${approved})` },
                ].map(f => (
                  <button key={f.id} onClick={() => setStatusFilter(f.id)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition-all
                      ${statusFilter === f.id
                        ? 'bg-gradient-to-r from-[#3a5d8f] to-emerald-500 text-white border-transparent shadow-md'
                        : 'bg-white/60 backdrop-blur-sm text-gray-600 border-white/50 hover:border-[#3a5d8f]/40 hover:text-[#3a5d8f]'}`}>
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Users table */}
              <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px]">
                    <thead>
                      <tr className="border-b border-white/40 bg-white/30">
                        {['User', 'Email', 'Verified', 'Status', 'Joined', 'Actions'].map(h => (
                          <th key={h} className="text-left px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/30">
                      {filteredUsers.map((user, ui) => (
                        <motion.tr key={user._id}
                          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: ui * 0.03 }}
                          className="hover:bg-white/40 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#3a5d8f] to-emerald-500 flex items-center justify-center text-white text-sm font-black shadow-md flex-shrink-0">
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-bold text-gray-900 text-sm">{user.name}</p>
                                <p className="text-[10px] text-gray-400 font-mono">#{user._id.slice(-6)}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 font-medium">{user.email}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold
                              ${user.isVerified ? 'bg-emerald-100/80 text-emerald-700' : 'bg-gray-100/80 text-gray-500'}`}>
                              {user.isVerified ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                              {user.isVerified ? 'Yes' : 'No'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold
                              ${user.isApproved ? 'bg-blue-100/80 text-blue-700' : 'bg-amber-100/80 text-amber-700'}`}>
                              {user.isApproved ? <UserCheck className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                              {user.isApproved ? 'Approved' : 'Pending'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">{fmt(user.createdAt)}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1.5 opacity-50 group-hover:opacity-100 transition-opacity">
                              {!user.isApproved && (
                                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                  onClick={() => handleApprove(user._id)}
                                  className="p-1.5 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all shadow-sm" title="Approve">
                                  <CheckCircle className="w-3.5 h-3.5" />
                                </motion.button>
                              )}
                              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                onClick={() => handleView(user._id)}
                                className="p-1.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white transition-all shadow-sm" title="View">
                                <Eye className="w-3.5 h-3.5" />
                              </motion.button>
                              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                onClick={() => handleEdit(user)}
                                className="p-1.5 rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white transition-all shadow-sm" title="Edit">
                                <Edit2 className="w-3.5 h-3.5" />
                              </motion.button>
                              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                onClick={() => handleDelete(user._id)}
                                className="p-1.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-500 hover:text-white transition-all shadow-sm" title="Delete">
                                <Trash2 className="w-3.5 h-3.5" />
                              </motion.button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredUsers.length === 0 && (
                    <div className="py-20 text-center">
                      <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-gray-500 font-medium">No users found</p>
                      {searchTerm && <button onClick={() => setSearchTerm('')} className="text-[#3a5d8f] text-sm mt-2 hover:underline">Clear search</button>}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ══ RECIPES ════════════════════════════════════════════════ */}
          {activeTab === 'recipes' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { label: 'Total Recipes',   value: recipes.length, icon: ChefHat, gradient: 'from-[#3a5d8f] to-blue-500', delay: 0    },
                  { label: 'Unique Cuisines', value: [...new Set(recipes.map(r => r.cuisineType))].length, icon: Flame, gradient: 'from-orange-400 to-rose-500', delay: 0.08 },
                  { label: 'Avg Rating',      value: recipes.length ? (recipes.reduce((s, r) => s + (r.rating || 0), 0) / recipes.length).toFixed(1) : '—', icon: Star, gradient: 'from-amber-400 to-yellow-400', delay: 0.16 },
                ].map((s, i) => (
                  <motion.div key={i} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: s.delay }}
                    className="bg-white/60 backdrop-blur-xl rounded-3xl p-5 border border-white/50 shadow-lg">
                    <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${s.gradient} flex items-center justify-center mb-3 shadow-lg`}>
                      <s.icon className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-2xl font-black text-gray-900">{s.value}</p>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{s.label}</p>
                  </motion.div>
                ))}
              </div>

              <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl overflow-hidden">
                {recipesLoading ? (
                  <div className="py-20 flex items-center justify-center gap-3 text-gray-400">
                    <Loader2 className="w-6 h-6 animate-spin text-[#3a5d8f]" />
                    <span className="font-medium">Loading recipes…</span>
                  </div>
                ) : filteredRecipes.length === 0 ? (
                  <div className="py-20 text-center">
                    <ChefHat className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-gray-500 font-medium">No recipes found</p>
                    {!recipes.length && <p className="text-xs text-gray-400 mt-1">Recipes created by users will appear here</p>}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px]">
                      <thead>
                        <tr className="border-b border-white/40 bg-white/30">
                          {['Recipe', 'Owner', 'Cuisine', 'Difficulty', 'Time', 'Actions'].map(h => (
                            <th key={h} className="text-left px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/30">
                        {filteredRecipes.map((recipe, ri) => (
                          <motion.tr key={recipe._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: ri * 0.025 }}
                            className="hover:bg-white/40 transition-colors group">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100 shadow-sm">
                                  {recipe.recipeImage
                                    ? <img src={recipe.recipeImage} alt={recipe.recipeName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                                    : <div className="w-full h-full flex items-center justify-center"><ChefHat className="w-5 h-5 text-gray-300" /></div>
                                  }
                                </div>
                                <p className="font-bold text-gray-900 text-sm line-clamp-1 max-w-[130px]">{recipe.recipeName}</p>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm font-semibold text-gray-700">{recipe.userId?.name || '—'}</p>
                              <p className="text-[10px] text-gray-400">{recipe.userId?.email || ''}</p>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-xs font-semibold text-gray-600 bg-white/60 px-2.5 py-1 rounded-full border border-white/50">{recipe.cuisineType}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                                recipe.difficultyLevel === 'Easy'   ? 'bg-emerald-100/80 text-emerald-700' :
                                recipe.difficultyLevel === 'Medium' ? 'bg-amber-100/80 text-amber-700' : 'bg-red-100/80 text-red-700'
                              }`}>{recipe.difficultyLevel}</span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                              {(recipe.preparationTime || 0) + (recipe.cookingTime || 0)} min
                            </td>
                            <td className="px-6 py-4">
                              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                onClick={() => handleDeleteRecipe(recipe._id)}
                                className="p-1.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm opacity-50 group-hover:opacity-100">
                                <Trash2 className="w-3.5 h-3.5" />
                              </motion.button>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ══ ANALYTICS ══════════════════════════════════════════════ */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((s, i) => <StatCard key={i} {...s} />)}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Approval Rate',     value: total ? Math.round((approved / total) * 100) : 0, color: 'from-[#3a5d8f] to-blue-500',   desc: `${approved} of ${total} users` },
                  { label: 'Verification Rate', value: total ? Math.round((verified / total) * 100) : 0, color: 'from-emerald-500 to-teal-400', desc: `${verified} of ${total} users` },
                ].map(({ label, value, color, desc }) => (
                  <div key={label} className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/50 shadow-lg p-6">
                    <div className="flex items-end justify-between mb-5">
                      <div>
                        <p className="font-bold text-gray-800">{label}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                      </div>
                      <p className="text-4xl font-black bg-gradient-to-r from-[#3a5d8f] to-emerald-500 bg-clip-text text-transparent">{value}%</p>
                    </div>
                    <div className="w-full h-3 bg-white/40 rounded-full overflow-hidden border border-white/30">
                      <motion.div className={`h-full bg-gradient-to-r ${color} rounded-full shadow-sm`}
                        initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 0.9, ease: 'easeOut' }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/50 shadow-lg p-6">
                <h3 className="font-bold text-gray-900 mb-6">User Status Breakdown</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Approved',   count: approved,         gradient: 'from-[#3a5d8f] to-blue-500'   },
                    { label: 'Pending',    count: pending,          gradient: 'from-amber-400 to-orange-400'  },
                    { label: 'Verified',   count: verified,         gradient: 'from-emerald-500 to-teal-400'  },
                    { label: 'Unverified', count: total - verified, gradient: 'from-gray-300 to-gray-400'     },
                  ].map(({ label, count, gradient }) => (
                    <div key={label}>
                      <div className="flex justify-between text-sm font-semibold text-gray-600 mb-2">
                        <span>{label}</span>
                        <span className="text-gray-400 font-normal">{count} / {total}</span>
                      </div>
                      <div className="w-full h-2.5 bg-white/40 rounded-full overflow-hidden border border-white/30">
                        <motion.div className={`h-full bg-gradient-to-r ${gradient} rounded-full`}
                          initial={{ width: 0 }} animate={{ width: total ? `${(count / total) * 100}%` : '0%' }}
                          transition={{ duration: 0.8, ease: 'easeOut' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Total Recipes',   value: recipes.length, icon: ChefHat,    color: 'text-[#3a5d8f]'   },
                  { label: 'Unique Cuisines', value: [...new Set(recipes.map(r => r.cuisineType))].length, icon: Flame, color: 'text-orange-500' },
                  { label: 'Recipes / User',  value: total ? (recipes.length / total).toFixed(1) : '0', icon: TrendingUp, color: 'text-emerald-600' },
                ].map(({ label, value, icon: Icon, color }, i) => (
                  <motion.div key={label} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.08 }}
                    className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/50 shadow-lg p-5 text-center">
                    <Icon className={`w-8 h-8 mx-auto mb-3 ${color}`} />
                    <p className="text-2xl font-black text-gray-900">{value}</p>
                    <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wide mt-1">{label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* ══ SETTINGS ═══════════════════════════════════════════════ */}
          {activeTab === 'settings' && (
            <div className="max-w-lg space-y-6">
              {/* Account card */}
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/50 shadow-lg p-6">
                <h3 className="font-bold text-gray-900 mb-5">Account Information</h3>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#3a5d8f] to-emerald-500 flex items-center justify-center text-white text-2xl font-black shadow-xl shadow-[#3a5d8f]/20">
                    {admin?.email?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg">{admin?.email}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Shield className="w-4 h-4 text-[#3a5d8f]" />
                      <span className="text-sm font-bold text-[#3a5d8f]">Administrator</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Change password */}
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.08 }}
                className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/50 shadow-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#3a5d8f]/20 to-emerald-500/20 flex items-center justify-center border border-white/50">
                    <Lock className="w-5 h-5 text-[#3a5d8f]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Change Password</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Update your admin account password</p>
                  </div>
                </div>

                <form onSubmit={handleChangePassword} className="space-y-4">
                  <PasswordInput label="Current Password" value={pwForm.current} onChange={e => setPwForm(p => ({ ...p, current: e.target.value }))} placeholder="Enter current password" />
                  <PasswordInput label="New Password"     value={pwForm.newPw}   onChange={e => setPwForm(p => ({ ...p, newPw:   e.target.value }))} placeholder="At least 8 characters"  />
                  <PasswordInput label="Confirm Password" value={pwForm.confirm} onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))} placeholder="Repeat new password"     />

                  <AnimatePresence>
                    {pwError && (
                      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="flex items-center gap-2 p-3 bg-red-50/80 border border-red-200/60 rounded-2xl">
                        <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                        <p className="text-sm text-red-600 font-medium">{pwError}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.button type="submit" disabled={pwSaving}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-[#3a5d8f] to-emerald-500 hover:from-[#2c4a75] hover:to-emerald-600 disabled:opacity-50 text-white font-bold rounded-2xl shadow-xl shadow-[#3a5d8f]/25 transition-all">
                    {pwSaving
                      ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
                      : <><Save className="w-4 h-4" /> Update Password</>
                    }
                  </motion.button>
                </form>
              </motion.div>

              {/* Danger zone */}
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.16 }}
                className="bg-white/60 backdrop-blur-xl rounded-3xl border border-red-200/40 shadow-lg p-6">
                <h3 className="font-bold text-red-600 mb-1">Danger Zone</h3>
                <p className="text-xs text-gray-400 mb-5">Irreversible actions — proceed carefully.</p>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-2xl border border-red-200/60 transition-colors text-sm">
                  <LogOut className="w-4 h-4" /> Sign Out of Admin Panel
                </motion.button>
              </motion.div>
            </div>
          )}
        </div>
      </div>

      {/* ── Modals ── */}
      <AnimatePresence>
        {(showUserModal || showEditModal) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: 'spring', bounce: 0.2 }}
              className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-white/50"
            >
              {/* Modal header with food image */}
              <div className="relative h-20 overflow-hidden">
                <img src={HERO} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#3a5d8f]/80 to-emerald-700/60" />
                <div className="absolute inset-0 flex items-center justify-between px-6">
                  <h2 className="font-black text-white text-lg">{showUserModal ? 'User Details' : 'Edit User'}</h2>
                  <button onClick={() => { setShowUserModal(false); setShowEditModal(false); }}
                    className="w-8 h-8 bg-white/20 hover:bg-white/35 text-white rounded-full flex items-center justify-center transition-all">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                {showUserModal && selectedUser && (
                  <div className="space-y-3">
                    {[
                      { label: 'Name',         value: selectedUser.name },
                      { label: 'Email',        value: selectedUser.email },
                      { label: 'Status',       value: selectedUser.isApproved ? 'Approved' : 'Pending',    badge: selectedUser.isApproved ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700' },
                      { label: 'Verification', value: selectedUser.isVerified ? 'Verified' : 'Unverified', badge: selectedUser.isVerified ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600' },
                      { label: 'Joined',       value: new Date(selectedUser.createdAt).toLocaleString() },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/50">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">{item.label}</span>
                        <span className={`text-sm font-bold ${item.badge ? `px-3 py-1 rounded-full ${item.badge}` : 'text-gray-900'}`}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                )}
                {showEditModal && (
                  <form onSubmit={handleUpdate} className="space-y-4">
                    {[{ label: 'Name', field: 'name', type: 'text' }, { label: 'Email', field: 'email', type: 'email' }].map(({ label, field, type }) => (
                      <div key={field}>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
                        <input type={type} value={editFormData[field]}
                          onChange={e => setEditFormData({ ...editFormData, [field]: e.target.value })}
                          className="w-full px-5 py-3 rounded-2xl bg-white/50 backdrop-blur-sm border-2 border-gray-200/50 focus:border-[#3a5d8f]/70 focus:ring-4 focus:ring-[#3a5d8f]/10 transition-all text-sm outline-none font-medium" required />
                      </div>
                    ))}
                    <div className="flex gap-3 pt-2">
                      <button type="button" onClick={() => setShowEditModal(false)}
                        className="flex-1 py-3 bg-white/60 hover:bg-white/80 text-gray-700 font-semibold rounded-2xl border border-white/50 transition-all text-sm">Cancel</button>
                      <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        className="flex-1 py-3 bg-gradient-to-r from-[#3a5d8f] to-emerald-500 text-white font-bold rounded-2xl shadow-lg shadow-[#3a5d8f]/25 transition-all text-sm">
                        Save Changes
                      </motion.button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;