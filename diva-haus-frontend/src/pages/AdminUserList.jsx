import React, { useState, useEffect } from 'react';
import { Trash2, Shield, User, Check, Loader2, Search } from 'lucide-react';
import { getUsers, deleteUser, adminUpdateUser } from '../api';
import { toast } from '../components/Toaster';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';

const AdminUserList = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data || []);
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
        setUsers((prev) => prev.filter((u) => u._id !== id));
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

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground italic">View and manage registered customers</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="animate-spin text-gold" size={32} />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-center">Admin Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
                            <User className="w-5 h-5 text-gold" />
                          </div>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-xs text-muted-foreground font-mono">{user._id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-foreground/70">{user.email}</TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          <button 
                            onClick={() => toggleAdminHandler(user)}
                            className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                              user.isAdmin 
                                ? 'bg-gold text-black' 
                                : 'bg-white/5 text-muted-foreground border border-glass-border/20 hover:border-gold/30 hover:text-foreground'
                            }`}
                          >
                            {user.isAdmin ? <Shield size={14} /> : <User size={14} />}
                            {user.isAdmin ? 'Admin' : 'Customer'}
                          </button>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={user.isAdmin}
                          className={`hover:text-red-500 hover:bg-red-500/10 ${user.isAdmin ? 'opacity-20 cursor-not-allowed' : ''}`}
                          onClick={() => deleteHandler(user._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredUsers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                        No users found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUserList;
