import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ArrowLeft, Shield, User, Check, X, Loader2 } from 'lucide-react';
import { getUsers, deleteUser, adminUpdateUser } from '../api';
import { toast } from '../components/Toaster';
import HolographicContainer from '../components/HolographicContainer';

const AdminUserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      toast.error(error.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id);
        toast.success('User removed');
        fetchUsers();
      } catch (error) {
        toast.error(error.message || 'Failed to delete user');
      }
    }
  };

  const toggleAdminHandler = async (user) => {
    try {
      await adminUpdateUser({
        ...user,
        isAdmin: !user.isAdmin
      });
      toast.success(`User ${user.isAdmin ? 'demoted' : 'promoted'} successfully`);
      fetchUsers();
    } catch (error) {
      toast.error(error.message || 'Failed to update user');
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <div className="mb-8">
        <Link to="/admin" className="text-gold flex items-center gap-2 mb-2 hover:underline">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        <h1 className="text-3xl font-serif tracking-tight">User <span className="text-gradient-gold">Management</span></h1>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-gold" size={40} />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-glass-border/30">
                <th className="py-4 px-4 font-medium text-gold/80">ID</th>
                <th className="py-4 px-4 font-medium text-gold/80">NAME</th>
                <th className="py-4 px-4 font-medium text-gold/80">EMAIL</th>
                <th className="py-4 px-4 font-medium text-gold/80 text-center">ADMIN</th>
                <th className="py-4 px-4 font-medium text-gold/80 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b border-glass-border/10 hover:bg-white/5 transition-colors group">
                  <td className="py-4 px-4 text-xs font-mono text-foreground/40">{user._id.substring(user._id.length - 6)}</td>
                  <td className="py-4 px-4 font-medium">
                    <div className="flex items-center gap-2">
                      {user.isAdmin ? <Shield size={16} className="text-gold" /> : <User size={16} className="text-foreground/40" />}
                      {user.name}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-foreground/70">{user.email}</td>
                  <td className="py-4 px-4">
                    <div className="flex justify-center">
                      <button 
                        onClick={() => toggleAdminHandler(user)}
                        className={`p-1.5 rounded-md transition-all ${user.isAdmin ? 'bg-gold/20 text-gold' : 'bg-white/5 text-foreground/20 hover:text-foreground/40'}`}
                        title={user.isAdmin ? "Remove Admin Privileges" : "Make Admin"}
                      >
                        {user.isAdmin ? <Check size={18} /> : <Shield size={18} />}
                      </button>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => deleteHandler(user._id)}
                        disabled={user.isAdmin}
                        className={`p-2 rounded-lg transition-all ${user.isAdmin ? 'opacity-20 cursor-not-allowed' : 'text-foreground/60 hover:text-red-500 hover:bg-red-500/10'}`}
                        title={user.isAdmin ? "Cannot delete admin" : "Delete User"}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUserList;
